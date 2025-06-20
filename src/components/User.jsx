import { useContext } from "react";

import { UserContext } from "../contexts/UserContext";

export default function User() {
  const userContext = useContext(UserContext);
  const user = userContext.user;

  const enableLogin = false;
  if (!enableLogin) {
    return null;
  }

  if (userContext.isLoggedIn) {
    if (user.images.length > 0) {
      user.image = user.images[0].url;
    }

    return (
      <div className="user">
        <a href="/profile">
          {user.image ? <img src={user.image} alt="User Profile Photo" title="User Profile" /> : user.display_name}
        </a>
      </div>
    );
  } else {
    return <button onClick={userContext.login}>Login</button>;
  }
}
