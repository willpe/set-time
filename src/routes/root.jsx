import { useState } from "react";
import { Outlet } from "react-router";
import SpotifyClient from "../services/SpotifyClient";
import { UserContext } from "../contexts/UserContext";
import User from "../components/User";

import { TimeContext } from "../contexts/TimeContext";

import { ReactComponent as Wordmark } from "../assets/wordmark-logo.svg";
import useTime from "../hooks/UseTime";

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

  const urlParams = new URLSearchParams(window.location.search);
  const timeOptions = {
    interval: urlParams.get("ti") || 15000,
    start: urlParams.get("ts"),
    velocity: urlParams.get("tv"),
  };
  const timeContext = useTime(timeOptions);

  spotifyClient.handleLoginResponse(setUser);

  return (
    <UserContext.Provider value={userContext}>
      <TimeContext.Provider value={timeContext}>
        <header>
          <a className="logo" href="/" title="Home">
            <Wordmark />
          </a>
          <User />
        </header>
        <Outlet />
        <footer>
          hello from seattle <span className="version">{APP_VERSION}</span>
        </footer>
      </TimeContext.Provider>
    </UserContext.Provider>
  );
}
