import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import menu from "../assets/menu.svg";
import close from "../assets/plus.svg";
import links from "../constants/links";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserProvider";
import userLogo from "../assets/user.svg";
// import settings from "../assets/settings.svg";

export default function MobileNav() {
  const router = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const [open, setOpen] = useState(false);
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("UserContext not found");
  }
  const { user, setUser } = context;
  return (
    <header className="bg-emerald-500/75 z-10 backdrop-blur-sm fixed w-full block sm:hidden select-none">
      <nav className="px-4 py-2 text-zinc-800 flex justify-between items-center">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router("/")}
        >
          <img src={logo} alt="logo" className="w-14 sm:w-12" />
        </div>
        <div className="cursor-pointer pr-2" onClick={() => setOpen(!open)}>
          <img src={menu} alt="menu" className="scale-110" />
        </div>
      </nav>
      <div className="relative">
        <ul
          className={`flex z-10 backdrop-blur-sm flex-col p-2 pt-1 pr-2 border border-emerald-400 top-[2px] right-1 rounded-2xl bg-emerald-950/75 text-zinc-200 gap-x-1 font-medium items-start gap-y-2 fixed h-[99vh] transition-all ease-in duration-300 ${
            open ? "translate-x-0 opacity-100" : "translate-x-40 opacity-0"
          }`}
        >
          <div
            className="bg-emerald-500 hover:bg-emerald-600 transition-all cursor-pointer rounded-xl w-full flex justify-center py-[0.675rem]"
            onClick={() => setOpen(!open)}
          >
            <img src={close} alt="close" className="scale-125 rotate-45" />
          </div>
          <div className="transition-all cursor-pointer rounded-xl w-full flex flex-col py-1 gap-y-1">
            <div className="flex flex-col gap-y-1">
              {links.map((link) =>
                !user || link.name !== "Login" ? (
                  <span
                    key={link.name}
                    onClick={() => (router(link.path), setOpen(!open))}
                    className={`hover:bg-emerald-800/75 left-0 w-full hover:outline hover:outline-1 hover:outline-emerald-400 py-2 rounded-md pl-2 pr-12 transition-all duration-300 flex flex-row justify-start gap-2 ${
                      (link.path === "/" && pathname === "/") ||
                      (link.path !== "/" && pathname.startsWith(link.path))
                        ? "bg-emerald-600"
                        : ""
                    }`}
                  >
                    <img src={link.icon} alt={link.name} />
                    <li>{link.name}</li>
                  </span>
                ) : null
              )}
              {user && (
                <span
                  className="hover:bg-red-800/75 left-0 w-full hover:outline hover:outline-1 hover:outline-red-400 py-2 rounded-md pl-2 pr-12 transition-all flex flex-row justify-start"
                  onClick={() => (
                    setUser(null), localStorage.removeItem("user"), router("/")
                  )}
                >
                  <img src={userLogo} alt="user" />
                  <li className="ml-2">Logout</li>
                </span>
              )}
            </div>
            {user && (
              <div className="relative mt-[calc(100vh-19.5rem)] flex flex-col gap-y-1">
                <hr className="mb-1" />
                <span
                  className={`hover:bg-emerald-800/75 relative left-0 w-full hover:outline hover:outline-1 hover:outline-emerald-400 py-2 rounded-md pl-1 pr-12 transition-all flex flex-row items-center justify-start ${
                    pathname === "/profile" ? "bg-emerald-600" : ""
                  }`}
                  onClick={() => (router("/profile"), setOpen(!open))}
                >
                  <img
                    src={user.profile || userLogo}
                    className="w-7 h-7 object-cover rounded-full"
                    alt="user"
                  />
                  <li className="ml-2">Profile</li>
                </span>
                {/* <span
                  className={`hover:bg-emerald-800/75 relative left-0 w-full hover:outline hover:outline-1 hover:outline-emerald-400 py-2 rounded-md pl-2 pr-12 transition-all flex flex-row justify-start ${
                    pathname === "/settings" ? "bg-emerald-600" : ""
                  }`}
                  onClick={() => (router("/settings"), setOpen(!open))}
                >
                  <img src={settings} alt="user" />
                  <li className="ml-2">Settings</li>
                </span> */}
              </div>
            )}
          </div>
        </ul>
      </div>
    </header>
  );
}
