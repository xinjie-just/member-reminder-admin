import request from "@/utils/request";

export function login(data) {
  console.log("loginData", data);
  return request({
    url: "/api/user/phoneLogin",
    method: "post",
    data
  });
}

export function getInfo(token) {
  return request({
    url: "/vue-admin-template/user/info",
    method: "get",
    params: { token }
  });
}

export function logout() {
  return request({
    url: "/api/user/logout",
    method: "get"
  });
}
