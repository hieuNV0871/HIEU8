const Orders = require("../models/Orders");
const Product = require("../models/Product");

const ordersController = {


  createOrders: async (req, res) => {
    try {
      const { order, name, userId, address, phone, paymentMethod, totalPrice } =
        req.body;
      if (order.length < 1)
        return res.status(400).json({ error: "Giỏ hàng của bạn đang trống" });
      if (!address)
        return res
          .status(400)
          .json({ error: "Vui lòng cập nhật địa chỉ giao hàng" });
      const newOrders = new Orders({
        userId,
        name,
        order,
        address,
        phone,
        paymentMethod,
        totalPrice,
      });
      const user = await User.findById(userId)

      for (let i = 0; i < user.cart.length; i++) {
        for (let j = 0; j < order.length; j++) {
          if (user.cart[i].productId === order[j].productId) {
            user.cart[i].quantity = user.cart[i].quantity - order[j].quantity;
          }
        }
      }
      let cartTmp = [];
      for (let index = 0; index < user.cart.length; index++) {
        if (user.cart[index].quantity > 0) {
          cartTmp.push(user.cart[index]);
        }
      }
      const Orders = await newOrders.save();

      if (Orders) {
        order.map((item) => {
          sold(item.productId, item.color, item.size, item.quantity);

        });
        await User.findByIdAndUpdate({ _id: user._id }, { cart: cartTmp });
      } else {
        return res.status(400).json({ error: "co loi xay ra" });
      }
      res
        .status(200)
        .json({ success: "Tạo đơn hàng thành công", data: newOrders });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  //for payment middleware check
  updateStatusOrders: async (req, res) => {
    try {
      const { status } = req.body;
      const _id = req.params.id;
      let updateOrders
      if (false) {
         updateOrders = await Orders.findByIdAndUpdate({ _id }, { status: 1 });
      }
      res
        .status(200)
        .json({ success: "Cập nhật đơn hàng thành công", data: updateOrders });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // admin
  updateOrders: async (req, res) => {
    try {
      const {
        order,
        name,
        status,
        user,
        address,
        phone,
        paymentMethods,
        totalPrice,
      } = req.body;
      if (order.length < 1)
        return res.status(400).json({ error: "Giỏ hàng của bạn đang trống" });
      if (!address)
        return res
          .status(400)
          .json({ error: "Vui lòng cập nhật địa chỉ giao hàng" });

      for (let i = 0; i < user.cart.length; i++) {
        for (let j = 0; j < order.length; j++) {
          if (user.cart[i]._id === order[j]._id) {
            user.cart[i].quantity = user.cart[i].quantity - order[j].quantity;
          }
        }
      }
      let cartTmp = [];
      for (let index = 0; index < user.cart.length; index++) {
        if (user.cart[index].quantity > 0) {
          cartTmp.push(user.cart[index]);
        }
      }
      const _id = req.params.id;
      const Orders = await Orders.findByIdAndUpdate(
        { _id },
        {
          order,
          name,
          user,
          status,
          address,
          phone,
          paymentMethods,
          totalPrice,
        }
      );

      if (Orders) {
        order.map((item) => {
          sold(item._id, item.color, item.size, item.quantity);
        });
        await User.findByIdAndUpdate({ _id: user._id }, { cart: cartTmp });
      } else {
        return res.status(400).json({ error: "co loi xay ra" });
      }
      res
        .status(200)
        .json({ success: "Cập nhật đơn hàng thành công", data: newOrders });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  //    de day mai lam tiep ^^
  updatePersonalOrders: async (req, res) => {
    try {
      const { order, name, user, address, phone, paymentMethods, totalPrice } =
        req.body;
      if (order.length < 1)
        return res.status(400).json({ error: "Giỏ hàng của bạn đang trống" });
      if (!address)
        return res
          .status(400)
          .json({ error: "Vui lòng cập nhật địa chỉ giao hàng" });

      for (let i = 0; i < user.cart.length; i++) {
        for (let j = 0; j < order.length; j++) {
          if (user.cart[i]._id === order[j]._id) {
            user.cart[i].quantity = user.cart[i].quantity - order[j].quantity;
          }
        }
      }
      let cartTmp = [];
      for (let index = 0; index < user.cart.length; index++) {
        if (user.cart[index].quantity > 0) {
          cartTmp.push(user.cart[index]);
        }
      }
      const _id = req.params.id;
      const Orders = await Orders.findByIdAndUpdate(
        { _id },
        {
          order,
          name,
          user,
          address,
          phone,
          paymentMethods,
          totalPrice,
        }
      );

      if (Orders) {
        order.map((item) => {
          sold(item._id, item.quantity);
        });
        await User.findByIdAndUpdate({ _id: user._id }, { cart: cartTmp });
      } else {
        return res.status(400).json({ error: "co loi xay ra" });
      }
      res
        .status(200)
        .json({ success: "Cập nhật đơn hàng thành công", data: newOrders });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteOneOrders: async (req, res) => {
    try {
      const id = req.params.id;
      const Orders = await Orders.findById(id);
      if (!Orders)
        return res
          .status(404)
          .json({ error: "Không tìm thấy hóa đơn của bạn" });
      await Orders.deleteById(id);
      res.status(200).json({ success: "Xoá đơn hàng thành công" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getPersonalOrders: async (req, res) => {
    try {
      const userId = req.user.id;
      const Orderss = await Orders.find({ userId });
      res
        .status(200)
        .json({ success: "Lấy toàn bộ đơn hàng thành công", data: Orderss });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getAllOrders: async (req, res) => {
    try {
      const Orderss = await Orders.find();
      res
        .status(200)
        .json({ success: "Lấy toàn bộ hoa don thành công", data: Orderss });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },


  cancellationOrders: async (req, res) => {
    try {
      const user = await User.findById(req.user.id)
      const {status} = req.body
      const _id = req.params.id
      if(status !== 0 ) return res.status(403).json({error: "Vui lòng liên hệ người bán"})
      if(!user) return res.status(400).json({error: "Người dùng không tồn tại"})
      const Orders = await Orders.findByIdAndUpdate(
        { _id },
        {
         status: 3
        }
      );
      if(Orders){
        Orders.order.map(item=>{
          sold(item.productId, item.color, item.size, -item.quantity)
        })
      }
      return res
        .status(200)
        .json({ success: "Huy don hang thanh cong", data: Orders });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};


module.exports = ordersController;
