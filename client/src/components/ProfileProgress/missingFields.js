const missingFields = {
  myLocation: {
    required: ["location.lat"],
    hasLength: [],
    oneOf: [],
    oneOfLength: [],
  },
  myPhotos: {
    required: [],
    hasLength: ["pictures"],
    oneOf: [],
    oneOfLength: [],
  },
  myDetails: {
    required: [
      "sex",
      "age",
      "intro",
      "occupation",
      "drugs",
      "smoke",
      "marijuana",
      "drink",
    ],
    hasLength: [],
    oneOf: [],
    oneOfLength: [],
  },
  mySobriety: {
    required: ["singleTime"],
    hasLength: [],
    oneOf: [],
    oneOfLength: [],
  },
};

export default missingFields;
