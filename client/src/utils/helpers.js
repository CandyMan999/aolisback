export const setToken = (token, shouldPersist) =>
  sessionStorage.setItem("Sobertoken", token);
export const getToken = () =>
  sessionStorage.getItem("Sobertoken") || localStorage.getItem("token");
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
