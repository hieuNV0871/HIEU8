<template>
    <div>
        <h3 @click="()=>router.push('/order')" class="underline cursor-pointer">Danh sách đơn hàng</h3>
        <div class="flex justify-center">
    <div class="max-w-[700px]">
      <a-form
        :model="formState"
        name="basic"
        hideRequiredMark
        layout="vertical"
        autocomplete="off"
        @finish="onFinish"
      >
        <a-form-item
          label="Name"
          name="name"
          :rules="[{ required: true, message: 'Please input your Name!' }]"
        >
          <a-input size="large" v-model:value="formState.name" />
        </a-form-item>
        <a-form-item
          label="Address"
          name="address"
          :rules="[{ required: true, message: 'Please input your address!' }]"
        >
          <a-input size="large" v-model:value="formState.address" />
        </a-form-item>
        <a-form-item
          label="Phone"
          name="phone"
          :rules="[{ required: true, message: 'Please input your phone!' }]"
        >
          <a-input size="large" v-model:value="formState.phone" />
        </a-form-item>
        <!-- <a-form-item
          label="total Amount"
          name="totalPrice"
          :rules="[{ required: true, message: 'Please input your Price!' }]"
        > -->
          <!-- <a-input-number :min="1" size="large" v-model:value="formState.totalPrice" /> -->
        <!-- </a-form-item> -->

        <div class="mb-[5px]">Variant (Nhập sku code)</div>
        <div class="flex flex-col">
          <a-space
            v-for="(variant, index) in formState.variants"
            :key="variant.key"
          >
            <a-form-item
              :name="['variants', index, 'skuCode']"
              :rules="{
                required: true,
                message: 'variant can not be null',
                trigger: 'change',
              }"
            >
            <a-input size="large" v-model:value="variant.skuCode" />
            </a-form-item>
            <a-form-item
              :name="['variants', index, 'quantity']"
              :rules="{
                required: true,
                message: 'quantity can not be null',
                trigger: 'change',
              }"
            >
              <a-input-number
                v-model:value="variant.quantity"
                size="large"
                placeholder="quantity"
                :min="1"
              />
            </a-form-item>
            <MinusCircleOutlined
              v-if="index > 0"
              class="dynamic-delete-button"
              @click="removeVariant(variant.key)"
            />
          </a-space>
        </div>
        <a-form-item>
          <a-button size="large" @click="addVariant"> + variant </a-button>
        </a-form-item>
        {{ skuCodes }}
        {{ totalAmount }}
        <span v-if="errMes">{{ errMes }}</span>
        <span v-if="successMes">{{ successMes }}</span>

        <a-form-item>
          <a-button type="primary" html-type="submit">Add order</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
    </div>
</template>

<script setup>
    import { useRouter } from "vue-router";
    import { PlusOutlined, LoadingOutlined, MinusCircleOutlined } from "@ant-design/icons-vue";

    import {ref, watch} from 'vue'
    import request from "../request";
    const errMes = ref('')
    const successMes = ref('')

    const totalAmount = ref(0)
    const router = useRouter()
    const formState = ref({
        name: "",
        address: "",
        phone: "",
        variants: [
            {
            skuCode: null,
            quantity: 1,
            key: Date.now(),
            },
        ],
        })
        const skuCodes = ref([])
        const addVariant = () => {
  formState.value.variants.push({
          skuCode: "",
          quantity: 1,
          key: Date.now(),
        });
      }

        const removeVariant = (key) => {
          formState.value.variants = formState.value.variants.filter(
            (e) => e.key !== key
          )
        }
    // const getOrdersItems = async ()=>{

    //     const res = await request.get("product/getProductBySku")
        
    // }

    const  onFinish = async (values)=>{
      errMes.value=''
      successMes.value = ''
      let ordersItems = []
      formState.value.variants.forEach((variant) => {
      skuCodes.value.push(
        {
          skuCode: variant.skuCode,
          quantity: variant.quantity
        }

      );
    });
    try {
        let reqSku = [...skuCodes.value];
        let res = await request.post(`product/getProductBySku`, { reqSku });
        const tmp = res.data.data
        tmp.map(t=>{
          ordersItems.push({
            product: t.product,
            variant: t.variant,
            quantity: t.quantity
          })
        })
        totalAmount.value = res.data.total
        const data = {
        name: values.name,
        user: null,
        address: values.address,
        phone: values.phone,
        paymentMethod: "TAI-CUA-HANG",
        status: 3,
        totalPrice: totalAmount.value,
        ordersItems: ordersItems
      }
      console.log(data);
      skuCodes.value = []

    const resOrder = await request.post("orders/create", data)
    if(resOrder.data.data){
      successMes.value = "them thanh cong"
      router.push('/order')
    }
    } catch (error) {
        // Xử lý thông báo lỗi từ server
        if (error.response) {
            // Lỗi từ phía server với mã trạng thái không phải 2xx
            console.error("Server error:", error.response.data);
            errMes.value = error.response.data
            skuCodes.value = []
        } else if (error.request) {
            // Lỗi không có phản hồi từ server
            console.error("No response from server:", error.request);
        } else {
            // Lỗi khác
            console.error("Error:", error.message);
        }
    }
    



    }
    
</script>

<style >

</style>