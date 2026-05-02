import { Link, NavLink } from "react-router-dom";
import { LogOut, Monitor, Moon, Sun, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const dashboardPath = {
  Admin: "/admin",
  Manager: "/manager",
  Staff: "/staff",
  User: "/user"
};

const Navbar = ({ theme, onToggleTheme }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg app-nav sticky-top">
      <div className="container-fluid px-4">
        <Link className="navbar-brand brand" to={user ? dashboardPath[user.role] : "/login"}>
          Smart DQMS
        </Link>
        <div className="d-flex align-items-center gap-3 flex-wrap justify-content-end">
          <NavLink className="nav-link icon-link" to="/queue-monitor">
            <Monitor size={18} /> Live Queue
          </NavLink>
          <button
            className="theme-toggle"
            type="button"
            onClick={onToggleTheme}
            title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
          >
            {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
          </button>
          {user ? (
            <>
              <NavLink className="nav-link icon-link" to="/profile">
                Profile
              </NavLink>
              <span className="user-pill">
                <UserRound size={16} /> {user.name} - {user.role}
              </span>
              <button className="btn btn-outline-danger btn-sm" onClick={logout}>
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <NavLink className="btn btn-outline-primary btn-sm" to="/login">
                Login
              </NavLink>
              <NavLink className="btn btn-primary btn-sm" to="/signup">
                Signup
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
