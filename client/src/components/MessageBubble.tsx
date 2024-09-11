import { useState } from "react";
import noperson from "../assets/user.svg";
import ViewPic from "./ViewPic";

export default function MessageBubble({
  username,
  message,
  sendersName,
  senderProfile,
}: {
  username: string | undefined;
  message: string;
  sendersName: string;
  senderProfile: string | undefined;
}) {
  const [viewPic, setViewPic] = useState(false);
  return (
    <div
      className={`flex flex-col w-fit px-2 py-1 gap-y-1 ${
        sendersName === username ? "ml-auto" : ""
      }`}
    >
      <div className="flex flex-row items-center gap-2">
        <img
          className="w-6 h-6 rounded-full cursor-pointer object-cover"
          src={
            senderProfile && senderProfile.length > 0 ? senderProfile : noperson
          }
          onClick={() => setViewPic(true)}
          alt="profile"
        />
        <p className="text-xs">{sendersName}</p>
      </div>
      {viewPic && (
        <ViewPic img={senderProfile || ""} setIsViewPic={setViewPic} />
      )}
      <p
        className={`border 
          lg:max-w-[28rem] md:max-w-96 sm:max-w-72 border-zinc-700 px-4 py-1 rounded-full ${
            sendersName === username
              ? "text-zinc-900 font-semibold bg-emerald-500"
              : ""
          }`}
      >
        {message}
      </p>
    </div>
  );
}

export type Message = {
  _id: string;
  text: string;
  sender: string;
  senderProfile: string;
  groupId: string;
  createdAt?: string;
};
