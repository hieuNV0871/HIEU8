import request from ".";

export async function getAll(params) {
    return request(`/collection/get_all`, {
        method: "GET",
        params
    });
}
export async function getAllCollection() {
    return request(`/collection/get_all`, {
        method: "GET",
    });
}
export async function createCollection(data) {
    return request(`/collection/create`, {
        method: "POST",
        data
    });
}
export async function updateCollection(id, data) {
    return request(`/collection/update/${id}`, {
        method: "PATCH",
        data
    });
}
export async function deleteCollection(id, data) {
    return request(`/collection/delete/${id}`, {
        method: "DELETE",
        data
    });
}