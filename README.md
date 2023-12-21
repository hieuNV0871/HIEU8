# HIEU8 - website bán hàng sử dụng MEVN stack
<br>
<b>Cài đặt và chạy chương trình</b>
<br>
> từ thư mục gốc:
 >> cd server
 >> open terminal
 >> npm install || yarn add
 >> npm start
 <br>
> từ thư mục gốc:
 >> cd client
 >> open terminal
 >> npm install || yarn add
 >> npm run dev
 <br>
> từ thư mục gốc:
 >> cd adminPanel
 >> open terminal
 >> npm install || yarn add
 >> npm run dev 
<br>
<b>Chức năng chính</b>
<br>
> giao diện khách hàng sử dụng nuxt3, nuxtUI, tailwindcss
<br>
>> authen author với jwt, google login
>> active account với mail service sử dụng nodemailer
>> quản lý trạng thái của giỏ hàng, user sử dụng pinia
>> valid form sử dụng nuxt ui, yup
>> đặt hàng, thanh toán sử dụng vnpay sanbox
>> sử dụng websocket = socketio gửi thông báo đặt hàng
<br>
> giao diện admin sử dụng vite + vue3 compositions api, ant-design vue, chartjs, tailwindcss
<br>
>> quản lý sản phẩm theo SKU
>> quản lý tài khoản, phân quyền
>> quản lý đơn hàng (khách đặt, admin lên đơn tại store)
>> thống kê

