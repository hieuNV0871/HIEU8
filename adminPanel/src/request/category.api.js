import request from ".";

export async function getAllCategory(params) {
  return request(`category/get_all_parent`, {
    method: "GET",
    params
  });
}

export async function createCategory(data) {
  return request(`category/create`, {
    method: "POST",
    data,
  });
}

export async function updateCategory(id, data) {
  return request(`category/update/${id}`, {
    method: "PATCH",
    data,
  });
}

export async function deleteCategory(id) {
  return request(`category/delete/${id}`, {
    method: "DELETE"
  });
}