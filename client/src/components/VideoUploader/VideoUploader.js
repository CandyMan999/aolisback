import { useEffect, useRef } from "react";

const VideoUploader = () => {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: "localmassagepros",
        uploadPreset: "dlxzn2uj",
      },
      function (error, result) {
        console.log(result);
      }
    );
  }, []);
  return <button onClick={() => widgetRef.current.open()}>Upload Video</button>;
};

export default VideoUploader;
