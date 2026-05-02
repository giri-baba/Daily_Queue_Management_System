import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const OAuthSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { saveSession } = useAuth();

  useEffect(() => {
    const token = params.get("token");
    if (!token) return navigate("/login");

    const payload = JSON.parse(atob(token.split(".")[1]));
    saveSession({
      token,
      user: {
        id: payload.id,
        name: payload.name,
        role: payload.role,
        email: "",
        emailVerified: true,
        verificationStatus: "EmailVerified"
      }
    });
    navigate(payload.role === "User" ? "/user" : "/login");
  }, [params, navigate, saveSession]);

  return <div className="panel">Completing Google login...</div>;
};

export default OAuthSuccess;
