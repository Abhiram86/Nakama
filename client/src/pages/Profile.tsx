import { useContext, useState } from "react";
import { UserContext } from "../context/UserProvider";
import noperson from "../assets/user.svg";
import { Label } from "../ui/form";
import edit from "../assets/edit.svg";
import copy from "../assets/copy.svg";
import PicChangeModal from "../components/PicChangeModal";
import ViewPic from "../components/ViewPic";

export default function Profile() {
  const context = useContext(UserContext);
  const [editBoxOpen, setEditBoxOpen] = useState(false);
  const [viewPic, setViewPic] = useState(false);
  if (!context) throw new Error("UserContext not found");
  const { user } = context;
  const handleCopy = () => {
    navigator.clipboard.writeText(user?.id || "");
    console.log(user?.profile);
    alert("ID copied to clipboard");
  };
  return (
    <section className="text-zinc-300 mt-12 p-4">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row items-center gap-x-4">
          <img
            src={user?.profile || noperson}
            className="w-10 h-10 object-cover cursor-pointer outline outline-1 rounded-full"
            alt="profile"
            onClick={() => setViewPic(true)}
          />
          <h1 className="text-xl font-semibold">
            <span className="text-emerald-500">{user?.name}</span>'s Profile
          </h1>
        </div>
        <img
          src={edit}
          alt="edit"
          className="w-18 cursor-pointer hover:bg-zinc-700 p-2 rounded-xl"
          onClick={() => setEditBoxOpen(true)}
        />
      </div>
      {viewPic && user && (
        <ViewPic img={user?.profile || ""} setIsViewPic={setViewPic} />
      )}
      <hr className="w-full my-4" />
      {editBoxOpen && user && (
        <div className="absolute w-[calc(100vw-2rem)]">
          <PicChangeModal user={user} setEditBoxOpen={setEditBoxOpen} />
        </div>
      )}
      <div className="flex flex-col gap-y-2">
        <div className="flex flex-row text-lg items-center gap-x-4">
          <Label id="name" text="ID" className="w-12" />
          <p className="py-2 px-4 bg-zinc-900/55 rounded-xl">{user?.id}</p>
          <img
            src={copy}
            alt="copy"
            className="w-6 cursor-pointer"
            onClick={handleCopy}
            onTouchStart={handleCopy}
          />
        </div>
        <div className="flex flex-row text-lg items-center gap-x-4">
          <Label id="name" text="Name" className="w-12" />
          <p className="py-2 px-4 bg-zinc-900/55 rounded-xl">{user?.name}</p>
        </div>
        <div className="flex flex-row text-lg items-center gap-x-4">
          <Label id="email" text="Email" className="w-12" />
          <p className="py-2 px-4 bg-zinc-900/55 rounded-xl">{user?.email}</p>
        </div>
      </div>
    </section>
  );
}
