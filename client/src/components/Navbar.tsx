import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import links from "../constants/links";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserProvider";
import noperson from "../assets/user.svg";

const Navbar = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const router = useNavigate();
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("UserContext not found");
  }
  const { user, setUser } = context;
  const [profileModal, setProfileModal] = useState(false);
  return (
    <header className="bg-emerald-500/75 backdrop-blur-md fixed w-full hidden sm:block">
      <nav className="px-4 py-2 text-zinc-800 flex justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router("/")}
        >
          <h1 className="hidden text-zinc-700 text-lg tracking-tighter font-medium sm:block">
            Nakama
          </h1>
          <img src={logo} alt="logo" className="w-14 sm:w-12" />
        </div>
        <ul className="flex gap-x-1 font-medium items-center">
          {links.map((link) =>
            !user || link.name !== "Login" ? (
              <Link
                key={link.name}
                to={link.path}
                className={`hover:bg-emerald-400 rounded-[0.25rem] px-1 transition-all ${
                  (link.path === "/" && pathname === "/") ||
                  (link.path !== "/" && pathname.startsWith(link.path))
                    ? "bg-emerald-200 text-zinc-900"
                    : ""
                }`}
              >
                <li>{link.name}</li>
              </Link>
            ) : (
              <span key={link.name} className="pl-1">
                <img
                  src={
                    user.profile && user.profile.length > 0
                      ? user.profile
                      : noperson
                  }
                  alt="user"
                  className="w-7 h-7 cursor-pointer outline outline-1 rounded-full object-cover"
                  onClick={() => setProfileModal(!profileModal)}
                />
              </span>
            )
          )}
        </ul>
      </nav>
      {profileModal && (
        <div className="fixed rounded-lg z-10 bg-zinc-900/75 backdrop-blur-xl text-zinc-200 top-10 right-1 border border-zinc-500 py-2 w-28 px-2 space-y-1 divide-y divide-zinc-600">
          <p
            className="cursor-pointer px-2"
            onClick={() => (router("/profile"), setProfileModal(false))}
          >
            Profile
          </p>
          {/* <p
            className="cursor-pointer px-2 "
            onClick={() => (router("/settings"), setProfileModal(false))}
          >
            Settings
          </p> */}
          <p
            className="text-red-500 cursor-pointer px-2"
            onClick={() => (
              setUser(null),
              localStorage.removeItem("user"),
              setProfileModal(false),
              router("/auth")
            )}
          >
            Logout
          </p>
        </div>
      )}
    </header>
  );
};

export default Navbar;
