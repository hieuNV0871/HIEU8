import request from ".";

export async function getAllNotifications(params) {
  return request(`notification/get_all`, {
    method: "GET",
    params
  });
}

export async function readNotification(id) {
    return request(`notification/readNoti/${id}`, {
        method: "PATCH",
    });
}
