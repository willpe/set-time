import { Outlet } from "react-router";

export default function Root() {
  return (
    <>
      <Outlet />
      <footer>hello from seattle</footer>
    </>
  );
}
