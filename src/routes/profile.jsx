import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

export async function loader() {
  return {
    favorites: [],
  };
}

export default function Profile() {
  const userContext = useContext(UserContext);
  if (!userContext.isLoggedIn) {
    userContext.login();
    return null;
  }

  const user = userContext.user;
  if (user.images.length > 0) {
    user.image = user.images[0].url;
  }

  function logout() {
    userContext.logout();
  }

  return (
    <main className="profile">
      <div className="user">
        <img src={user.image} />
        <h2>{user.display_name}</h2>
        <a href={user.external_urls.spotify}>{user.id}</a>
      </div>

      <button onClick={userContext.logout}>Logout</button>
    </main>
  );
}
