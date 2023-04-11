const { sequelize } = require("../database/sql.connect");

const Product = require("../models/products-sql");
const ProductInventory = require("../models/productInventory-sql");
const ProductsCategories = require("../models/productCategory-sql");

async function getProductsCategories(req, res) {
  try {
    const categories = await ProductsCategories.findAll();

    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({
      error_message: "internale server error",
    });
  }
}

async function getProductsInventory(req, res) {
  const query = ` SELECT pi.*, a.a_name as vendor, p.p_name AS name, pc.pc_name as catigory FROM ProductInventories pi
        left join Artisans a
        on a.a_id = pi.pi_artisan_id
        left join Products p
        on p.p_id = pi.pi_prod_id
        left join ProductCategories pc 
        on pc.pc_id = p.p_category
        `;

  try {
    const productsInventory = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    return res.status(200).json(productsInventory);
  } catch (error) {
    return res.status(500).json({
      error_message: "internale server error",
    });
  }
}

async function getProducts(req, res) {
  const query = `
      SELECT p.*, pc.pc_name as p_category_name from Products p
      LEFT JOIN ProductCategories pc
      on pc.pc_id = p.p_category
    `;
  try {
    const products = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({
      error_message: "internale server error",
    });
  }
}

async function postProductCategory(req, res, next) {
  const productCategoryInfo = req.query;

  if (!productCategoryInfo.pc_name)
    return res.status(400).json({
      error_message: "missing required fields",
      missing_field: [!productCategoryInfo.pc_name && "pc_name"],
    });

  try {
    const productWithName = await ProductsCategories.findOne({
      where: { pc_name: productCategoryInfo.pc_name.trim().toLowerCase() },
    });
    if (productWithName)
      return res.status(409).json({
        item: productWithName,
        error_message: `can't create category with the same name: ${productCategoryInfo.pc_name}`,
      });

    const createdCategory = await ProductsCategories.create({
      pc_name: productCategoryInfo.pc_name.trim().toLowerCase(),
    });

    return res.status(201).json({
      item: createdCategory,
      message: "Category was created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error_message: "internale server error",
    });
  }
}

async function postProductInventory(req, res) {
  const productInventoryInfo = req.body;

  if (
    !productInventoryInfo.pi_artisan_id ||
    !productInventoryInfo.pi_quantity ||
    !productInventoryInfo.pi_unit_price ||
    !productInventoryInfo.pi_prod_id
  )
    return res.status(400).json({
      error_message: "missing required fields",
      missing_field: [
        !productInventoryInfo.pi_quantity && "pi_quantity",
        !productInventoryInfo.pi_unit_price && "pi_unit_price",
        !productInventoryInfo.pi_prod_id && "pi_prod_id",
        !productInventoryInfo.pi_artisan_id && "pi_artisan_id",
      ],
    });

  productInventoryInfo.pi_amount =
    productInventoryInfo.pi_quantity * productInventoryInfo.pi_unit_price;

  try {
    const createdProductInventory = await ProductInventory.create(
      productInventoryInfo
    );

    return res.status(201).json({
      item: createdProductInventory,
      message: "product inventory was created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error_message: "internale server error",
    });
  }
}

async function postProduct(req, res) {
  const productInfo = req.query;

  if (!productInfo.p_name || !productInfo.p_category)
    return res.status(400).json({
      error_message: "missing required fields",
      missing_field: [
        !productInfo.p_name && "p_name",
        !productInfo.p_category && "p_category",
      ],
    });

  try {
    const productWithName = await Product.findOne({
      where: { p_name: productInfo.p_name.trim().toLowerCase() },
    });

    if (productWithName)
      return res.status(409).json({
        item: productWithName,
        error_message: `can't create a product with the same name: ${productInfo.p_name}`,
      });

    const p_image = req?.file?.filename || "";

    const createdProductVariety = await Product.create({
      ...productInfo,
      p_name: productInfo.p_name.trim().toLowerCase(),
      p_image,
    });

    return res.status(201).json({
      item: createdProductVariety,
      message: "product varirty was created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error_message: "internale server error",
    });
  }
}

// not tested yet
async function putProductImage(req, res) {
  const { id } = req.params;
  const p_image = `http://localhost:8000/${req.file.filename}`;
  if (p_image) {
    const updatedProduct = await Product.update(
      { p_image },
      {
        where: {
          p_id: id,
        },
      }
    );

    return res.status(201).json({
      item: updatedProduct,
      error_message: "product image was updated successfully",
      p_image: p_image,
    });
  }
}

async function putProductVariety(req, res) {
  const { id } = req.params;
  const { p_description } = req.query;

  const info = {};
  if (req.file) info.p_image = `http://localhost:8000/${req.file.filename}`;
  if (p_description) info.p_description = p_description;

  const updatedProductVariety = await ProductsVariety.update(info, {
    where: {
      p_id: id,
    },
  });

  return res.status(201).json({
    item: updatedProductVariety,
    error_message: "product image was updated successfully",
    info,
  });
}

async function deleteProduct(req, res) {
  const { id } = req.params;

  if (!id)
    return res
      .status(204)
      .json({ error_message: "No product ID have been provided" });

  try {
    const deletedProductCount = await Product.destroy({
      where: { p_id: id },
    });
    // check if deleting count is 1
    if (deletedProductCount >= 1)
      return res.status(200).json({
        message: `product with the ID: ${id} was deleted successfuly`,
        deletionCount: deletedProductCount,
      });
    return res.status(400).json({
      error_message: `product with the ID: ${id} was not deleted.`,
      deletionCount: deletedProductCount,
    });
  } catch (error) {
    return res.status(500).json({
      error_message: "internale server error",
    });
  }
}

async function deleteProductCategory(req, res) {
  const { id } = req.params;

  if (!id)
    return res
      .status(204)
      .json({ error_message: "No product ID have been provided" });

  try {
    const deletedProductCount = await ProductsCategories.destroy({
      where: { pc_id: id },
    });

    if (deletedProductCount >= 1)
      return res.status(200).json({
        message: `product category with the ID: ${id} was deleted successfuly`,
        deletionCount: deletedProductCount,
      });
    return res.status(400).json({
      error_message: `product category with the ID: ${id} was not deleted.`,
      deletionCount: deletedProductCount,
    });
  } catch (error) {
    return res.status(500).json({
      error_message: "internale server error",
    });
  }
}

module.exports = {
  getProductsCategories,
  getProductsInventory,
  getProducts,
  postProductCategory,
  postProduct,
  postProductInventory,
  putProductImage,
  putProductVariety,
  deleteProduct,
  deleteProductCategory,
};
