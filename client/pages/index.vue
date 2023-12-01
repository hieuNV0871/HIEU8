<template>
  <MainLayout>
    <!--  -->
    <div class="">
      <Swiper 
        :modules="[SwiperAutoplay, SwiperEffectCreative]" 
        :slides-per-view="1" :loop="true" :effect="'creative'"
        :autoplay="{
          delay: 4000,
          disableOnInteraction: true, 
        }" :creative-effect="{
        prev: {
          shadow: false,
          translate: ['-20%', 0, -1],
        },
        next: {
          translate: ['100%', 0, 0],
        },
        }"
      >
        <SwiperSlide v-for="slide in slideItems" :key="slide.src">
            <ULink :to="slide.to">
              <img :src="slide.src" :alt="slide.alt" class="w-full h-[500px]">
            </ULink>
        </SwiperSlide>
      </Swiper>
    </div>
    <!--  -->
    <UContainer class="my-20">
      <div class="flex justify-around items-center">
          <div v-for="(box, index) in boxItems" :key="index" class="flex items-center shadow-xl mx-4 p-4 rounded-2xl cursor-pointer transition-transform duration-500 ease-linear hover:-translate-y-5" >
             <div class='px-3 py-3 flex items-center'>
                 <UIcon :name="box.icon" color="red" class="text-xl"/>
              </div>
              <div class=''>
                <div class="font-semibold text-lg">{{ box.title }}</div>
                <div class="text-sm">{{ box.description }}</div>
              </div>
          </div>
      </div>
    </UContainer>

    <UContainer class="my-20">
      <h2 class="font-semibold text-2xl text-center text-gray-500 mb-5">Sản phẩm mới</h2>
      <UTabs v-if="items.length" :items="items" class="w-full">
        <template #item="{item}">
          <!-- <div class="flex gap-2 relative  p-5"> -->
            <swiper
              :slides-per-view="4"
              :space-between="30"
            >
            <swiper-slide v-for="(product, index) in item.content" :key="index">
              <UCard class="hover:shadow-2xl flex flex-col justify-between">
                <div class="py-0">
                  <div>
                    <ULink :to="`/product/${product.id}`">
                      <img class="" :src="product.src" alt="">
                    </ULink>
                  </div>
                  <UDivider label="hieunv"/>
                  <div class="text-center">
                      <h2 class="font-semibold text-xl">{{ product.name }}</h2>
                      <span class="text-slate-400">{{ product.price.toLocaleString() }} đ</span>
                  </div>
                </div>
                <template #footer>
                  <div class="flex gap-x-3 justify-center">
                    <UButton class="w-[100px] flex justify-center" truncate color="black" variant="solid" label="Mua ngay"></UButton>
                    <UTooltip text="Thêm vào giỏ hàng" :popper="{ arrow: true }">
                      <UButton class="w-[100px]" truncate color="black" variant="solid" label="Thêm vào giỏ hàng"></UButton>
                    </UTooltip>
                  </div>
                </template>
            </UCard>
            </swiper-slide>
            </swiper>
          <!-- </div> -->
        </template>
      </UTabs>
      <div class="flex justify-center items-center my-14">
        <UButton label="Xem tất cả" color="gray" to="/collections">
          <template #trailing>
            <UIcon name="i-heroicons-arrow-right-20-solid" />
          </template>
        </UButton>
      </div>

    </UContainer>

    <!-- <Swiper 
        :modules="[SwiperAutoplay, SwiperEffectCreative]" 
        :slides-per-view="4" :loop="false" :effect="'creative'"
        :pagination="{clickable:true}"
        :creative-effect="{
        prev: {
          shadow: false,
          translate: ['-100%', 0, -1],
        },
        next: {
          translate: ['100%', 0, 0],
        },
        }"
      >
        <SwiperSlide v-for="(product, index) in products" :key="index">
          <UCard class="hover:shadow-2xl">
            <div class="py-0">
              <div>
                <ULink to="/">
                  <img class="" src="https://product.hstatic.net/1000096703/product/2_c066ad1667ad4e729bb6325b5d5a04af_grande.jpg" alt="">
                </ULink>
              </div>
              <UDivider label="hieunv"/>
              <div class="text-center">
                  <h2 class="font-semibold text-xl">{{ product.name }}</h2>
                  <span class="text-slate-400">{{ product.price }} đ</span>
              </div>
            </div>
            <template #footer>
              <div class="flex gap-x-3">
                <UButton class="w-[100px] flex justify-center" truncate color="black" variant="solid" label="Mua ngay"></UButton>
                <UButton class="w-[100px]" truncate color="black" variant="solid" label="Thêm vào giỏ hàng"></UButton>
              </div>
            </template>
          </UCard>
        </SwiperSlide>
    </Swiper> -->    

  </MainLayout>
</template>

<script setup>
import MainLayout from '../layouts/MainLayout.vue';
import request from '~/utils/request';
useHead(() => {
  return {
    title: 'NVH - Trang chủ',
  };
});

const slideItems = ref([
  {
    src: "https://wallpapercave.com/wp/wp4906006.jpg",
    alt: "slide",
    to:"#"
  },
  {
    src: "https://wallpapercave.com/wp/wp2665219.jpg",
    alt: "slide",
    to:"#"
  },  {
    src: "https://jooinn.com/images/beauty-of-nature-24.jpg",
    alt: "slide",
    to:"#"
  },
])

const boxItems = ref([
  {
    icon: "i-heroicons-shopping-cart",
    title: "Miễn phí vận chuyển",
    description: "mien phi van chuyen voi don hang >500k"
  },{
    icon: "i-heroicons-credit-card-20-solid",
    title: "Thanh toán trực tuyến",
    description: "Thanh toan de dang thong qua nhieu ngan hang"
  },{
    icon: "i-heroicons-wrench-screwdriver-20-solid",
    title: "Đổi trả dễ dàng",
    description: "Doi do tai tat ca cac cua hang tren toan quoc"
  },{
    icon: "i-heroicons-shield-check-20-solid",
    title: "Khách hàng VIP",
    description: "Uu dai dac biet danh cho cac khach hang than thiet"
  },
])

const items = ref([]);

const getParentCategory = async (limit) => {
  try {
    const res = await request.get(`category/get_all_parent?limit=${limit}`);
    const parentCategories = res.data.data;
    parentCategories.forEach((parentCategory) => {
      items.value.push({
        label: parentCategory.name,
        icon: 'i-heroicons-information-circle',
        content: [],
      });
    });
    
    await Promise.all(
      parentCategories.map(async (parentCategory, index) => {
        // Fetch products for the current category
        const productsRes = await request.get(
          `product/getProductByParentCategory/${parentCategory._id}`
        );
        const products = productsRes.data.data;
        
        // Populate the content property with the fetched products
        items.value[index].content = products.map((product) => ({
          id: product._id,
          name: product.name,
          price: product.price,
          src: product.images[0].src
        }));
      })
      );
    } catch (error) {
      console.error(error);
    }
  };
  
  
getParentCategory(3);


</script>
