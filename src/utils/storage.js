export const saveToken = (token) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("PharmacyAdmin", token);
  }
};

export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("PharmacyAdmin");
  }
  return null;
};

export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("PharmacyAdmin");
  }
};
