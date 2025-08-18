import React from "react";
import Hls from "hls.js";

// Build Cloudflare Stream URLs for a given video UID
const cfUrls = (uid) => ({
  hls: `https://videodelivery.net/${uid}/manifest/video.m3u8`,
  poster: `https://videodelivery.net/${uid}/thumbnails/thumbnail.jpg?time=0s`,
  // NOTE: MP4 is only available if "Allow downloads" is enabled for the asset/account.
  mp4: `https://videodelivery.net/${uid}/downloads/default.mp4`,
});

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
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    if (!uid) return;
    const { hls } = cfUrls(uid);
    const video = videoRef.current;
    if (!video) return;

    // Safari/iOS plays HLS natively
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = hls;
      return;
    }

    // Other browsers use hls.js
    if (Hls.isSupported()) {
      const hlsPlayer = new Hls({ autoStartLoad: true });
      hlsPlayer.loadSource(hls);
      hlsPlayer.attachMedia(video);
      return () => hlsPlayer.destroy();
    }

    // (Very old browsers) optional fallback to MP4 if downloads are enabled
    // video.src = cfUrls(uid).mp4;
  }, [uid]);

  return (
    <video
      ref={videoRef}
      controls={controls}
      loop={loop}
      muted={muted}
      autoPlay={autoPlay}
      playsInline
      poster={poster || (uid ? cfUrls(uid).poster : undefined)}
      onPlay={onPlay}
      style={style}
      className={className}
    />
  );
};

export default CloudflareVideo;
export { cfUrls };
