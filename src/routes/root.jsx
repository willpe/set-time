import { Outlet } from "react-router";
import { UserContext } from "../contexts/UserContext";

export default function Root() {
  return (
    <UserContext.Provider>
      <Outlet />
      <footer>hello from seattle</footer>
    </UserContext.Provider>
  );
}
