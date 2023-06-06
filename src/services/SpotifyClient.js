export default function SpotifyClient() {
  const clientId = "bd053d5d370346cfa51511a03d391915";
  const scope = "user-read-private user-read-email";
  const redirectUri = window.location.origin;

  const localStorageKeys = {
    returnUrl: "return-url",
    codeVerifier: "code-verifier",
    authToken: "auth-token",
    profile: "profile",
  };

  function generateRandomString(length) {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  async function generateCodeChallenge(codeVerifier) {
    function base64encode(string) {
      return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest("SHA-256", data);

    return base64encode(digest);
  }

  function getUser() {
    let user = null;
    let profile = localStorage.getItem(localStorageKeys.profile);
    if (profile) {
      user = JSON.parse(profile);
    }

    return { isLoggedIn: !!user, user: user };
  }

  async function getProfile() {
    // TODO: Auth Token
    const response = await fetch("https://api.spotify.com/v1/me");

    if (!response.ok) {
      throw new Error("Failed to load current user profile from Spotify. HTTP status " + response.status);
    }

    return await response.json();
  }

  async function requestAccessToken(code, codeVerifier) {
    let body = new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId,
      code_verifier: codeVerifier,
    });

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body,
    });

    if (!response.ok) {
      throw new Error("Failed to obtain an access token from Spotify. HTTP status " + response.status);
    }

    const token = response.json();
    token.expires_at = Date.now() + token.expires_in * 1000;

    return token;
  }

  return {
    getCurrentUser: () => {
      return getUser();
    },

    login: async () => {
      // Save the original URL in local storage
      let returnUrl = window.location.pathname;

      let encodedReturnUrl = encodeURIComponent(returnUrl || "/");
      localStorage.setItem(localStorageKeys.returnUrl, encodedReturnUrl);

      let codeVerifier = generateRandomString(128);

      let codeChallenge = await generateCodeChallenge(codeVerifier);
      let state = generateRandomString(16);

      localStorage.setItem(localStorageKeys.codeVerifier, codeVerifier);

      let args = new URLSearchParams({
        response_type: "code",
        client_id: clientId,
        scope: scope,
        redirect_uri: redirectUri,
        state: state,
        code_challenge_method: "S256",
        code_challenge: codeChallenge,
      });

      window.location = "https://accounts.spotify.com/authorize?" + args;
    },

    handleLoginResponse: async (setUser) => {
      // Check for a pending login
      let codeVerifier = localStorage.getItem(localStorageKeys.codeVerifier);
      if (!codeVerifier) {
        return;
      }

      // Check for an authorization code in the URL
      const urlParams = new URLSearchParams(window.location.search);
      let code = urlParams.get("code");
      if (!code) {
        return;
      }

      // Exchange the authorization code for an access token
      let accessToken = await requestAccessToken(code, codeVerifier);
      let jsonToken = JSON.stringify(accessToken);
      localStorage.setItem(localStorageKeys.authToken, jsonToken);

      // Get the user profile
      let profile = await getProfile();
      let jsonProfile = JSON.stringify(profile);
      localStorage.setItem(localStorageKeys.profile, jsonProfile);

      // Get the original URL
      let returnUrl = decodeURIComponent(localStorage.getItem(localStorageKeys.returnUrl) || "/");

      // Clear the pending login state
      localStorage.removeItem(localStorageKeys.codeVerifier);
      localStorage.removeItem(localStorageKeys.returnUrl);

      // Redirect to the original URL
      window.location = window.location.origin + returnUrl;
    },

    logout: (setUser) => {
      // Clear the access token and profile from local storage
      localStorage.removeItem(localStorageKeys.authToken);
      localStorage.removeItem(localStorageKeys.profile);

      window.location = window.location.origin + "/";
    },
  };
}
