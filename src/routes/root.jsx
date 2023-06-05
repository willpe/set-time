import { useState } from "react";
import { Outlet } from "react-router";
import SpotifyClient from "../SpotifyClient";
import { UserContext } from "../contexts/UserContext";
import User from "../components/timeline/User";

import { ReactComponent as Wordmark } from "../assets/wordmark-logo.svg";

export default function Root() {
  const spotifyClient = new SpotifyClient();
  const currentUser = spotifyClient.getCurrentUser();

  const [user, setUser] = useState(currentUser);
  const userContext = {
    ...user,
    login: (returnUrl) => spotifyClient.login(returnUrl),
    logout: () => spotifyClient.logout(setUser),
    spotifyClient: spotifyClient,
  };

  spotifyClient.handleLoginResponse(setUser);

  return (
    <UserContext.Provider value={userContext}>
      <header>
        <a className="logo" href="/" title="Home">
          <Wordmark />
        </a>
        <User />
      </header>
      <Outlet />
      <footer>hello from seattle</footer>
    </UserContext.Provider>
  );
}
