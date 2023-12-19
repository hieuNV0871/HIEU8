import request from ".";

export async function getRevenue(params) {
    return request(`statistics/revenue`, {
        method: "GET",
        params
    });
}

export async function getHotSellingProduct() {
    return request(`statistics/hotSellingProduct`, {
        method: "GET",
    });
}
