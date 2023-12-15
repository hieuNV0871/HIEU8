import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import request from "../utils/request";
import { ref, computed } from "vue";


export const cartStore = defineStore("cart", () => {
  
    const carts = useLocalStorage("Cart", {})
    const itemsToCheckout = useLocalStorage("itemsToCheckout", [])
// this one is synced
// const itemsToCheckout = ref(useLocalStorage('itemsToCheckout', []))
// local copy of the value, not synced to localStorage
// const showItemsToCheckout = ref(toRaw(itemsToCheckout))


    let errorMessage = ref("");

    const setItemToCheckout = (item)=>{
      itemsToCheckout.value = item
    }
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
    setItemToCheckout,
    itemsToCheckout,
    // showItemsToCheckout,
    errorMessage
  }
},
{
  persist: {
    
    storage: persistedState.localStorage,

    properties: ["itemsToCheckout"],
  },
});
