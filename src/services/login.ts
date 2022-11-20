import API from "@/utils/request";

export function getUsers(payload: any) {
  debugger;
  return API({
    url: "/api/users",
    method: "get",
    params: payload,
  });
}
