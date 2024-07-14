import React from "react";
import { AnimatePresence, motion } from "framer-motion";

const Slideshow = ({ url, mobile }) => {
  return (
    <AnimatePresence>
      <motion.img
        style={{
          height: mobile ? "390" : "390",
          width: mobile ? "auto" : "auto",
          crop: mobile ? "scale" : "fill",
          borderRadius: 10,
        }}
        key={url}
        src={url}
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
      />
    </AnimatePresence>
  );
};

export default Slideshow;
