import { useState } from "react";
import { Outlet } from "react-router";
import SpotifyClient from "../services/SpotifyClient";
import { UserContext } from "../contexts/UserContext";
import User from "../components/User";

import { TimeContext } from "../contexts/TimeContext";

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

  const [time, setTime] = useState(new Date("Sat Jun 10, 2023 02:47"));
  const timeContext = {
    time: time,
    isWithin: (start, end) => {
      return time >= start && time <= end;
    },
    setTime: setTime,
  };

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
