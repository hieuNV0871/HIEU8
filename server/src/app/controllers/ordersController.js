const Orders = require("../models/Orders");
const Cart = require("../models/Cart");

const {VariantProduct} = require('../models/Product')
const ordersController = {


  createOrders: async (req, res) => {
    try {
      const { ordersItems, name, user, address, phone, paymentMethod, totalPrice } = req.body;
  
      if (ordersItems.length < 1)
        return res.status(400).json({ error: "Giỏ hàng của bạn đang trống" });
  
      if (!address)
        return res.status(400).json({ error: "Vui lòng cập nhật địa chỉ giao hàng" });

      const newOrders = new Orders({
        user,
        name,
        ordersItems,
        address,
        phone,
        paymentMethod,
        totalPrice,
      });
  

      const cartPrice = await Cart.findOne({ user }).populate('cartItems.product', 'price');
    const cartTotalPrice = cartPrice.cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

    if (totalPrice !== cartTotalPrice) {
      return res.status(400).json({ error: "Tổng giá trị đơn hàng không khớp với giỏ hàng" });
    }

    await Cart.findOneAndUpdate({ user }, { $pull: { cartItems: { product: { $in: ordersItems.map(item => item.product) } } } });

      for (const item of ordersItems) {
        
        const variant = await VariantProduct.findById(item.variant);
        if (variant) {
          variant.quantity -= item.quantity;
          await variant.save();
        }
      }
      await newOrders.save();

      res.status(200).json({ success: "Tạo đơn hàng thành công", data: newOrders });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },


  updateOrdersStatus: async (req, res) => {
    try {
      const { orderId, status } = req.body;
      const existingOrder = await Orders.findById(orderId);
      if (!existingOrder) {
        return res.status(404).json({ error: "Đơn hàng không tồn tại" });
      }
      existingOrder.status = status;
      await existingOrder.save();
      res.status(200).json({ success: "Cập nhật trạng thái đơn hàng thành công", data: existingOrder });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // admin
  //    de day mai lam tiep ^^
  updatePersonalOrders: async (req, res) => {
    try {

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteOneOrders: async (req, res) => {
    try {
      
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getPersonalOrders: async (req, res) => {
    try {
      const user = req.user.id;
      const Orderss = await Orders.find({ user })
      .populate({
        path: "ordersItems.product",
        model: "Product",
      })
      .populate({
        path: "ordersItems.variant",
        model: "VariantProduct",
        populate: {
          path: "colorId",
          model: "ColorProduct",
        },
      })
      .populate({
        path: "ordersItems.variant",
        model: "VariantProduct",
        populate: {
          path: "sizeId",
          model: "SizeProduct",
        },
      });
      res
        .status(200)
        .json({ success: "Lấy toàn bộ đơn hàng thành công", data: Orderss });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getAllOrders: async (req, res) => {
    try {
      const Orderss = await Orders.find()
      .populate({
        path: "ordersItems.product",
        model: "Product",
      })
      .populate({
        path: "ordersItems.variant",
        model: "VariantProduct",
        populate: {
          path: "colorId",
          model: "ColorProduct",
        },
      })
      .populate({
        path: "ordersItems.variant",
        model: "VariantProduct",
        populate: {
          path: "sizeId",
          model: "SizeProduct",
        },
      });
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
