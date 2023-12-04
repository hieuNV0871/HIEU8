import request from ".";

export async function getMe(params) {
    return request(`user/info`, {
        method: "GET",
        params
    });
}
export async function getAll(params) {
    return request(`user/all_user`, {
        method: "GET",
        params
    });
}
export async function createUser(data) {
    return request(`user/create`, {
        method: "POST",
        data
    });
}
export async function updateUser(id, data) {
    return request(`user/update_permission/${id}`, {
        method: "PATCH",
        data
    });
}
export async function deleteUser(id) {
    return request(`user/delete/${id}`, {
        method: "DELETE",
    });
}