import { useContext } from "react";

import { UserContext } from "../../contexts/UserContext";

export default function User() {
  const userContext = useContext(UserContext);
  const user = userContext.user;

  if (userContext.isLoggedIn) {
    if (user.images.length > 0) {
      user.image = user.images[0].url;
    }

    return (
      <div className="user">
        <a href="/profile">
          {user.image ? <img src={user.image} /> : user.display_name}
        </a>
      </div>
    );
  } else {
    return <button onClick={userContext.login}>Login</button>;
  }
}
