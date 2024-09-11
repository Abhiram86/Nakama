import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import Navbar from "./components/Navbar";
import Auth from "./pages/Auth";
import Footer from "./components/Footer";
import MobileNav from "./components/MobileNav";
import Groups from "./pages/Groups";
import MobileChatArea from "./pages/MobileChatArea";
import { useEffect, useContext } from "react";
import { UserContext } from "./context/UserProvider";
import Profile from "./pages/Profile";
import About from "./pages/About";

function App() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("UserContext not found");
  }
  const { setUser } = context;
  useEffect(() => {
    const userdata = localStorage.getItem("user");
    if (userdata) {
      const user = JSON.parse(userdata);
      setUser({
        id: user.id,
        name: user.name,
        email: user.email,
        groups: user.groups,
        profile: user.profile,
      });
    }
  }, []);
  return (
    <>
      <main className="flex flex-col justify-between min-h-screen overflow-hidden">
        <Navbar />
        <MobileNav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/mobile/group/:groupId" element={<MobileChatArea />} />
          <Route path="/about" element={<About />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
        <Footer />
      </main>
    </>
  );
}

export default App;
