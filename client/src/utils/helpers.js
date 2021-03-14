export const setToken = (token, shouldPersist) =>
  shouldPersist
    ? localStorage.setItem("token", token)
    : sessionStorage.setItem("token", token);
export const getToken = () =>
  sessionStorage.getItem("token") || localStorage.getItem("token");
export const clearToken = () => {
  sessionStorage.removeItem("token");
  localStorage.removeItem("token");
};

export const getGoogleToken = () => {};

export const validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};
