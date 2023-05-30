import { createContext } from "react";

export const UserContext = createContext({
  user: null,
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});
