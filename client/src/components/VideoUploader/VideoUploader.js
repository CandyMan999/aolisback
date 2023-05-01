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
        resourceType: "video",
        sourceTypes: ["local", "camera"],
        maxDuration: 60, // set the maximum duration limit to 60 seconds
        multiple: false,
        cropping: true,
      },
      function (error, result) {
        console.log(result);
      }
    );
  }, []);
  return <button onClick={() => widgetRef.current.open()}>Upload Video</button>;
};

export default VideoUploader;
