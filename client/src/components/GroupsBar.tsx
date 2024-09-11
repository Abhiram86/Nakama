import { useState } from "react";
import { useNavigate } from "react-router-dom";
import plus from "../assets/plus.svg";
import NewGrpModal from "./NewGrpModal";
import noperson from "../assets/user.svg";
import { useSearchParams } from "react-router-dom";

export type Group = {
  _id: string;
  name: string;
  groupIcon: string;
  bio?: string;
  members?: string[];
  createdBy?: string;
  messageIds?: string[];
};

export default function GroupsBar({ data }: { data: Group[] }) {
  const router = useNavigate();
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get("id");
  const [selectedGroup, setSelectedGroup] = useState(groupId || data[0]._id);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const handleGroupClick = (id: string) => {
    setSelectedGroup(id);
    router(`/groups?id=${id}`);
  };
  return (
    <aside className="h-[calc(100vh-8.5rem)] select-none sm:w-72 md:w-96 p-2 border-t-4 border-emerald-900 fixed overflow-y-auto rounded-2xl">
      <div className="pb-2 px-2 flex flex-row items-center gap-x-4">
        <h1 className="text-2xl font-bold">Groups</h1>
        <div
          className="flex flex-row cursor-pointer items-center w-full p-1 bg-zinc-700 justify-center rounded-3xl gap-x-2"
          onClick={() => setIsModelOpen(true)}
        >
          <p className="text-emerald-500">Create New</p>
          <img src={plus} alt="plus" />
        </div>
      </div>
      {isModelOpen && (
        <div className="absolute mt-4 w-[calc(100%-1rem)]">
          <NewGrpModal setIsModelOpen={setIsModelOpen} />
        </div>
      )}
      <div className="flex flex-col gap-y-1 divide-y divide-emerald-800 bg-zinc-900 border-t-2 border-b border-emerald-500">
        {data.map((group) => (
          <div
            onClick={() => handleGroupClick(group._id)}
            key={group._id}
            className={`group hover:bg-zinc-700 w-full flex px-2 py-4 rounded-md justify-stretch items-center gap-3 ${
              selectedGroup === group._id ? "bg-zinc-800 font-bold" : ""
            }`}
          >
            <img
              src={group.groupIcon || noperson}
              className="w-10 h-10 outline outline-1 rounded-full cursor-pointer hover:scale-150 hover:mx-2 transition-all"
              alt="group"
            />
            <p>{group.name}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}
