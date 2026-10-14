import { Navigate } from "react-router-dom";
import Loading from "./Loading.jsx";

function ProtectedRoute({ user, authLoading, children }) {
  // Wait until we know if the user is logged in.
  if (authLoading) {
    return (
      <div className="container section">
        <Loading text="Checking your session..." />
      </div>
    );
  }

  // Not logged in, so send the user to the login page.
  if (user === null) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
