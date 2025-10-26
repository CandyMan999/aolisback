const axios = require("axios");
const jwt = require("jsonwebtoken");
const zlib = require("zlib");

const DEFAULT_DELAY_DAYS = Number.isFinite(
  Number(process.env.APP_STORE_CONNECT_DELAY_DAYS)
)
  ? Number(process.env.APP_STORE_CONNECT_DELAY_DAYS)
  : 2;
const DOWNLOAD_GOAL = Number.isFinite(Number(process.env.AFFILIATE_DOWNLOAD_GOAL))
  ? Number(process.env.AFFILIATE_DOWNLOAD_GOAL)
  : 1000;
const CACHE_TTL_MINUTES = Number.isFinite(
  Number(process.env.APP_STORE_CONNECT_CACHE_MINUTES)
)
  ? Number(process.env.APP_STORE_CONNECT_CACHE_MINUTES)
  : 30;
const REPORT_SUBTYPE =
  process.env.APP_STORE_CONNECT_AFFILIATE_SUBTYPE || "SIAFFILIATE";
const SALES_REPORT_URL =
  process.env.APP_STORE_CONNECT_SALES_URL ||
  "https://api.appstoreconnect.apple.com/v1/salesReports";

const cache = {
  key: null,
  fetchedAt: 0,
  payload: null,
};

const getDefaultReportDate = () => {
  const delay = Number.isFinite(DEFAULT_DELAY_DAYS) ? DEFAULT_DELAY_DAYS : 2;
  const target = new Date();
  target.setUTCDate(target.getUTCDate() - delay);
  return target.toISOString().split("T")[0];
};

const formatPrivateKey = (privateKey) => {
  if (!privateKey) {
    return "";
  }

  const replaced = privateKey.replace(/\\n/g, "\n");

  if (replaced.includes("BEGIN")) {
    return replaced;
  }

  try {
    const decoded = Buffer.from(replaced, "base64").toString("utf8");
    if (decoded.includes("BEGIN")) {
      return decoded;
    }
  } catch (error) {
    // Swallow decoding errors and fall back to the original string.
  }

  return replaced;
};

const createJWT = () => {
  const keyId = process.env.APP_STORE_CONNECT_KEY_ID;
  const issuerId = process.env.APP_STORE_CONNECT_ISSUER_ID;
  const privateKey = formatPrivateKey(
    process.env.APP_STORE_CONNECT_PRIVATE_KEY || ""
  );

  if (!keyId || !issuerId || !privateKey) {
    throw new Error(
      "Missing App Store Connect credentials. Please verify APP_STORE_CONNECT_KEY_ID, APP_STORE_CONNECT_ISSUER_ID, and APP_STORE_CONNECT_PRIVATE_KEY environment variables."
    );
  }

  const payload = {
    iss: issuerId,
    aud: "appstoreconnect-v1",
    exp: Math.floor(Date.now() / 1000) + 60 * 5,
  };

  return jwt.sign(payload, privateKey, {
    algorithm: "ES256",
    header: {
      alg: "ES256",
      typ: "JWT",
      kid: keyId,
    },
  });
};

const findColumnIndex = (headers, candidates) => {
  return candidates.reduce((acc, candidate) => {
    if (acc !== -1) {
      return acc;
    }

    const index = headers.findIndex(
      (header) => header.trim().toLowerCase() === candidate.toLowerCase()
    );

    return index === -1 ? acc : index;
  }, -1);
};

const parseAffiliateReport = (reportContent) => {
  if (!reportContent) {
    return [];
  }

  const trimmed = reportContent.trim();

  if (!trimmed || /no data/i.test(trimmed)) {
    return [];
  }

  const lines = trimmed.split(/\r?\n/).filter(Boolean);
  if (lines.length <= 1) {
    return [];
  }

  const headers = lines[0].split("\t");
  let affiliateIndex = findColumnIndex(headers, [
    "affiliate",
    "affiliate name",
    "affiliate token",
    "affiliate_token",
    "partner",
    "partner name",
  ]);

  if (affiliateIndex === -1) {
    affiliateIndex = findColumnIndex(headers, ["provider", "title", "sku"]);
  }

  const unitsIndex = findColumnIndex(headers, ["units", "downloads", "quantity"]);

  if (affiliateIndex === -1 || unitsIndex === -1) {
    throw new Error(
      "Affiliate or units column could not be located in the App Store Connect report."
    );
  }

  const results = new Map();

  for (let i = 1; i < lines.length; i += 1) {
    const row = lines[i].split("\t");
    if (row.length <= Math.max(affiliateIndex, unitsIndex)) {
      continue;
    }

    const affiliateName = row[affiliateIndex]
      ? row[affiliateIndex].trim() || "Unknown Affiliate"
      : "Unknown Affiliate";

    const parsedUnits = parseInt(row[unitsIndex], 10);
    const units = Number.isFinite(parsedUnits) ? parsedUnits : 0;

    if (!results.has(affiliateName)) {
      results.set(affiliateName, 0);
    }

    results.set(affiliateName, results.get(affiliateName) + units);
  }

  return Array.from(results.entries())
    .map(([affiliateName, downloads]) => ({ affiliateName, downloads }))
    .sort((a, b) => b.downloads - a.downloads);
};

const deserializeReport = (buffer) => {
  if (!buffer || !buffer.length) {
    return "";
  }

  try {
    return zlib.gunzipSync(buffer).toString("utf8");
  } catch (error) {
    return buffer.toString("utf8");
  }
};

const minutesToMs = (minutes) => minutes * 60 * 1000;

const fetchAffiliateDownloads = async ({ reportDate } = {}) => {
  const vendorNumber = process.env.APP_STORE_CONNECT_VENDOR_NUMBER;

  if (!vendorNumber) {
    throw new Error(
      "Missing App Store Connect vendor number. Please set APP_STORE_CONNECT_VENDOR_NUMBER."
    );
  }

  const resolvedDate = reportDate || getDefaultReportDate();
  const cacheKey = `${resolvedDate}`;
  const now = Date.now();

  if (
    cache.key === cacheKey &&
    cache.payload &&
    now - cache.fetchedAt < minutesToMs(CACHE_TTL_MINUTES)
  ) {
    return cache.payload;
  }

  const token = createJWT();

  try {
    const response = await axios.get(SALES_REPORT_URL, {
      params: {
        "filter[reportType]": "SALES",
        "filter[reportSubType]": REPORT_SUBTYPE,
        "filter[frequency]": "DAILY",
        "filter[reportDate]": resolvedDate,
        "filter[vendorNumber]": vendorNumber,
      },
      responseType: "arraybuffer",
      timeout: 15000,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/a-gzip",
      },
    });

    if (response.status === 204) {
      const payload = {
        reportDate: resolvedDate,
        goal: DOWNLOAD_GOAL,
        affiliates: [],
      };
      cache.key = cacheKey;
      cache.fetchedAt = now;
      cache.payload = payload;
      return payload;
    }

    const reportText = deserializeReport(Buffer.from(response.data));
    const affiliates = parseAffiliateReport(reportText);

    const payload = {
      reportDate: resolvedDate,
      goal: DOWNLOAD_GOAL,
      affiliates,
    };

    cache.key = cacheKey;
    cache.fetchedAt = now;
    cache.payload = payload;

    return payload;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return {
        reportDate: resolvedDate,
        goal: DOWNLOAD_GOAL,
        affiliates: [],
      };
    }

    const detail =
      error.response?.data?.errors?.[0]?.detail || error.message || error.toString();

    throw new Error(`Failed to fetch App Store Connect affiliate downloads: ${detail}`);
  }
};

module.exports = {
  fetchAffiliateDownloads,
  DOWNLOAD_GOAL,
};
