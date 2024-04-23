const getTokenFromLocalStorage = localStorage.getItem("adminauth")
  ? JSON.parse(localStorage.getItem("adminauth"))
  : null;

export const config = {
  headers: {
    Authorization: `Bearer ${
      getTokenFromLocalStorage !== null ? getTokenFromLocalStorage.token : ""
    }`,
    Accept: "application/json",
  },
};
