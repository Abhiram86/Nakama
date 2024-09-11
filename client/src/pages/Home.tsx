import bg1 from "../assets/bg_1.png";
import bg2 from "../assets/bg_2.png";
import bg3 from "../assets/bg_3.png";
import bg4 from "../assets/bg_4.png";
import bg5 from "../assets/bg_5.png";
import { Block } from "../components/block";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { useContext } from "react";
import { UserContext } from "../context/UserProvider";

export const Home = () => {
  const router = useNavigate();
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("UserContext not found");
  }
  const { user } = context;
  return (
    <div className="text-3xl p-4 text-center font-bold text-zinc-300">
      <div className="flex items-center flex-col md:flex-row">
        <img src={bg1} alt="bg1" className="w-full sm:w-[768px]" />
        <div className="p-4 mb-3 md:flex md:flex-col md:items-center text-wrap md:space-y-2">
          <p className="text-2xl text-emerald-100 text-balance">
            Nakama is a platform that allows you to create a room with your
            friends.
          </p>
          <div className="flex space-y-2 md:space-y-0 mt-2 flex-col md:flex-row md:space-x-2 md:w-full md:justify-center">
            <Button
              onClick={() =>
                user === null ? router("/auth/?type=login") : router("/groups")
              }
              text={user != null ? "Groups" : "Login"}
              variant="primary"
              className="flex-1 rounded-lg"
            />
            <Button
              onClick={() =>
                user === null
                  ? router("/auth/?type=register")
                  : router("/profile")
              }
              text={user != null ? "Profile" : "Register"}
              variant="secondary"
              className={`flex-1 rounded-lg ${
                user === null ? "" : "hover:outline-red-400"
              }`}
            />
          </div>
        </div>
      </div>
      <div className="sm:m-8 m-4 p-2 sm:p-8 border border-emerald-900 rounded-xl flex flex-col gap-8">
        <Block
          imgSrc={bg2}
          desc="Be the captain of the crew, As the captain, your vision and decisions will shape the journey ahead"
        />
        <Block
          imgSrc={bg3}
          desc="Be the first to join,
          Set the trend and be the pioneer who steps up first. Your early commitment will inspire others to follow"
        />
        <Block
          imgSrc={bg4}
          desc="Be the cook to smoke, Elevate the experience by infusing every moment with your unique touch."
        />
        <Block
          imgSrc={bg5}
          desc="Be the one to remodel the group, Be the catalyst for change, guiding everyone toward a brighter, reimagined future."
        />
      </div>
    </div>
  );
};
