[![Nuxt banner](./.github/assets/banner.svg)](https://nuxt.com)

# HIEU8 - website bán hàng sử dụng MEVN stack

<p>
  <a href="https://nuxt.com"><img src="https://img.shields.io/badge/Nuxt%20Docs-18181B?logo=nuxt.js" alt="NuxtJS"></a>
<a href="https://vuejs.com"><img src="https://img.shields.io/badge/Vue%20Docs-18181B?logo=vue.js" alt="VueJS"></a>
<a href="https://expressjs.com"><img src="https://img.shields.io/badge/ExpressJS%20Docs-18181B?logo=express" alt="ExpressJS"></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwindcss%20Docs-18181B?logo=tailwindcss" alt="Tailwindcss"></a>
</p>

## Getting Started
Sử dụng câu lệnh dưới để cài đặt source code về máy.

```bash
git clone https://github.com/hieuNV0871/HIEU8.git
```
## Install package 
Sử dụng trình quản lý gói (package manager) như npm || yarn || pnpm 
```bash
cd <folder-name>
npm install
```

## Run app 
Thư mục "client" && "adminPanel"
```bash
npm run dev
```
thư mục "server"
```bash
npm start
```
## Features
<ul>
    <h3>Giao diện khách hàng sử dụng Nuxt3, Nuxt UI, Tailwind CSS</h3>
    <li>Authentication với JWT, đăng nhập bằng Google</li>
    <li>Active account qua email sử dụng Nodemailer</li>
    <li>Quản lý trạng thái giỏ hàng và người dùng sử dụng Pinia</li>
    <li>Validate form sử dụng Nuxt UI và Yup</li>
    <li>Đặt hàng và thanh toán với VNPAY Sandbox</li>
    <li>Sử dụng WebSocket (Socket.io) để gửi thông báo đặt hàng</li>
</ul>
<ul>
    <h3>Giao diện admin sử dụng vite + vue3 compositions api, ant-design vue, chartjs, tailwindcss</h3>
    <li>Quản lý sản phẩm theo SKU</li>
    <li>Quản lý tài khoản, phân quyền</li>
    <li>Quản lý đơn hàng (khách đặt, admin lên đơn tại store)</li>
    <li>Thống kê</li>
</ul>