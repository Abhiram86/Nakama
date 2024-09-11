import Button from "../ui/Button";
import { Form, Input, Label } from "../ui/form";
import { useNavigate } from "react-router-dom";
import { login } from "../requests/auth";
import { useEffect, useRef } from "react";
import { useContext } from "react";
import { UserContext } from "../context/UserProvider";
import { avatars } from "../constants/avatars";
import toast, { Toaster } from "react-hot-toast";

export default function Login() {
  const router = useNavigate();
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("UserContext not found");
  }
  const { user, setUser } = context;
  const identifierRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement> | TouchEvent
  ) => {
    e.preventDefault();
    if (identifierRef.current && passwordRef.current) {
      try {
        console.log(identifierRef.current.value, passwordRef.current.value);
        const res = await login(
          identifierRef.current.value,
          passwordRef.current.value
        );
        console.log(res);
        if (res.status === 200) {
          setUser({
            id: res.data.id,
            name: res.data.name,
            email: res.data.email,
            groups: res.data.groups,
            profile: res.data.profile,
          });
          localStorage.setItem("user", JSON.stringify(res.data));
          router("/");
        } else {
          toast.error(res.data.msg, {
            style: {
              background: "rgb(39, 39, 42)",
              color: "rgb(224, 224, 224)",
            },
          });
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  useEffect(() => {
    if (user) {
      router("/");
    }
  }, []);
  return (
    <>
      <Toaster />
      <Form
        onSubmit={handleSubmit}
        className="w-80 shadow-emerald-900 sm:shadow-none shadow-sm sm:w-auto mt-20 mx-auto border-2 sm:border-0 border-zinc-700 rounded-lg"
      >
        <div className="flex flex-col gap-y-1">
          <Label text="Username / Email" id="identifier" />
          <Input
            type="text"
            inputRef={identifierRef}
            placeholder="ex. john or john@example.com"
            id="identifier"
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <Label text="Password" id="Password" />
          <Input
            type="password"
            placeholder="password"
            id="Password"
            inputRef={passwordRef}
          />
        </div>
        <div className="flex flex-col py-2">
          <Button text="Login" type="submit" variant="primary" />
        </div>
      </Form>
      <div className="flex flex-row justify-center items-center mt-4 gap-x-1">
        <p className="text-zinc-100">Don't have an account?</p>
        <Button
          onClick={() => router("/auth/?type=register")}
          text="Register"
          variant="secondary"
        />
      </div>
      <div className="mt-4 flex flex-row gap-x-3 sm:gap-x-8 w-full justify-center">
        {avatars.map((avatar, index) => (
          <img
            src={avatar}
            alt="avatar"
            key={index}
            className="w-10 h-10 sm:w-14 sm:h-14 cursor-pointer object-cover rounded-full"
          />
        ))}
      </div>
    </>
  );
}
