/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export async function editUser(id: string, name: string, imgURL: string) {
  try {
    const res = await axios.patch("http://localhost:3000/user/edit", {
      id,
      name,
      imgURL,
    });
    return res;
  } catch (error: any) {
    console.error(error);
    return error.response;
  }
}

export async function getUsers(id: string) {
  try {
    const res = axios.get("http://localhost:3000/group/" + id + "/members");
    return res;
  } catch (error: any) {
    console.error(error);
    return error.response;
  }
}

export async function getAllGroups(userId: string) {
  try {
    const res = await axios.post("http://localhost:3000/user/allGroups", {
      id: userId,
    });
    return res;
  } catch (error: any) {
    console.error(error);
    return error.response;
  }
}
