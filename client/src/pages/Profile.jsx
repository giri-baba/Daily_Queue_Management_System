import { useEffect, useState } from "react";
import { BadgeCheck, ShieldAlert } from "lucide-react";
import api from "../api/api.js";

const Profile = () => {
  const [profile, setProfile] = useState(null);

  const loadProfile = async () => {
    const { data } = await api.get("/auth/profile");
    setProfile(data.user);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (!profile) return <div className="panel">Loading profile...</div>;

  return (
    <section className="wide-form panel">
      <h1>Profile Verification</h1>
      <div className="verification-grid">
        <div>
          <strong>{profile.name}</strong>
          <p>{profile.email}</p>
          {profile.phone && <p>{profile.phone}</p>}
        </div>
        <span className={`verify-pill ${profile.emailVerified ? "ok" : "bad"}`}>
          {profile.emailVerified ? <BadgeCheck size={16} /> : <ShieldAlert size={16} />}
          Email {profile.emailVerified ? "Verified" : "Pending"}
        </span>
      </div>
      <hr />
      <p className="text-muted mb-0">
        Email verification is required before login and protected actions. If your email is pending,
        use the OTP verification page or resend OTP from login.
      </p>
    </section>
  );
};

export default Profile;
