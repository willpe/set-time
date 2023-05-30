import { useContext } from "react";

import { UserContext } from "../../contexts/UserContext";

export default function User() {
  const userContext = useContext(UserContext);
  const user = userContext.user;

  if (userContext.isLoggedIn) {
    return (
      <>
        <a href="/logout">{user.display_name}</a>
        <button onClick={userContext.logout}>logout</button>
      </>
    );
  } else {
    return <button onClick={userContext.login}>Login</button>;
  }
}
