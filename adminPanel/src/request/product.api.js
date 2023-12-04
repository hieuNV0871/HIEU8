import request from ".";

export async function createProduct(data) {
    return request(`product/create`, {
        method: "POST",
        data
    });
}

export async function getAllProduct(params) {
    return request(`product/getAllProduct`, {
        method: "GET",
        params
    });
}

export async function getAllColor() {
    return request(`product/getAllColor`, {
        method: "GET"
    });
}

export async function getAllSize() {
    return request(`product/getAllSize`, {
        method: "GET"
    });
}

export async function getProductById(id) {
    return request(`product/getProductById/${id}`, {
        method: "GET"
    });
}

export async function updateProduct(id, data) {
    return request(`product/update/${id}`, {
        method: "PATCH",
        data
    });
}

export async function deleteProduct(id) {
    return request(`product/delete/${id}`, {
        method: "DELETE"
    });
}

