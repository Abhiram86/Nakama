import home from "../assets/home.svg";
import blocks from "../assets/blocks.svg";
import about from "../assets/info.svg";
import user from "../assets/user.svg";

const links = [
  {
    name: "Home",
    path: "/",
    icon: home,
  },
  {
    name: "Groups",
    path: "/groups",
    icon: blocks,
  },
  {
    name: "About",
    path: "/about",
    icon: about,
  },
  {
    name: "Login",
    path: "/auth",
    icon: user,
  },
];

export default links;
