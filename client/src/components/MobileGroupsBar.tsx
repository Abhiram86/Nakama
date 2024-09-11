import { Group } from "./GroupsBar";
import { useNavigate } from "react-router-dom";
import plus from "../assets/plus.svg";
import { useContext, useEffect, useRef, useState } from "react";
import NewGrpModal from "./NewGrpModal";
import noperson from "../assets/user.svg";
import { io, Socket } from "socket.io-client";
import { UserContext } from "../context/UserProvider";
import { getAllGroups } from "../requests/user";

export default function MoblieGroupsBar({ data }: { data: Group[] }) {
  const router = useNavigate();
  const [isModelOpen, setIsModelOpen] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("No context found");
  }
  const { user, setUser } = context;
  useEffect(() => {
    if (socketRef.current === null) {
      socketRef.current = io("http://localhost:3000");
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  });
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.on("newMember", (data) => {
      if (data.userId === user?.id) {
        const updatedGroupIds = user?.groups ?? [];
        updatedGroupIds.push(data.group._id);
        setUser((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            groups: updatedGroupIds,
          };
        });
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, groups: updatedGroupIds })
        );
      }
    });

    socket.on("newGroupCreated", (data) => {
      if (data.members.includes(user?.id)) {
        const newGroupIds = user?.groups ?? [];
        newGroupIds?.push(data.id);
        setUser((prev) => {
          if (!prev) return prev;
          return { ...prev, groups: newGroupIds };
        });
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, groups: newGroupIds })
        );
      }
    });

    socket.on("deleted", (data) => {
      if (data.members.includes(user?.id)) {
        const updatedGroupIds = user?.groups ?? [];
        updatedGroupIds.filter((id) => id !== data.groupId);
        setUser((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            groups: updatedGroupIds,
          };
        });
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, groups: updatedGroupIds })
        );
      }
    });

    return () => {
      socket.off("newMember");
      socket.off("newGroupCreated");
      socket.off("deleted");
    };
  });
  useEffect(() => {
    const handleGetData = async () => {
      if (!user) return;
      const res = await getAllGroups(user.id);
      console.log(res.data.groups);
      if (res.status === 200) {
        const rawData = localStorage.getItem("user");
        if (rawData) {
          const data = JSON.parse(rawData);
          console.log(data);
          if (
            !res.data.groups.every((id: string) => data.groups.includes(id))
          ) {
            localStorage.setItem(
              "user",
              JSON.stringify({ ...user, groups: res.data.groups })
            );
          }
        }
      }
    };
    handleGetData();
  }, [user]);
  return (
    <div className="w-full p-2 mt-12 overflow-y-auto rounded-2xl select-none">
      <div className="flex flex-row items-center gap-x-12 justify-center p-2">
        <h1 className="text-2xl font-bold text-center">Groups</h1>
        <div
          className="flex flex-row cursor-pointer items-center w-full p-1 bg-emerald-500 justify-center rounded-3xl gap-x-2"
          onClick={() => setIsModelOpen(true)}
        >
          <p className="text-zinc-900 font-medium">Create New</p>
          <img src={plus} alt="plus" />
        </div>
      </div>
      {isModelOpen && (
        <div className="fixed mt-4 z-10 w-[calc(100vw-3rem)]">
          <NewGrpModal setIsModelOpen={setIsModelOpen} />
        </div>
      )}
      <div className="flex relative h-[calc(100vh-8.5rem)] overflow-y-auto flex-col border-t-2 border-b py-4 border-emerald-500">
        {data.map((group) => (
          <div
            key={group._id}
            onClick={() => router(`/mobile/group/${group._id}`)}
            className="group border-emerald-900 w-full flex px-2 py-2 rounded-md justify-stretch items-center gap-4"
          >
            <img
              src={group.groupIcon || noperson}
              className="w-10 h-10 outline outline-1 rounded-full cursor-pointer transition-all"
              alt="group"
            />
            <p className="text-lg font-bold cursor-pointer h-14 pt-3 flex-1">
              {group.name}
            </p>
            {group.bio && (
              <p className="absolute text-xs italic pointer-events-none left-16 mt-8">
                {group.bio}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
