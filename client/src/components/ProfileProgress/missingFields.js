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
    required: ["sex", "age", "intro", "occupation"],
    hasLength: [],
    oneOf: [],
    oneOfLength: [],
  },
  mySobriety: {
    required: ["sobrietyTime"],
    hasLength: [],
    oneOf: [],
    oneOfLength: [],
  },
};

export default missingFields;
