import { Form, Input } from "../ui/form";
import plus from "../assets/plus.svg";
import userpen from "../assets/userpen.svg";
import userplus from "../assets/userplus.svg";
import userminus from "../assets/userminus.svg";
import up from "../assets/up.svg";
import exit from "../assets/exit.svg";
import trash from "../assets/delete.svg";
import { useRef, useState } from "react";
import {
  addMember,
  changeGroupBio,
  changeGroupName,
  changeGroupProfile,
  clearChat,
  deleteGroup,
  exitGroup,
  removeMember,
} from "../requests/group";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Group } from "./GroupsBar";
import { User } from "../context/UserProvider";

export default function GroupModal({
  setIsGrpModalOpen,
  grp,
  user,
}: {
  setIsGrpModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  grp: Group;
  user: User;
}) {
  const router = useNavigate();
  const newMemberRef = useRef<HTMLInputElement | null>(null);
  const removeMemberRef = useRef<HTMLInputElement | null>(null);
  const roomNameRef = useRef<HTMLInputElement | null>(null);
  const BioRef = useRef<HTMLInputElement | null>(null);
  const iconRef = useRef<HTMLInputElement | null>(null);
  const [isAddMemberSelected, setIsAddMemberSelected] = useState(false);
  const [isChangeIconSelected, setIsChangeIconSelected] = useState(false);
  const [isRemoveMemberSelected, setIsRemoveMemberSelected] = useState(false);
  const [isChangeNameSelected, setIsChangeNameSelected] = useState(false);
  const [isChangeBioSelected, setIsChangeBioSelected] = useState(false);
  const handleAddNewMember = async () => {
    if (!newMemberRef.current || !grp) return;
    const res = await addMember(grp._id, newMemberRef.current.value);
    if (res.status === 200) {
      setIsAddMemberSelected(false);
      toast.success(newMemberRef.current.value + " added successfully", {
        style: {
          background: "rgb(39, 39, 42)",
          color: "rgb(224, 224, 224)",
        },
      });
    } else {
      toast.error(res.data.msg, {
        style: {
          background: "rgb(39, 39, 42)",
          color: "rgb(224, 224, 224)",
        },
      });
    }
  };
  const handleRemoveMember = async () => {
    if (!removeMemberRef.current || !grp || !user.id) return;
    console.log(removeMemberRef.current.value);
    const res = await removeMember(
      grp._id,
      removeMemberRef.current.value,
      user.id
    );
    if (res.status === 200) {
      setIsRemoveMemberSelected(false);
      toast.success(removeMemberRef.current.value + " removed successfully", {
        style: {
          background: "rgb(39, 39, 42)",
          color: "rgb(224, 224, 224)",
        },
      });
      removeMemberRef.current.value = "";
    } else {
      toast.error(res.data.msg, {
        style: {
          background: "rgb(39, 39, 42)",
          color: "rgb(224, 224, 224)",
        },
      });
    }
  };
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this group?")) {
      const res = await deleteGroup(grp._id);
      if (res.status === 200) {
        toast.success("Group deleted successfully", {
          duration: 500,
          style: {
            background: "rgb(39 39 42)",
            color: "white",
          },
        });
        setTimeout(() => {
          router("/groups");
        }, 500);
      }
    }
  };
  const handleExitGroup = async () => {
    if (confirm("Are you sure you want to exit this group?")) {
      if (!grp || !user.id) return;
      const res = await exitGroup(grp._id, user.id);
      if (res.status === 200) {
        toast.success("Group exited successfully", {
          style: {
            background: "rgb(39 39 42)",
            color: "white",
          },
        });
        user = { ...user, groups: user.groups.filter((g) => g !== grp._id) };
        localStorage.setItem("user", JSON.stringify(user));
        router("/groups");
      } else {
        toast.error(res.data.msg, {
          style: {
            background: "rgb(39 39 42)",
            color: "white",
          },
        });
      }
    }
  };
  const handleChangeName = async () => {
    if (!roomNameRef.current || !grp) return;
    const res = await changeGroupName(grp._id, roomNameRef.current?.value);
    if (res.status === 200) {
      setIsChangeNameSelected(false);
      toast.success("Group name changed successfully", {
        duration: 500,
        style: {
          background: "rgb(39 39 42)",
          color: "white",
        },
      });
      grp.name = roomNameRef.current.value;
    } else {
      toast.error(res.data.msg, {
        style: {
          background: "rgb(39 39 42)",
          color: "white",
        },
      });
    }
  };
  const handleChangeBio = async () => {
    if (!BioRef.current || !grp) return;
    const res = await changeGroupBio(grp._id, BioRef.current?.value);
    if (res.status === 200) {
      setIsChangeBioSelected(false);
      toast.success("Group bio changed successfully", {
        duration: 500,
        style: {
          background: "rgb(39 39 42)",
          color: "white",
        },
      });
      grp.bio = BioRef.current.value;
    } else {
      toast.error(res.data.msg, {
        style: {
          background: "rgb(39 39 42)",
          color: "white",
        },
      });
    }
  };
  const handleChangeIcon = async () => {
    if (!iconRef.current || !grp) return;
    const res = await changeGroupProfile(grp._id, iconRef.current?.value);
    if (res.status === 200) {
      setIsChangeIconSelected(false);
      toast.success("Group icon changed successfully", {
        style: {
          background: "rgb(39 39 42)",
          color: "white",
        },
      });
      grp.groupIcon = iconRef.current.value;
    } else {
      toast.error(res.data.msg, {
        style: {
          background: "rgb(39 39 42)",
          color: "white",
        },
      });
    }
  };
  const handleClearChat = async () => {
    const res = await clearChat(grp._id);
    if (res.status === 200) {
      toast.success("Chat cleared successfully", {
        style: {
          background: "rgb(39 39 42)",
          color: "white",
        },
      });
      grp.messageIds = [];
    } else {
      toast.error(res.data.msg, {
        style: {
          background: "rgb(39 39 42)",
          color: "white",
        },
      });
    }
  };
  const isAdmin = grp && user && grp.createdBy === user.id;
  return (
    <>
      <Toaster />
      <Form className="border select-none border-zinc-600 relative rounded-xl w-64 ml-auto bg-zinc-900/25 backdrop-blur-md">
        <div>
          <img
            src={plus}
            alt="close"
            className="cursor-pointer absolute top-3 w-4 h-4 right-3 rotate-45 ml-auto bg-red-500 rounded-full"
            onClick={() => setIsGrpModalOpen(false)}
          />
        </div>
        <div className="flex divide-y divide-zinc-600 flex-col gap-y-2">
          <div className="flex flex-col gap-y-1">
            <div
              className="flex flex-row items-center cursor-pointer gap-x-2"
              onClick={() => setIsAddMemberSelected((prev) => !prev)}
            >
              <img src={userplus} alt="add new member" />
              <p id="addMember">Add Member</p>
            </div>
            {isAddMemberSelected && (
              <div className="flex flex-row items-center gap-x-2">
                <Input
                  id="addMember"
                  inputRef={newMemberRef}
                  className="w-44"
                  placeholder="Enter Name"
                />
                <img
                  src={up}
                  className="rounded-full p-1 h-7 cursor-pointer bg-zinc-300"
                  alt="update"
                  onClick={handleAddNewMember}
                />
              </div>
            )}
          </div>
          <div className="flex flex-col pt-1 gap-y-1">
            <div
              className="flex cursor-pointer flex-row items-center gap-x-2"
              onClick={() => setIsChangeIconSelected((prev) => !prev)}
            >
              <img
                src={grp.groupIcon || userpen}
                alt="change icon"
                className="w-6 h-6 rounded-full object-cover"
              />
              <p className="cursor-pointer" id="">
                Change Icon
              </p>
            </div>
            {isChangeIconSelected && (
              <div className="flex flex-row items-center gap-x-2">
                <Input
                  id="changeIcon"
                  placeholder="Enter URL"
                  className="w-44"
                  inputRef={iconRef}
                />
                <img
                  src={up}
                  className="rounded-full p-1 h-7 cursor-pointer bg-zinc-300"
                  alt="update"
                  onClick={handleChangeIcon}
                />
              </div>
            )}
          </div>
          <div className="flex flex-col pt-1 gap-y-1">
            <div
              className="flex cursor-pointer flex-row items-center gap-x-2"
              onClick={() => setIsChangeNameSelected((prev) => !prev)}
            >
              <p className="cursor-pointer">Change Name</p>
            </div>
            {isChangeNameSelected && (
              <div className="flex flex-row items-center gap-x-2">
                <Input
                  id="changeName"
                  placeholder="Enter Name"
                  className="w-44"
                  inputRef={roomNameRef}
                />
                <img
                  src={up}
                  className="rounded-full p-1 h-7 cursor-pointer bg-zinc-300"
                  alt="update"
                  onClick={handleChangeName}
                />
              </div>
            )}
          </div>
          <div className="flex flex-col pt-1 gap-y-1">
            <div
              className="flex cursor-pointer flex-row items-center gap-x-2"
              onClick={() => setIsChangeBioSelected((prev) => !prev)}
            >
              <p className="cursor-pointer">Change Bio</p>
            </div>
            {isChangeBioSelected && (
              <div className="flex flex-row items-center gap-x-2">
                <Input
                  id="changeBio"
                  placeholder="Enter Bio"
                  className="w-44"
                  inputRef={BioRef}
                />
                <img
                  src={up}
                  className="rounded-full p-1 h-7 cursor-pointer bg-zinc-300"
                  alt="update"
                  onClick={handleChangeBio}
                />
              </div>
            )}
          </div>
          <div
            className="flex cursor-pointer pt-1 flex-row items-center gap-x-2"
            onClick={handleExitGroup}
          >
            <img src={exit} alt="Exit" />
            <p className="text-red-300 font-semibold" id="">
              Exit Group
            </p>
          </div>
          {isAdmin && (
            <>
              <div className="flex flex-col pt-1 gap-y-1">
                <div
                  className="flex cursor-pointer flex-row items-center gap-x-2"
                  onClick={() => setIsRemoveMemberSelected((prev) => !prev)}
                >
                  <img src={userminus} alt="Remove Member" />
                  <p className="text-red-300" id="">
                    Remove Member
                  </p>
                </div>
                {isRemoveMemberSelected && (
                  <div className="flex flex-row items-center gap-x-2">
                    <Input
                      id="removeMember"
                      placeholder="Enter Name"
                      className="w-44"
                      inputRef={removeMemberRef}
                    />
                    <img
                      src={up}
                      className="rounded-full p-1 h-7 cursor-pointer bg-zinc-300"
                      alt="update"
                      onClick={handleRemoveMember}
                    />
                  </div>
                )}
              </div>
              <div
                className="flex bg cursor-pointer pt-1 flex-row items-center gap-x-2"
                onClick={handleClearChat}
              >
                <p className="text-red-600 font-semibold">Clear Chat</p>
              </div>
              <div
                className="flex bg cursor-pointer pt-1 flex-row items-center gap-x-2"
                onClick={handleDelete}
              >
                <img src={trash} alt="Delete Group" />
                <p className="text-red-600 font-semibold">Delete Group</p>
              </div>
            </>
          )}
        </div>
      </Form>
    </>
  );
}
