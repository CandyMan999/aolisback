// CloudflareVideo.jsx
import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Box } from "../../components";
import Loading from "../../components/Loading";
import { COLORS } from "../../constants";

export const cfUrls = (uid, bust) => {
  const q = bust ? `?cb=${bust}` : "";
  return {
    hls: `https://videodelivery.net/${uid}/manifest/video.m3u8${q}`,
    poster: `https://videodelivery.net/${uid}/thumbnails/thumbnail.jpg?time=0s`,
    mp4: `https://videodelivery.net/${uid}/downloads/default.mp4${q}`,
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

  const markLoaded = () => {
    setIsLoading(false);
    setIsRetrying(false);
  };

  const scheduleRetry = () => {
    destroyHls();
    clearRetryTimer();
    attemptRef.current += 1;
    if (attemptRef.current > MAX_RETRIES) {
      setIsRetrying(false);
      return;
    }
    setIsRetrying(true);
    const delay = INITIAL_DELAY_MS * Math.pow(2, attemptRef.current - 1);
    retryTimerRef.current = setTimeout(() => {
      cacheBustRef.current = Date.now();
      startLoad();
    }, delay);
  };

  const attachMediaEventListeners = (video) => {
    if (!video) return () => {};
    const onLoadedData = () => markLoaded();
    const onCanPlay = () => markLoaded();
    const onPlaying = () => markLoaded();
    const onError = () => scheduleRetry();

    video.addEventListener("loadeddata", onLoadedData);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("error", onError);

    // If the element is already ready (e.g., super fast cache), mark loaded
    if (video.readyState >= 3 /* HAVE_FUTURE_DATA */) {
      markLoaded();
    }

    return () => {
      video.removeEventListener("loadeddata", onLoadedData);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("error", onError);
    };
  };

  const loadNative = (url) => {
    const v = videoRef.current;
    if (!v) return () => {};
    const detach = attachMediaEventListeners(v);
    v.src = url;
    v.load?.();
    if (autoPlay) v.play?.().catch(() => {});
    return detach;
  };

  const loadHlsJs = (url) => {
    const v = videoRef.current;
    if (!v) return () => {};
    destroyHls();
    const hls = new Hls({ autoStartLoad: true });
    hlsRef.current = hls;

    // We still rely on the <video> events to flip off the loader.
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
  };

  const startLoad = () => {
    const v = videoRef.current;
    if (!uid || !v) return;

    setIsLoading(true);
    const urls = cfUrls(uid, cacheBustRef.current);
    const hlsUrl = urls.hls;

    // Safari/iOS native HLS
    if (v.canPlayType && v.canPlayType("application/vnd.apple.mpegurl")) {
      return loadNative(hlsUrl);
    }

    // hls.js for others
    if (Hls.isSupported()) {
      return loadHlsJs(hlsUrl);
    }

    // Legacy fallback (only if downloads are enabled)
    const detach = attachMediaEventListeners(v);
    v.src = urls.mp4;
    return detach;
  };

  useEffect(() => {
    attemptRef.current = 0;
    cacheBustRef.current = Date.now();
    clearRetryTimer();
    destroyHls();

    setIsLoading(!!uid);
    setIsRetrying(false);

    let detachListeners = null;
    if (uid) {
      detachListeners = startLoad();
    }

    return () => {
      if (typeof detachListeners === "function") detachListeners();
      clearRetryTimer();
      destroyHls();
    };
  }, [uid]);

  const posterUrl = poster || (uid ? cfUrls(uid).poster : undefined);

  return (
    <div style={{ position: "relative", width: "100%" }}>
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
