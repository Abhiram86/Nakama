import { useRef } from "react";
import Button from "../ui/Button";
import { Form, Input, Label } from "../ui/form";
import { useNavigate } from "react-router-dom";
import { register } from "../requests/auth";
import { avatars } from "../constants/avatars";
import toast, { Toaster } from "react-hot-toast";

export default function Register() {
  const router = useNavigate();
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // console.log(emailRef.current);
    e.preventDefault();
    if (usernameRef.current && emailRef.current && passwordRef.current) {
      try {
        const res = await register(
          usernameRef.current.value,
          emailRef.current.value,
          passwordRef.current.value
        );
        // console.log(res);
        if (res.status === 200) {
          router("/auth/?type=login");
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
  return (
    <>
      <Toaster />
      <Form
        onSubmit={handleSubmit}
        className="w-80 sm:w-auto shadow-emerald-900 shadow-sm sm:shadow-none mt-20 mx-auto border-2 sm:border-0 border-zinc-700 rounded-lg"
      >
        <div className="flex flex-col gap-y-1">
          <Label text="Username" id="username" />
          <Input
            placeholder="ex. john"
            id="username"
            minLength={8}
            inputRef={usernameRef}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <Label text="Email" id="email" />
          <Input
            type="email"
            placeholder="ex. john@example.com"
            id="email"
            minLength={8}
            inputRef={emailRef}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <Label text="Password" id="Password" />
          <Input
            type="password"
            placeholder="ex. john@123"
            id="Password"
            minLength={8}
            inputRef={passwordRef}
          />
        </div>
        <div className="flex flex-col py-2">
          <Button text="Register" type="submit" variant="primary" />
        </div>
      </Form>
      <div className="flex flex-row justify-center items-center mt-4 gap-x-1">
        <p className="text-zinc-100">Already have an account?</p>
        <Button
          onClick={() => router("/auth/?type=login")}
          text="Login"
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
