const {Product, VariantProduct, SizeProduct, ColorProduct} = require('../models/Product')
const Orders = require('../models/Orders')

const statisticsController = {
  revenueStatistics: async (req, res) => {
    const { type, dateFrom, dateTo } = req.body;

    const defaultDateFrom = new Date();
    defaultDateFrom.setMonth(defaultDateFrom.getMonth() - 1); 

    const startDate = dateFrom ? new Date(dateFrom) : defaultDateFrom;
    const endDate = dateTo ? new Date(dateTo) : new Date();
    let step = -1;
    if (type == "day") {
        step = 10;
    } else if (type == "month") {
        step = 7;
    } else if (type == "year") {
        step = 4
    }
    if (step === -1) {
        return res.status(400).json({ error: "Type param is invalid" })
    }
    try {
        const revenue = await Orders.aggregate(
            [
                {
                    "$match": {
                        "createdAt": { "$gte": startDate, "$lte": endDate },
                        "status": { "$ne": -1 } //not equal
                    }
                },
                {
                    "$unwind": "$ordersItems"
                },
                {
                    "$lookup": {
                        "from": "products", 
                        "localField": "ordersItems.product",
                        "foreignField": "_id",
                        "as": "productDetails"
                    }
                },
                {
                    "$unwind": "$productDetails"
                },
                {
                    "$group": {
                        "_id": {
                            $substr: ['$createdAt', 0, step]
                        }, //nhóm tất cả các đơn hàng lại với nhau. không quan tâm đến đơn hàng thuộc về người dùng nào hoặc thuộc về loại sản phẩm nào
                        "totalAmount": { "$sum": { "$multiply": ["$ordersItems.quantity", "$productDetails.price"] } },
                        "totalQuantity": { "$sum": "$ordersItems.quantity" }
                    }
                },
                {
                    "$project": {
                        "_id": 0, // bỏ trường id
                        "date": "$_id",
                        "totalAmount": "$totalAmount",
                        "totalQuantity": "$totalQuantity"
                    }
                }
            ]
        )
        if (revenue) {
            return res.status(200).json({ revenue })
        }
        res.status(400).json({ error: "Something went wrong" })
    } catch (error) {
        res.status(400).json({ error })
    }
  },
  hotSellingProductStatistics: async (req, res) => {
    try {
        
    } catch (error) {
        
    }
  },
};

module.exports = statisticsController;