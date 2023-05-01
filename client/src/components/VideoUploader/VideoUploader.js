import React, { Fragment, useState } from "react";
import axios from "axios";
import { Loading } from "../../components";

function VideoUploader() {
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = () => {
    setSubmitting(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "dlxzn2uj");
      formData.append("resource_type", "video");
      formData.append("max_duration", 60);

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/localmassagepros/video/upload`,
        formData
      );
      console.log(response.data);
    };
    reader.readAsDataURL(file);
    setSubmitting(false);
  };

  return (
    <div>
      {submitting ? (
        <Loading />
      ) : (
        <Fragment>
          <input
            type="file"
            accept="video/*"
            capture="user"
            onChange={handleFileChange}
          />
          <button disabled={submitting} onClick={handleUpload}>
            Upload
          </button>
        </Fragment>
      )}
    </div>
  );
}

export default VideoUploader;
