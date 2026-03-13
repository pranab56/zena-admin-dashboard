export const saveToken = (token) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("drebalAdmin", token);
  }
};

export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("drebalAdmin");
  }
  return null;
};

export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("drebalAdmin");
    localStorage.removeItem("adminLoginId");
  }
};

export const isAuthenticated = () => {
  return !!getToken();
};
