import request from ".";

export async function getAll(params) {
    return request(`orders/getAll`, {
        method: "GET",
        params
    });
}
export async function updateStatus(data) {
    return request(`orders/update_orders_status`, {
        method: "PATCH",
        data
    });
}