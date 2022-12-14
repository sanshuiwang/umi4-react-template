import API from "@/utils/request";

export function getUsers(payload: object) {
  return API({
    url: "/api/users/1",
    method: "get",
    params: payload,
  });
}
