import React from "react";
import {
  CollapsableHeader,
  PhotoSlider,
  PhotoUploader,
  Box,
} from "../../../components";

const MyPhotos = ({ currentUser, total, completed }) => {
  return (
    <CollapsableHeader title="My Photos" total={total} completed={completed}>
      <Box width={"100%"} column alignItems="center">
        <PhotoUploader />
        <PhotoSlider
          withDelete={true}
          images={currentUser.pictures}
          height={310}
          width={200}
        />
      </Box>
    </CollapsableHeader>
  );
};

export default MyPhotos;
