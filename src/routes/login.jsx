function generateRandomString(length) {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

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

export default function Login() {
  const clientId = "bd053d5d370346cfa51511a03d391915";
  const redirectUri = window.location.origin + "/login";
  const urlParams = new URLSearchParams(window.location.search);

  let code = urlParams.get("code");
  if (!code) {
    // Redirect to spotify login

    let codeVerifier = generateRandomString(128);

    generateCodeChallenge(codeVerifier).then((codeChallenge) => {
      let state = generateRandomString(16);
      let scope = "user-read-private user-read-email";

      localStorage.setItem("code_verifier", codeVerifier);

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
    });
  } else {
    // Exchange code for access token
    let codeVerifier = localStorage.getItem("code_verifier");

    let body = new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId,
      code_verifier: codeVerifier,
    });

    const response = fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("HTTP status " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        async function getProfile() {
          let accessToken = localStorage.getItem("access_token");

          const response = await fetch("https://api.spotify.com/v1/me", {
            headers: {
              Authorization: "Bearer " + accessToken,
            },
          });

          const data = await response.json();

          //   {
          //     "country": "US",
          //     "display_name": "Will Perry",
          //     "email": "willpe@outlook.com",
          //     "explicit_content": { "filter_enabled": false, "filter_locked": false },
          //     "external_urls": { "spotify": "https://open.spotify.com/user/wperr" },
          //     "followers": { "href": null, "total": 54 },
          //     "href": "https://api.spotify.com/v1/users/wperr",
          //     "id": "wperr",
          //     "images": [
          //       {
          //         "height": null,
          //         "url": "https://i.scdn.co/image/ab6775700000ee85e54a858b1fcda9c684acff02",
          //         "width": null
          //       }
          //     ],
          //     "product": "premium",
          //     "type": "user",
          //     "uri": "spotify:user:wperr"
          //   }
          localStorage.setItem("profile", JSON.stringify(data));

          window.location = window.location.origin + "/";
        }

        // {
        //     "access_token": "BQBh---snip---5VQe_zzk",
        //     "token_type": "Bearer",
        //     "expires_in": 3600,
        //     "refresh_token": "AQCJzV---snip---lBhA0",
        //     "scope": "user-read-email user-read-private"
        // }
        localStorage.setItem("access_token", data.access_token);
        getProfile();
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // TODO: refresh token
    // See: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#refreshing-the-access-token
  }

  return (
    <main>
      <h1>setti.me</h1>
      <nav className="festival-list">
        <a href="#">Login</a>
      </nav>
    </main>
  );
}
