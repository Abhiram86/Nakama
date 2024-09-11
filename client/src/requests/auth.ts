/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export const register = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const res = await axios.post("http://localhost:3000/auth/register", {
      username,
      email,
      password,
    });
    return res;
  } catch (error: any) {
    console.error(error);
    return error.response;
  }
};

export const login = async (identifier: string, password: string) => {
  try {
    const res = await axios.post("http://localhost:3000/auth/login", {
      identifier,
      password,
    });
    return res;
  } catch (error: any) {
    console.error(error);
    return error.response;
  }
};
