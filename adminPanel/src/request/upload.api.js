import request from ".";

export async function uploadImage(data) {
  return request(`upload/upload_avatar`, {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data,
  });
}

export async function uploadImages(data) {
  return request(`upload/upload_images`, {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data,
  });
}
