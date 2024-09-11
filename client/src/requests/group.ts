/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export async function createGroup(
  name: string,
  bio: string,
  members: string,
  createdBy: string,
  groupIcon: string
) {
  try {
    const res = await axios.post("http://localhost:3000/group/new", {
      name,
      members,
      bio,
      createdBy,
      groupIcon,
    });
    return res;
  } catch (error: any) {
    console.error(error);
    return error.response;
  }
}

export async function getGroups(ids: string[]) {
  const res = await axios.post("http://localhost:3000/group/all", { ids });
  return res;
}

export async function getGroupById(id: string) {
  const res = await axios.get("http://localhost:3000/group/" + id);
  return res;
}

export async function sendMessage(
  groupId: string,
  sender: string,
  senderProfile: string,
  text: string
) {
  const res = await axios.post("http://localhost:3000/group/messages/send", {
    groupId,
    sender,
    senderProfile,
    text,
  });
  return res;
}

export async function getMessages(groupId: string) {
  const res = await axios.post("http://localhost:3000/group/messages/all", {
    groupId,
  });
  return res;
}

export async function addMember(id: string, name: string) {
  try {
    const res = await axios.post("http://localhost:3000/group/addNewMember", {
      id,
      name,
    });
    return res;
  } catch (error: any) {
    console.error(error);
    return error.response;
  }
}

export async function removeMember(id: string, name: string, userId: string) {
  try {
    const res = await axios.post("http://localhost:3000/group/removeMember", {
      id,
      name,
      userId,
    });
    return res;
  } catch (error: any) {
    console.error(error);
    return error.response;
  }
}

export async function exitGroup(groupId: string, userId: string) {
  try {
    const res = await axios.post("http://localhost:3000/group/exitGroup", {
      groupId,
      userId,
    });
    return res;
  } catch (error: any) {
    console.error(error);
    return error.response;
  }
}

export async function changeGroupName(groupId: string, name: string) {
  try {
    const res = await axios.post("http://localhost:3000/group/changeName", {
      groupId,
      name,
    });
    return res;
  } catch (error: any) {
    console.error(error);
    return error.response;
  }
}

export async function changeGroupBio(groupId: string, bio: string) {
  try {
    const res = await axios.post("http://localhost:3000/group/changeBio", {
      groupId,
      bio,
    });
    return res;
  } catch (error: any) {
    console.error(error);
    return error.response;
  }
}

export async function changeGroupProfile(groupId: string, imgURL: string) {
  try {
    const res = await axios.post("http://localhost:3000/group/changeProfile", {
      groupId,
      imgURL,
    });
    return res;
  } catch (error: any) {
    console.error(error);
    return error.response;
  }
}

export async function clearChat(groupId: string) {
  try {
    const res = await axios.post("http://localhost:3000/group/clear", {
      groupId,
    });
    return res;
  } catch (error: any) {
    console.error(error);
    return error.response;
  }
}

export async function deleteGroup(groupId: string) {
  try {
    const res = await axios.post("http://localhost:3000/group/delete", {
      groupId,
    });
    return res;
  } catch (error: any) {
    console.error(error);
    return error.response;
  }
}
