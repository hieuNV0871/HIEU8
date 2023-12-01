import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import request from "../utils/request";

export const cartStore = defineStore("cart", () => {
  
    const carts = useLocalStorage("Cart", [])
    let errorMessage = ref("");
    const addToCart = async (cart) => {
      errorMessage.value = ""
      try {
        const res = await request.post("cart/add_to_cart", cart )
        carts.value = res.data.data
        
      } catch (error) {
        errorMessage.value = error.response.data.error;
      }
    }
    const updateCartItem = async (cart) => {
      
      await request.patch(`cart/update_cart_item`, cart)
    }

    const removeCartItem = async (id) => {
      console.log(id);
      await request.delete(`cart/delete_from_cart/${id}`)
    }
    const getCarts = async() => {
      const res = await request.get("cart/get_cart_item")
      carts.value = res.data.data
    }
 
  return {
    carts,
    addToCart,
    getCarts,
    updateCartItem,
    removeCartItem,
    errorMessage
  };
});
