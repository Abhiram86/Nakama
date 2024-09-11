import MessageBubble, { Message } from "./MessageBubble";
import send from "../assets/send.svg";
import more from "../assets/more.svg";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { Group } from "./GroupsBar";
import { getGroupById, getMessages, sendMessage } from "../requests/group";
import noperson from "../assets/user.svg";
import { UserContext } from "../context/UserProvider";
import { io, Socket } from "socket.io-client";
import GroupModal from "./GroupModal";
import ViewPic from "./ViewPic";
import { useNavigate } from "react-router-dom";
import GroupInfo from "./GroupInfo";

export default function GroupChatPlace({ id }: { id: string }) {
  const router = useNavigate();
  const socketRef = useRef<Socket | null>(null);
  const textRef = useRef<HTMLTextAreaElement | null>(null);
  const [groupData, setGroupData] = useState<Group>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGrpModalOpen, setIsGrpModalOpen] = useState(false);
  const [isViewGroupInfo, setIsViewGroupInfo] = useState(false);
  const [viewPic, setIsViewPic] = useState(false);
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("No context found");
  }
  const { user, setUser } = context;
  useEffect(() => {
    const textarea = textRef.current;
    if (textarea) {
      const adjustHeight = () => {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      };
      textarea.addEventListener("input", adjustHeight);
      return () => {
        textarea.removeEventListener("input", adjustHeight);
      };
    }
  });
  useEffect(() => {
    const handleGetGroup = async () => {
      if (!id) return;
      const [res1, res2] = await Promise.all([
        getGroupById(id),
        getMessages(id),
      ]);
      if (res1.status === 200) {
        setGroupData(res1.data);
      }
      if (res2.status === 200) {
        setMessages(res2.data.messages);
      }
    };
    handleGetGroup();
  }, [id]);

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
  }, []);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !id) return;
    socket.emit("join", id);

    const handleMessageReceive = (msg: { message: Message }) => {
      setMessages((prevMessages) => [...prevMessages, msg.message]);
    };

    socket.on("newMessage", handleMessageReceive);

    socket.on("nameChanged", (data) => {
      setGroupData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          name: data.newName,
        };
      });
    });

    socket.on("bioChanged", (data) => {
      setGroupData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          bio: data.newBio,
        };
      });
    });

    socket.on("profileChanged", (data) => {
      setGroupData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          profile: data.newProfile,
        };
      });
    });

    socket.on("newMember", (data) => {
      if (data.userId === user?.id) {
        console.log("newMember", data.newMember);
      }
    });

    socket.on("removeMember", (data) => {
      if (data.userId === user?.id) {
        const updatedGroupIds = user?.groups.filter((grpId) => grpId !== id);
        setUser((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            groups: updatedGroupIds ?? [],
          };
        });
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            groups: updatedGroupIds,
          })
        );
        router("/groups");
      }
    });

    return () => {
      socket.emit("leave", id);
      socket.off("newMessage", handleMessageReceive);
      socket.off("nameChanged");
      socket.off("bioChanged");
      socket.off("profileChanged");
      socket.off("removeMember");
      socket.disconnect();
    };
  }, [id, socketRef, user]);
  const handleSendMessage = async () => {
    if (!textRef.current || !id || !user) return;
    const res = await sendMessage(
      id,
      user?.name,
      user?.profile || "",
      textRef.current.value
    );
    if (res.status === 200) {
      textRef.current.value = "";
    }
  };
  return (
    <div className="sm:ml-80 md:ml-[25rem] p-2 px-0">
      <div className="flex flex-row mr-auto px-2 gap-x-4 items-center justify-between pb-3 border-b border-zinc-600">
        <div className="flex relative flex-row items-center">
          <img
            src={(groupData && groupData.groupIcon) || noperson}
            alt="pic"
            className="w-10 h-10 rounded-full cursor-pointer"
            onClick={() => setIsViewPic(true)}
          />
          <div
            className="pr-6 pl-3 cursor-pointer hover:bg-zinc-700 rounded-lg"
            onClick={() => setIsViewGroupInfo(true)}
          >
            <h1>{groupData && groupData.name}</h1>
            <p className="text-zinc-400 w-max text-xs italic">
              {groupData && groupData.bio}
            </p>
          </div>
        </div>
        <img
          src={more}
          className="w-6 p-1 rounded-full cursor-pointer hover:bg-zinc-700"
          alt="more"
          onClick={() => setIsGrpModalOpen(true)}
        />
      </div>
      {isViewGroupInfo && groupData && (
        <GroupInfo
          groupData={groupData}
          setIsViewGroupInfo={setIsViewGroupInfo}
        />
      )}
      {viewPic && groupData?.name && (
        <ViewPic img={groupData?.groupIcon || ""} setIsViewPic={setIsViewPic} />
      )}
      {isGrpModalOpen && user && groupData && (
        <div className="fixed mt-4 z-10 top-14 right-4">
          <GroupModal
            grp={groupData}
            setIsGrpModalOpen={setIsGrpModalOpen}
            user={user}
            // isAdmin={user?.id === groupData?.createdBy}
            // setUser={context?.setUser}
            // userId={user.id}
          />
        </div>
      )}
      <div className="h-[calc(100vh-13.8rem)] mt-4 z-0 relative scroll-smooth overflow-y-auto">
        {messages.map((data: Message) => (
          <Fragment key={data._id}>
            <MessageBubble
              key={data.groupId}
              message={data.text}
              senderProfile={data?.senderProfile}
              sendersName={data.sender}
              username={user?.name}
            />
          </Fragment>
        ))}
        <div className="flex flex-row items-center p-2 mt-2">
          <textarea
            name="chatbox"
            id="chatbox"
            rows={1}
            ref={textRef}
            className="w-full p-3 overflow-y-none max-h-52 border-2 border-zinc-600 flex-1 rounded-3xl bg-zinc-900/15 resize-none"
            placeholder="Type here..."
          />
          <img
            src={send}
            alt="send"
            className="w-8 select-none h-8 cursor-pointer rotate-[135deg]"
            onClick={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
}
