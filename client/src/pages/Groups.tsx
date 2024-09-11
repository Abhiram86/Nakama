import GroupChatPlace from "../components/GroupChatPlace";
import GroupsBar, { Group } from "../components/GroupsBar";
import MoblieGroupsBar from "../components/MobileGroupsBar";
import { useSearchParams } from "react-router-dom";
import PleaseSelect from "../components/PleaseSelect";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../context/UserProvider";
import { getGroups } from "../requests/group";
import { io, Socket } from "socket.io-client";

export default function Groups() {
  const socketRef = useRef<Socket | null>(null);
  const [params] = useSearchParams();
  const id = params.get("id");
  const context = useContext(UserContext);
  const [groupData, setGroupData] = useState<Group[] | null>(null);
  if (!context) {
    throw new Error("UserContext not found");
  }
  const { user, setUser } = context;
  useEffect(() => {
    const handleGetData = async () => {
      if (!user) return;
      console.log(user.groups);
      const res = await getGroups(user.groups);
      if (res.status === 200) {
        setGroupData(res.data);
        console.log(res.data);
        const rawData = localStorage.getItem("user");
        if (rawData) {
          const data = JSON.parse(rawData);
          console.log(data);
          if (data.groups !== user.groups) {
            localStorage.setItem(
              "user",
              JSON.stringify({ ...user, groups: res.data })
            );
          }
        }
      }
    };
    handleGetData();
  }, [user]);
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
      if (user?.id === data.userId) {
        const updatedGroupIds = user?.groups ?? [];
        updatedGroupIds?.push(data.group._id);
        setUser((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            groups: updatedGroupIds,
          };
        });
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            groups: updatedGroupIds,
          })
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
      console.log(data);
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
  return (
    <section className="text-zinc-300 p-2 mt-12 h-full">
      {groupData && (
        <>
          <div className="hidden sm:block">
            <GroupsBar data={groupData} />
            {id ? <GroupChatPlace id={id} /> : <PleaseSelect />}
          </div>
          <div className="w-full block sm:hidden mx-auto">
            <MoblieGroupsBar data={groupData} />
          </div>
        </>
      )}
    </section>
  );
}
