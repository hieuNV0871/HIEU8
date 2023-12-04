
const crypto = require('crypto');
const https = require('https');
const axios = require('axios').default // npm install axios
const CryptoJS = require('crypto-js'); // npm install crypto-js
const moment = require('moment'); // npm install moment
const config = {
    app_id: "2554",
    key1: "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn",
    key2: "	trMrHtvjo6myautxDUiAcYsVtaeQ8nhf",
    endpoint: "https://sb-openapi.zalopay.vn/v2/create"
};
const paymentController = {
    paymentWithMoMo: async (req, res)=>{
        const { order } = req.body;
        const partnerCode = "MOMO6K0Y20210317";
        const accessKey = "8oZLaYOOTAswDt0O";
        const secretkey = "MHxk2u6eOXitCarGbCsGXmpydjn0wCAk";
        const requestId = partnerCode + new Date().getTime();
        const orderId = requestId;
        const orderInfo = "Thanh toán sản phẩm tại NVH-SHOP";
        const redirectUrl = "http://localhost:3000/";
        const ipnUrl = "http://localhost:5000/v1/orders/create";
        const amount = order.totalPrice;
        const requestType = "captureWallet"
        const extraData = JSON.stringify({ ...order, userId: req.user._id }) + "@"; //pass empty value if your merchant does not have stores
        const rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType
        const signature = crypto.createHmac('sha256', secretkey)
            .update(rawSignature)
            .digest('hex');
        //json object send to MoMo endpoint
        const body = JSON.stringify({
            partnerCode: partnerCode,
            accessKey: accessKey,
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: redirectUrl,
            ipnUrl: ipnUrl,
            orderObj: order,
            extraData: extraData,
            requestType: requestType,
            signature: signature,
            lang: 'en'
        });
        const options = {
            hostname: 'test-payment.momo.vn',
            port: 443,
            path: '/v2/gateway/api/create',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body)
            }
        }
        var request = await https.request(options, (resp) => {
            resp.setEncoding('utf8');
            resp.on('data', (body) => {
                res.status(200).json({ url: JSON.parse(body).payUrl });
            });
            resp.on('end', () => {
                console.log('No more data in response.');
            });
        });
        request.write(body);
        request.end();
        },
    paymentWithZALO: async(req, res)=>{
        try {
            const embed_data = {};

            const items = [{}];
            const transID = Math.floor(Math.random() * 1000000);
            
            const order = {
                app_id: config.app_id,
                app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
                app_user: req.user.id,
                app_time: Date.now(), // miliseconds
                item: JSON.stringify(items),
                embed_data: JSON.stringify(embed_data),
                amount: 50000,
                description: `HNV-SHOP - Payment for the order #${transID}`,
                bank_code: "zalopayapp",
            };
            
            // appid|app_trans_id|appuser|amount|apptime|embeddata|item
            const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
            order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
            
            axios.post(config.endpoint, null, { params: order })
                .then(res => {
                    console.log(res.data.order_url);
                })
                .catch(err => console.log(err));  
            
            res.status(200).json({success: "Thanh toán thành công, xin cảm ơn"})
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    }
}


module.exports = paymentController