import Button from "../ui/Button";
import { Form, Input, Label } from "../ui/form";
import { editUser } from "../requests/user";
import { useRef } from "react";
import { User } from "../context/UserProvider";

export default function PicChangeModal({
  user,
  setEditBoxOpen,
}: {
  user: User;
  setEditBoxOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const nameRef = useRef<HTMLInputElement | null>(null);
  const imgRef = useRef<HTMLInputElement | null>(null);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (nameRef.current && imgRef.current) {
      try {
        const res = await editUser(
          user.id,
          nameRef.current.value,
          imgRef.current.value
        );
        if (res.status === 200) {
          setEditBoxOpen(false);
          user.profile =
            imgRef.current.value.length > 0
              ? imgRef.current.value
              : user.profile;
          user.name =
            nameRef.current.value.length > 0
              ? nameRef.current.value
              : user.name;
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          console.log("Error");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  return (
    <div className="w-80 mx-auto  bg-zinc-900/15 backdrop-blur-lg border border-zinc-700 rounded-lg">
      <Form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-y-1">
          <Label id="accName" text="Enter new Name" />
          <Input
            id="accName"
            placeholder="Enter new name or leave"
            inputRef={nameRef}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <Label id="pic" text="Enter the URL for a img" />
          <Input id="pic" placeholder="Enter URL here" inputRef={imgRef} />
        </div>
        <div className="flex flex-row gap-x-2 mt-2">
          <Button
            text="Save"
            type="submit"
            variant="primary"
            className="flex-1"
          />
          <Button
            text="Cancel"
            variant="secondary"
            className="flex-1"
            onClick={() => setEditBoxOpen(false)}
          />
        </div>
      </Form>
    </div>
  );
}
