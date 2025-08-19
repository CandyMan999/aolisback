// CloudflareVideo.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";
import { Box, Loading } from "../../components";

import { COLORS } from "../../constants";

export const cfUrls = (uid, bust) => {
  const q = bust ? `?cb=${bust}` : "";
  return {
    hls: `https://videodelivery.net/${uid}/manifest/video.m3u8${q}`,
    poster: `https://videodelivery.net/${uid}/thumbnails/thumbnail.jpg?time=0s`,
    mp4: `https://videodelivery.net/${uid}/downloads/default.mp4${q}`, // only if downloads enabled
  };
};

const CloudflareVideo = ({
  uid,
  controls = true,
  loop = false,
  poster,
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
  const [failed, setFailed] = useState(false);

  const MAX_RETRIES = 2;
  const INITIAL_DELAY_MS = 600;

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
    setFailed(false);
  }, []);

  const scheduleRetry = useCallback(() => {
    destroyHls();
    clearRetryTimer();
    attemptRef.current += 1;
    if (attemptRef.current > MAX_RETRIES) {
      setIsRetrying(false);
      setIsLoading(false);
      setFailed(true); // <-- mark as failed so tap-to-retry can kick in
      return;
    }
    setIsRetrying(true);
    const delay = INITIAL_DELAY_MS * Math.pow(2, attemptRef.current - 1);
    retryTimerRef.current = setTimeout(() => {
      cacheBustRef.current = Date.now();
      startLoad();
    }, delay);
  }, []);

  const attachMediaEventListeners = useCallback(
    (video) => {
      if (!video) return () => {};
      const onLoadedData = () => markLoaded();
      const onCanPlay = () => markLoaded();
      const onPlaying = () => markLoaded();
      const onError = () => scheduleRetry();

      video.addEventListener("loadeddata", onLoadedData);
      video.addEventListener("canplay", onCanPlay);
      video.addEventListener("playing", onPlaying);
      video.addEventListener("error", onError);

      // Already ready?
      if (video.readyState >= 3 /* HAVE_FUTURE_DATA */) {
        markLoaded();
      }

      return () => {
        video.removeEventListener("loadeddata", onLoadedData);
        video.removeEventListener("canplay", onCanPlay);
        video.removeEventListener("playing", onPlaying);
        video.removeEventListener("error", onError);
      };
    },
    [markLoaded, scheduleRetry]
  );

  const loadNative = useCallback(
    (url) => {
      const v = videoRef.current;
      if (!v) return () => {};
      const detach = attachMediaEventListeners(v);
      v.src = url;
      v.load?.();
      if (autoPlay) v.play?.().catch(() => {});
      return detach;
    },
    [attachMediaEventListeners, autoPlay]
  );

  const loadHlsJs = useCallback(
    (url) => {
      const v = videoRef.current;
      if (!v) return () => {};
      destroyHls();
      const hls = new Hls({ autoStartLoad: true });
      hlsRef.current = hls;

      hls.on(Hls.Events.ERROR, (_evt, data) => {
        if (data && data.fatal) scheduleRetry();
      });

      hls.loadSource(url);
      hls.attachMedia(v);

      const detach = attachMediaEventListeners(v);
      return () => {
        detach();
        destroyHls();
      };
    },
    [attachMediaEventListeners, scheduleRetry]
  );

  const startLoad = useCallback(() => {
    const v = videoRef.current;
    if (!uid || !v) return;

    setFailed(false);
    setIsLoading(true);

    const urls = cfUrls(uid, cacheBustRef.current);
    const hlsUrl = urls.hls;

    if (v.canPlayType && v.canPlayType("application/vnd.apple.mpegurl")) {
      return loadNative(hlsUrl);
    }
    if (Hls.isSupported()) {
      return loadHlsJs(hlsUrl);
    }

    const detach = attachMediaEventListeners(v);
    v.src = urls.mp4;
    return detach;
  }, [uid, loadNative, loadHlsJs, attachMediaEventListeners]);

  // Tap/click to retry if failed or not playable yet
  const handleTap = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const notPlayableYet = v.readyState < 3; // < HAVE_FUTURE_DATA
    if (failed || (!isLoading && notPlayableYet)) {
      attemptRef.current = 0;
      cacheBustRef.current = Date.now();
      const detach = startLoad();
      // If previous listeners exist they’ll be cleaned by effect/loader cleaners.
      return detach;
    }
  }, [failed, isLoading, startLoad]);

  useEffect(() => {
    attemptRef.current = 0;
    cacheBustRef.current = Date.now();
    clearRetryTimer();
    destroyHls();

    setIsLoading(!!uid);
    setIsRetrying(false);
    setFailed(false);
    setIsLoading(false);

    let detachListeners = null;
    if (uid) {
      detachListeners = startLoad();
    }

    return () => {
      if (typeof detachListeners === "function") detachListeners();
      clearRetryTimer();
      destroyHls();
    };
  }, [uid, startLoad]);

  const posterUrl = poster || (uid ? cfUrls(uid).poster : undefined);

  return (
    <div
      style={{ position: "relative", width: "100%" }}
      onClick={handleTap} // <-- tap anywhere on the video area to retry
    >
      <video
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
