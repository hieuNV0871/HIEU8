import request from ".";

export async function getAll(params) {
    return request(`/brand/get_all`, {
        method: "GET",
        params
    });
}
export async function createBrand(data) {
    return request(`/brand/create`, {
        method: "POST",
        data
    });
}
export async function updateBrand(id, data) {
    return request(`/brand/update/${id}`, {
        method: "PATCH",
        data
    });
}
export async function deleteBrand(id, data) {
    return request(`/brand/delete/${id}`, {
        method: "DELETE",
        data
    });
}