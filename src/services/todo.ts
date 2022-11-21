import API from "@/utils/request";

export function getTodos(payload: object) {
  return API({
    url: "/api/todos",
    method: "get",
    params: payload,
  });
}
