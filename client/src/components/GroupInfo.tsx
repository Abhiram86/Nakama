import { Group } from "./GroupsBar";
import noperson from "../assets/user.svg";
import plus from "../assets/plus.svg";
import { useEffect, useState } from "react";
import { getUsers } from "../requests/user";

type UserObj = {
  name: string;
  profile: string;
};

export default function GroupInfo({
  groupData,
  setIsViewGroupInfo,
}: {
  groupData: Group;
  setIsViewGroupInfo: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [users, setUsers] = useState<UserObj[]>([]);
  useEffect(() => {
    const handleGetUsers = async () => {
      const res = await getUsers(groupData._id);
      if (res.status === 200) {
        setUsers(res.data);
      }
    };
    handleGetUsers();
  }, [groupData._id]);
  return (
    <div className="fixed z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 rounded-xl bg-zinc-900/15 flex flex-col gap-y-2 sm:w-[28rem] w-80 backdrop-blur-sm border-2 border-zinc-600 max-h-[40rem] overflow-y-auto">
      <div
        className="absolute right-4"
        onClick={() => setIsViewGroupInfo(false)}
      >
        <img
          src={plus}
          className="cursor-pointer w-5 h-5 hover:scale-125 transition-all rotate-45 bg-red-500 rounded-full"
          alt="close"
        />
      </div>
      <a
        href={groupData.groupIcon}
        download
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={
            groupData.groupIcon && groupData.groupIcon.length > 0
              ? groupData.groupIcon
              : noperson
          }
          alt="group icon"
          className="rounded-full aspect-square object-cover"
        />
      </a>
      <div className="flex flex-col">
        <h1 className="text-center text-2xl sm:text-3xl font-semibold">
          {groupData.name}
        </h1>
        <p className="text-center text-sm text-zinc-400 italic">
          {groupData.bio}
        </p>
        <div className="flex flex-col mt-2">
          <p>Group Members</p>
          <hr className="my-1 border-zinc-500" />
          <div className="flex flex-col gap-2 justify-center divide-y divide-zinc-400 p-2">
            {users.map((user) => (
              <div className="flex flex-row items-center justify-between py-1">
                <li className="list-none">{user.name}</li>
                <img
                  src={user.profile}
                  alt="user profiel"
                  className="w-14 h-14 object-cover hover:scale-150 transition-all rounded-full"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
