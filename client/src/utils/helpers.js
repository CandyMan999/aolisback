export const setToken = (token, shouldPersist) =>
  localStorage.setItem("Sobertoken", token);
export const getToken = () =>
  sessionStorage.getItem("Sobertoken") || localStorage.getItem("Sobertoken");
export const clearToken = () => {
  sessionStorage.removeItem("Sobertoken");
  localStorage.removeItem("Sobertoken");
};

export const getGoogleToken = () => {};

export const validateEmail = (email) => {
  const re =
    /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const getDistanceFromCoords = (lat1, lng1, lat2, lng2) => {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLng = deg2rad(lng2 - lng1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return Math.floor(d * 0.621371);
};
const deg2rad = (deg) => deg * (Math.PI / 180);
