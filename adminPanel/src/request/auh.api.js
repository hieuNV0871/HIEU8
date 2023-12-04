import request from ".";

export async function signIn(data) {
  return request(`auth/signin`, {
    method: "POST",
    data
  });
}
