import { useNavigate, useParams } from "react-router-dom";
import send from "../assets/send.svg";
import MessageBubble, { Message } from "../components/MessageBubble";
// import { dummyData } from "../components/GroupChatPlace";
import { useContext, useEffect, useRef, useState } from "react";
import { getGroupById, getMessages, sendMessage } from "../requests/group";
import { Group } from "../components/GroupsBar";
import noperson from "../assets/user.svg";
import { UserContext } from "../context/UserProvider";
import { io, Socket } from "socket.io-client";
import more from "../assets/more.svg";
import GroupModal from "../components/GroupModal";
import GroupInfo from "../components/GroupInfo";
import ViewPic from "../components/ViewPic";

export default function MobileChatArea() {
  const router = useNavigate();
  const socketRef = useRef<Socket | null>(null);
  const { groupId } = useParams();
  const textRef = useRef<HTMLTextAreaElement | null>(null);
  const [groupData, setGroupData] = useState<Group>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isViewPic, setIsViewPic] = useState(false);
  const [isGrpModalOpen, setIsGrpModalOpen] = useState(false);
  const [isViewGroupInfo, setIsViewGroupInfo] = useState(false);
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
  }, []);
  useEffect(() => {
    const handleGetGroup = async () => {
      if (!groupId) return;
      const [res1, res2] = await Promise.all([
        getGroupById(groupId),
        getMessages(groupId),
      ]);
      if (res1.status === 200 && res2.status === 200) {
        setGroupData(res1.data);
        setMessages(res2.data.messages);
      }
    };
    handleGetGroup();
  }, [groupId]);

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
    if (!socket) return;
    socket.on("connect", () => {
      console.log("connected");
      socket.emit("join", groupId);
    });

    socket.on("newMessage", (msg) => {
      console.log("newMessage", msg);
      setMessages((prevMessages) => [...prevMessages, msg.message]);
    });

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
        const updatedGroupIds = user?.groups.filter(
          (grpId) => grpId !== groupId
        );
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
      socket.off("connect");
      socket.off("newMessage");
      socket.off("nameChanged");
      socket.off("bioChanged");
      socket.off("profileChanged");
      socket.disconnect();
    };
  }, [socketRef, groupId]);

  const handleSendMessage = async () => {
    if (!textRef.current || !groupId || !user) return;
    const res = await sendMessage(
      groupId,
      user?.name,
      user?.profile || "",
      textRef.current.value
    );
    if (res.status === 200) {
      textRef.current.value = "";
    }
  };
  console.log(messages);
  return (
    <div className="text-zinc-100 mt-12">
      <div className="w-full p-4 px-2">
        <div className="flex flex-row justify-between items-center pb-3 border-b border-zinc-600">
          <div className="flex cursor-pointer px-2 flex-row items-center gap">
            <img
              src={(groupData && groupData.groupIcon) || noperson}
              alt="pic"
              className="w-10 h-10 rounded-full"
              onClick={() => setIsViewPic(true)}
            />
            <h1
              className="px-2 ml-1 hover:bg-zinc-700 rounded-lg"
              onClick={() => setIsViewGroupInfo(true)}
            >
              {groupData && groupData.name}
            </h1>
          </div>
          <img
            src={more}
            alt="more"
            onClick={() => setIsGrpModalOpen(true)}
            className="cursor-pointer rounded-full w-7 h-7 hover:bg-zinc-700 p-1"
          />
        </div>
        {isViewGroupInfo && groupData && (
          <GroupInfo
            setIsViewGroupInfo={setIsViewGroupInfo}
            groupData={groupData}
          />
        )}
        {isViewPic && groupData && (
          <ViewPic
            setIsViewPic={setIsViewPic}
            img={groupData?.groupIcon || ""}
          />
        )}
        {isGrpModalOpen && user && groupData && (
          <div className="absolute z-10 top-16 right-4 w-fit">
            <GroupModal
              setIsGrpModalOpen={setIsGrpModalOpen}
              grp={groupData}
              user={user}
              // isAdmin={user?.id === groupData?.createdBy}
              // userId={user.id}
              // setUser={context?.setUser}
            />
          </div>
        )}
        <div className="h-[calc(100vh-13.8rem)] mt-4 z-0 relative overflow-y-auto">
          {messages.map((data: Message) => (
            <MessageBubble
              key={data.groupId}
              senderProfile={data?.senderProfile}
              message={data.text}
              sendersName={data.sender}
              username={user?.name}
            />
          ))}
          <div className="flex flex-row items-center p-2 mt-2">
            <textarea
              name="chatbox"
              id="chatbox"
              rows={1}
              className="w-full min-h-3 max-h-52 p-3 border-2 border-zinc-600 flex-1 rounded-3xl bg-zinc-900/15 resize-none overflow-y-auto"
              placeholder="Type here..."
              ref={textRef}
            />
            <img
              src={send}
              alt="send"
              className="w-8 h-8 cursor-pointer rotate-[135deg]"
              onClick={handleSendMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
