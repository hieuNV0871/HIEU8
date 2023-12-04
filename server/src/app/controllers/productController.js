const {Product, VariantProduct, SizeProduct, ColorProduct} = require('../models/Product')
const Category = require('../models/Category')

const jsonStringifySafe = require('json-stringify-safe');
const productController = {
    createProduct: async (req, res) => {
        try {
            const {name, description, category,collectionId, brand, price, images} = req.body
            const product = await Product.findOne({name})
            if(product) return res.status(400).json({error: "Sản phẩm đã tồn tại"})
            const newProduct = new Product({
                name,
                description,
                category,
                brand,
                collectionId,
                price,
                images
            })
            await newProduct.save();
            res.status(200).json({success: "Thêm mới sản phẩm thành công"})
        }catch (error) {
            res.status(500).json({error: error.message})
        }
    },

    updateProduct: async(req, res) => {
        try {
            const {name, description, category, brand, price,collectionId, images, variants} = req.body
            const _id = req.params.id
            const variantProducts = [];
            for (const variant of variants) {
                const size = await SizeProduct.findById(variant.sizeId);
                const color = await ColorProduct.findById(variant.colorId);
                const sku = `NVH${size.name}${color.name}`;
                const variantProduct = new VariantProduct({
                    productId: _id,
                    sizeId: variant.sizeId,
                    colorId: variant.colorId,
                    quantity: variant.quantity,
                    sku: sku
                })
                variantProducts.push(variantProduct);
            }
            await VariantProduct.insertMany(variantProducts);
            // if(name||description||category||brand||price||images||variants ||collectionId){
            //     const newProduct = await Product.findOneAndUpdate({_id}, {
            //         name, description, category, brand, collectionId, price, images
            //     })
            //     await newProduct.save();
            // }
            res.status(200).json({success: "Cập nhật sản phẩm thành công"})
        }catch (error) {
            res.status(500).json({error: error.message})
        }
    },
    deleteOneProduct: async (req, res)=>{
        try {
			const _id = req.params.id
            await VariantProduct.deleteMany({ _id });
			const deletedProduct = await Product.findByIdAndDelete(_id);
            if (!deletedProduct) {
                return res.status(404).json({ error: 'Product not found' });
            }
			return res.status(200).json({ success: 'Xóa thành công'})
		} catch (error) {
			return res.status(500).json({ error: error.message })
		}
    },

    deleteSelectedProduct: async (req, res)=>{
        try {
		    const _ids = req.body
        
        for (const productId of _ids) {
            await VariantProduct.deleteMany({ productId });
        }
        const deletedProducts = await Product.deleteMany({ _id: { $in: _ids } });
        if (deletedProducts.deletedCount === 0) {
            return res.status(404).json({ error: 'No products found for deletion' });
        }
			return res.status(200).json({ success: 'Xóa thành công'})
		} catch (error) {
			return res.status(500).json({ error: error.message })
		}
    },
    // get
    getAllProduct: async (req, res) => {
        try {
          const limit = parseInt(req.query.limit) || 10;
          const page = parseInt(req.query.page) || 1;
          const skip = (page - 1) * limit;
          const keyword = req.query.keyword || '';
          
          // Tính total dựa trên sự có hoặc không có từ khóa tìm kiếm
          const total = keyword
            ? await Product.countDocuments({ name: { $regex: new RegExp(keyword, 'i') } })
            : await Product.countDocuments();
      
          const products = await Product.find({
            name: { $regex: new RegExp(keyword, 'i') }
          })
            .populate('category', 'name')
            .populate('brand', 'name')
            .populate('collectionId', 'name')
            .skip(skip)
            .limit(limit);
      
          const transformedProducts = products.map(product => ({
            productId: product._id,
            name: product.name,
            description: product.description,
            category: product.category ? product.category.name : null,
            brand: product.brand ? product.brand.name : null,
            collectionId: product.collectionId ? product.collectionId.name : null,
            price: product.price,
            images: product.images,
          }));
      
          res.status(200).json({ success: "Lấy toàn bộ sản phẩm thành công", data: transformedProducts, total });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      },

    getProductByID: async(req, res) => {
        try {
            const productId = req.params.id;
            const product = await Product.findById(productId)
                .populate('category', 'name') 
                .populate('brand', 'name')
                .populate('collectionId', 'name')

    
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            // Now, let's fetch all variants
            const variants = await VariantProduct.find({ productId })
                .populate('sizeId', 'name')
                .populate('colorId', 'name')
            
            res.status(200).json({success: "Lấy sản phẩm thành công", data: {product, variants}})
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getProductBySubCategory: async(req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 10; // Default limit to 10 if not provided
            const page = parseInt(req.query.page) || 1; // Default page to 1 if not provided
            const skip = (page - 1) * limit;
            const id = req.params.id;
            const category = await Category.findOne({ _id: id });
            if (!category) {
                return res.status(404).json({ message: 'Danh mục không tồn tại' });
            }
            if (!category) {
                return res.status(404).json({ message: 'Danh mục không tồn tại' });
            }
            const products = await Product.find({
                category: category._id
            }).skip(skip).limit(limit);
            
            res.status(200).json({success: "Lấy sản phẩm thành công", data: products})
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
    getProductByParentCategory: async(req, res)=>{
        try {
            const limit = parseInt(req.query.limit) || 10; // Default limit to 10 if not provided
            const page = parseInt(req.query.page) || 1; // Default page to 1 if not provided
            const skip = (page - 1) * limit;
    
            const parentCategoryId = req.params.id;
            const parentCategory = await Category.findOne({ _id: parentCategoryId });
    
            if (!parentCategory) {
                return res.status(404).json({ message: 'Danh mục cha không tồn tại' });
            }
    
            const subCategories = await Category.find({ parentCategory: parentCategory._id });
    
            const totalProducts = await Product.countDocuments({
                category: { $in: [parentCategoryId, ...subCategories.map(sub => sub._id)] }
            });
    
    
            const products = await Product.find({
                category: { $in: [parentCategoryId, ...subCategories.map(sub => sub._id)] }
            })
                .skip(skip)
                .limit(limit);
    
            res.status(200).json({
                success: "Lấy sản phẩm thành công",
                data: products,
                total: totalProducts,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    searchProduct: async(req, res)=> {
        try {
            const keyword = req.query.keyword;
            const limit = req.query.limit || 100;
            const results = await Product.find({
                name: { $regex: new RegExp(keyword, 'i') }
            }).limit(limit);
            // const variant = VariantProduct.find({
            //     colorId: { $regex: new RegExp(keyword, 'i') }
            // }).populate('colorId', 'name');
            // const safeVariantResults = JSON.parse(jsonStringifySafe(variant));
            res.status(200).json({success: "Lấy sản phẩm thành công", data: results })
          } catch (error) {
            res.status(500).json({ error: error.message })
          }
    },
    getAllColor: async(req, res)=> {
        try {
            const colors = await ColorProduct.find();
            res.status(200).json({success: "Lấy màu thành công", data: colors })
          } catch (error) {
            res.status(500).json({ error: error.message })
          }
    },
    getAllSize: async(req, res)=> {
        try {
            const sizes = await SizeProduct.find();
            res.status(200).json({success: "Lấy size thành công", data: sizes })
          } catch (error) {
            res.status(500).json({ error: error.message })
          }
    },
    getProductByVariant: async(req, res)=> {
        try {
            const _id = req.params.id
            const variant = await VariantProduct.findById(_id)
            .populate('sizeId')
            .populate('colorId')
            res.status(200).json({success: "Lấy sản phẩm thành công", data: variant })
          } catch (error) {
            res.status(500).json({ error: error.message })
          }
    },
    

   
}

module.exports = productController