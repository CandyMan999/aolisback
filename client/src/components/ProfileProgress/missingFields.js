const missingFields = {
  myLocation: {
    required: [],
    hasLength: [],
    oneOf: [],
    oneOfLength: [],
    matches: ["location.coordinates"],
  },
  myPhotos: {
    required: [],
    hasLength: ["pictures"],
    oneOf: [],
    oneOfLength: [],
    matches: [],
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
    matches: [],
  },
  mySobriety: {
    required: ["singleTime"],
    hasLength: [],
    oneOf: [],
    oneOfLength: [],
    matches: [],
  },
  lookingFor: {
    required: ["lookingFor.sex", "lookingFor.kids"],
    hasLength: [],
    oneOf: [],
    oneOfLength: [],
    matches: [],
  },
};

export default missingFields;
