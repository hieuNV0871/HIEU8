
const brand = require('../models/Brand')

const brandController = {
    createBrand: async (req, res) => {
        try {
            const { name, position } = req.body;
            const newbrand = new brand({
              name,
              position,
            });
            await newbrand.save();
            res.status(201).json({ success: 'Thêm mới thương hiệu thành công', data: newbrand });
          } catch (error) {
            res.status(500).json({error: error.message})
          }
    },

    updateBrand: async (req, res) => {
        try {
            const {name, position} = req.body
            const _id = req.params.id
            await brand.findByIdAndUpdate(_id, {name, position })
            res.status(200).json({success: "Cập nhật thương hiệu thành công"})
        } catch (error) {
            res.status(500).json({error: error.message})
        }
    },
    deleteOneBrand: async (req, res) => {
        try {
            const id = req.params.id;  
            await brand.deleteOne({ _id: id });
            res.status(200).json({ success: 'Xóa thương hiệu thành công' });
          } catch (error) {
            res.status(500).json({ error: error.message });
          }
    },
    getAllBrand: async(req, res)=> {
        try {
            const brands = await brand.find();
            res.status(200).json({success: "Lấy thương hiệu con thành công", data: brands})
        } catch (error) {
            res.status(500).json({error: error.message})
            
        }
    },
}


module.exports = brandController