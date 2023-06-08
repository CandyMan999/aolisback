import React from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Text } from "../../components";
import { COLORS } from "../../constants";

const AgeRangeSlider = ({ handleSliderChange, ageRange }) => {
  const railStyle = { backgroundColor: "#e5e5e5" };
  const trackStyle = { backgroundColor: COLORS.main };
  const dotStyle = {
    borderColor: COLORS.black,
    backgroundColor: COLORS.vividBlue,
  };
  const dotActiveStyle = {
    borderColor: COLORS.black,
    backgroundColor: COLORS.vividBlue,
  };

  return (
    <div style={{ width: "100%" }}>
      <div>
        <Text center bold>
          Age Range: {ageRange.lowEnd} - {ageRange.highEnd}
        </Text>
      </div>
      <Slider
        range={Range}
        min={18}
        max={80}
        defaultValue={[ageRange.lowEnd, ageRange.highEnd]}
        onChange={handleSliderChange}
        railStyle={railStyle}
        trackStyle={[trackStyle]}
        dotStyle={dotStyle}
        dotActiveStyle={dotActiveStyle}
      />
    </div>
  );
};

export default AgeRangeSlider;
