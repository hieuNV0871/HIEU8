import request from ".";

export async function getAllNews(params) {
    return request(`/news/get_all`, {
        method: "GET",
        params
    });
}
export async function getAllPublished() {
    return request(`/news/get_all_published`, {
        method: "GET",
    });
}
export async function createNews(data) {
    return request(`/news/create`, {
        method: "POST",
        data
    });
}
export async function updateNews(id, data) {
    return request(`/news/update/${id}`, {
        method: "PATCH",
        data
    });
}
export async function deleteNews(id, data) {
    return request(`/news/delete/${id}`, {
        method: "DELETE",
        data
    });
}