// CloudflareVideo.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";
import { Box, Loading } from "../../components";
import { COLORS } from "../../constants";

// Build Cloudflare Stream URLs
export const cfUrls = (uid, bust) => {
  const q = bust ? `?cb=${bust}` : "";
  return {
    hls: `https://videodelivery.net/${uid}/manifest/video.m3u8${q}`,
    poster: `https://videodelivery.net/${uid}/thumbnails/thumbnail.jpg?time=0s`,
    // NOTE: MP4 works only if downloads are enabled on the asset/account.
    mp4: `https://videodelivery.net/${uid}/downloads/default.mp4${q}`,
  };
};

const CloudflareVideo = ({
  videoUrl,
  uid,
  controls = true,
  loop,
  poster,
  receiverWatching,
  handleViewVideo,
  handleFullScreen,
  onPlay,
  style,
  className,
  muted = false,
  autoPlay = false,
}) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const retryTimerRef = useRef(null);
  const attemptRef = useRef(0);
  const cacheBustRef = useRef(Date.now());

  const [isLoading, setIsLoading] = useState(!!uid);
  const [isRetrying, setIsRetrying] = useState(false);

  // HLS retry backoff
  const BASE_DELAY_MS = 800;
  const MAX_DELAY_MS = 8000;

  const clearRetryTimer = () => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  };

  const destroyHls = () => {
    if (hlsRef.current) {
      try {
        hlsRef.current.destroy();
      } catch {}
      hlsRef.current = null;
    }
  };

  const markLoaded = useCallback(() => {
    setIsLoading(false);
    setIsRetrying(false);
  }, []);

  const scheduleHlsRetry = useCallback(() => {
    // Only HLS retries (MP4 is a single try)
    destroyHls();
    clearRetryTimer();

    attemptRef.current += 1;
    setIsRetrying(true);

    const delay = Math.min(
      BASE_DELAY_MS * Math.pow(2, attemptRef.current - 1),
      MAX_DELAY_MS
    );

    retryTimerRef.current = setTimeout(() => {
      cacheBustRef.current = Date.now(); // refresh manifest
      startHls(); // keep falling back to HLS until it's ready
    }, delay);
  }, []);

  const attachReadyListeners = useCallback(
    (video) => {
      if (!video) return () => {};
      const onLoadedData = () => markLoaded();
      const onCanPlay = () => markLoaded();
      const onCanPlayThrough = () => markLoaded();
      const onPlaying = () => markLoaded();

      video.addEventListener("loadeddata", onLoadedData);
      video.addEventListener("canplay", onCanPlay);
      video.addEventListener("canplaythrough", onCanPlayThrough);
      video.addEventListener("playing", onPlaying);

      // If already playable (warm cache), don’t show loader
      if (video.readyState >= 3 /* HAVE_FUTURE_DATA */) {
        markLoaded();
      }

      return () => {
        video.removeEventListener("loadeddata", onLoadedData);
        video.removeEventListener("canplay", onCanPlay);
        video.removeEventListener("canplaythrough", onCanPlayThrough);
        video.removeEventListener("playing", onPlaying);
      };
    },
    [markLoaded]
  );

  // 1) Try MP4 first (fastest if enabled). On error, fall back to HLS.
  const tryMp4First = useCallback(() => {
    const v = videoRef.current;
    if (!v) return () => {};

    setIsLoading(true);
    setIsRetrying(false);

    const urls = cfUrls(uid); // mp4 doesn't need cache-busting
    const detach = attachReadyListeners(v);

    // If MP4 fails (e.g., downloads not enabled), go HLS
    const onError = () => {
      v.removeEventListener("error", onError);
      detach();
      startHls();
    };

    v.addEventListener("error", onError);
    v.src = urls.mp4;
    v.load?.();
    if (autoPlay) v.play?.().catch(() => {});

    return () => {
      v.removeEventListener("error", onError);
      detach();
    };
  }, [uid, attachReadyListeners, autoPlay]);

  // 2) HLS fallback (native on Safari/iOS or hls.js elsewhere) with retries
  const startHls = useCallback(() => {
    const v = videoRef.current;
    if (!v) return () => {};

    setIsLoading(true);
    const hlsUrl = cfUrls(uid, cacheBustRef.current).hls;

    // Native HLS (Safari/iOS)
    if (v.canPlayType && v.canPlayType("application/vnd.apple.mpegurl")) {
      const detach = attachReadyListeners(v);

      const onError = () => scheduleHlsRetry();
      v.addEventListener("error", onError);

      v.src = hlsUrl;
      v.load?.();
      if (autoPlay) v.play?.().catch(() => {});
      return () => {
        v.removeEventListener("error", onError);
        detach();
      };
    }

    // hls.js for other modern browsers
    if (Hls.isSupported()) {
      destroyHls();
      const hls = new Hls({ autoStartLoad: true });
      hlsRef.current = hls;

      // fatal errors → retry later (processing may still be underway)
      hls.on(Hls.Events.ERROR, (_evt, data) => {
        if (data && data.fatal) scheduleHlsRetry();
      });

      hls.loadSource(hlsUrl);
      hls.attachMedia(v);

      const detach = attachReadyListeners(v);
      return () => {
        detach();
        destroyHls();
      };
    }

    // (Very old browsers) last resort: MP4 again (will likely fail the same way)
    const detach = attachReadyListeners(v);
    v.src = cfUrls(uid).mp4;
    v.load?.();
    if (autoPlay) v.play?.().catch(() => {});
    return detach;
  }, [uid, attachReadyListeners, scheduleHlsRetry, autoPlay]);

  // Lifecycle
  useEffect(() => {
    attemptRef.current = 0;
    cacheBustRef.current = Date.now();
    clearRetryTimer();
    destroyHls();

    setIsLoading(!!uid);
    setIsRetrying(false);

    let cleanup = null;
    if (uid) {
      // MP4 first; if it errors, code falls back to HLS automatically.
      cleanup = tryMp4First();
    }

    return () => {
      if (typeof cleanup === "function") cleanup();
      clearRetryTimer();
      destroyHls();
    };
  }, [uid, tryMp4First]);

  const posterUrl = poster || (uid ? cfUrls(uid).poster : undefined);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* <video
        ref={videoRef}
        controls={controls}
        loop={loop}
        muted={muted}
        autoPlay={autoPlay}
        playsInline
        poster={posterUrl}
        onPlay={onPlay}
        className={className}
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          ...style,
        }}
      /> */}

      <video
        ref={videoRef}
        src={videoUrl}
        onPlay={onPlay}
        controls={controls}
        poster={posterUrl}
        onClick={handleFullScreen}
        loop
        style={{
          ...style,
        }}
      />

      {isLoading && (
        <Box
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <Loading ring size={72} color={COLORS.white} />
            <div style={{ color: COLORS.white, marginTop: 8, fontSize: 12 }}>
              {isRetrying ? "preparing your video…" : "loading…"}
            </div>
          </div>
        </Box>
      )}
    </div>
  );
};

export default CloudflareVideo;
