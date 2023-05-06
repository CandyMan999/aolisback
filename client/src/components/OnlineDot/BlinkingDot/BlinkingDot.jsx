import { motion } from "framer-motion";

const BlinkingDot = () => {
  const dotVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
  };

  const pulseVariants = {
    hidden: {
      scale: 0,
      opacity: 0,
    },
    visible: {
      scale: 1,
      opacity: 1,
    },
  };

  return (
    <div style={{ display: "inline-block" }}>
      <motion.div
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: "red",
          marginRight: "5px",
        }}
        variants={dotVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, repeat: Infinity }}
      />
      <motion.div
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          border: "1px solid red",
          position: "absolute",
        }}
        variants={pulseVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 1, repeat: Infinity }}
      />
    </div>
  );
};

export default BlinkingDot;
