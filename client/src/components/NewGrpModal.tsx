import Button from "../ui/Button";
import { Form, Input, Label } from "../ui/form";
import { createGroup } from "../requests/group";
import { useContext, useRef } from "react";
import { UserContext } from "../context/UserProvider";
import toast, { Toaster } from "react-hot-toast";

export default function NewGrpModal({
  setIsModelOpen,
}: {
  setIsModelOpen: (value: boolean) => void;
}) {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("UserContext not found");
  }
  const { user } = context;
  const grpNameRef = useRef<HTMLInputElement | null>(null);
  const grpMemberRef = useRef<HTMLInputElement | null>(null);
  const grpIconRef = useRef<HTMLInputElement | null>(null);
  const grpBioRef = useRef<HTMLInputElement | null>(null);
  const handleSubmit = async () => {
    if (
      grpNameRef.current &&
      grpMemberRef.current &&
      grpIconRef.current &&
      grpBioRef.current &&
      user
    ) {
      const res = await createGroup(
        grpNameRef.current.value,
        grpBioRef.current.value,
        grpMemberRef.current.value,
        user.id,
        grpIconRef.current.value
      );
      if (res.status === 200) {
        setIsModelOpen(false);
        toast.success("Group created successfully", {
          style: {
            background: "rgb(39 39 42)",
            color: "white",
          },
        });
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
  return (
    <>
      <Toaster />
      <div className="w-80 px-4 py-2 border-2 border-zinc-700 bg-zinc-900/25 backdrop-blur-md rounded-lg mx-auto">
        <h1 className="font-semibold">New Group</h1>
        <Form className="pt-3">
          <div className="flex flex-col gap-y-2">
            <Label text="Name" id="name" className="ml-2" />
            <Input
              id="name"
              placeholder="Name"
              minLength={4}
              className="rounded-3xl border border-zinc-600"
              inputRef={grpNameRef}
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label text="Members Name" id="member" className="ml-2" />
            <Input
              id="member"
              placeholder="ex. john1234, doe65789"
              className="rounded-3xl border border-zinc-600"
              inputRef={grpMemberRef}
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label text="Group Icon" id="imgUrl" className="ml-2" />
            <Input
              id="imgUrl"
              placeholder="imgUrl"
              className="rounded-3xl border border-zinc-600"
              inputRef={grpIconRef}
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label text="Bio" id="bio" className="ml-2" />
            <Input
              id="bio"
              placeholder="bio"
              className="rounded-3xl border border-zinc-600"
              inputRef={grpBioRef}
            />
          </div>
        </Form>
        <div className="flex flex-row pb-2 gap-x-2">
          <Button
            text="Create"
            variant="primary"
            className="rounded-3xl flex-1"
            onClick={() => handleSubmit()}
          />
          <Button
            text="Cancel"
            variant="secondary"
            className="rounded-3xl flex-1"
            onClick={() => setIsModelOpen(false)}
          />
        </div>
      </div>
    </>
  );
}
