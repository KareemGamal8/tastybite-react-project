import { useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const navigate = useNavigate();

  // Demo credentials are filled in to make the lesson faster.
  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed. Please try again.");
      }

      localStorage.setItem("accessToken", data.accessToken);

      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      onLogin(data);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  }

  return (
    <div className="container section">
      <Helmet>
        <title>Log In | TastyBite</title>
        <meta
          name="description"
          content="Log in to TastyBite to manage and revisit your favorite recipes."
        />
      </Helmet>

      <div className="login-box">
        <h1>Log in</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={function (event) {
              setUsername(event.target.value);
            }}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={function (event) {
              setPassword(event.target.value);
            }}
          />

          {error !== "" && <p className="message message-error">{error}</p>}

          <button type="submit" className="button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
