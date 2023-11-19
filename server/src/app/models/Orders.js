const mongoose = require("mongoose")
const deletePlugin = require('mongoose-delete');

const ordersSchema = new mongoose.Schema({
    name: {
        type: String,
        default: 'Khách hàng'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    orders: {
        type: Array,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    },
    email: {
        type: String,
    },   
    paymentMethod: {
        type: String,
        default: 'cash'
    },
    status: {
        type: Number,
        default: 0 // o la chua thanh toán, 1 la ok
    },

    totalPrice: {
        type: Number,
        require: true,
    },


}, {timestamps: true})

ordersSchema.plugin(deletePlugin, { overrideMethods: true, deletedAt: true,});

module.exports = mongoose.model("Orders", ordersSchema)