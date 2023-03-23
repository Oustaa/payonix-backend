const Product = require("../models/product-sql");
const ProductInventory = require("../models/productInventory-sql");
const ProductVariety = require("../models/productsVariety-sql");
const ProductsVariety = require("../models/productsVariety-sql");

async function getProducts(req, res) {
  const products = await Product.findAll();

  return res.status(200).json(products);
}

async function getProductsInventory(req, res) {
  const productsInventory = await ProductInventory.findAll();

  return res.status(200).json(productsInventory);
}

async function getProductsVariety(req, res) {
  const productsVariety = await ProductsVariety.findAll();

  return res.status(200).json(productsVariety);
}

async function postProduct(req, res) {
  const productInfo = req.body;

  if (!productInfo.p_raw_mat_base_id || !productInfo.p_name)
    return res.status(400).json({
      error_message: "missing required fields",
      missing_field: [
        !productInfo.p_raw_mat_base_id && "p_raw_mat_base_id",
        !productInfo.p_name && "p_name",
      ],
    });

  try {
    const productWithName = await Product.findOne({
      where: { p_name: productInfo.p_name.trim().toLowerCase() },
    });
    if (productWithName)
      return res.status(201).json({
        item: productWithName,
        message: `can't create product with the same name: ${productInfo.p_name}`,
      });

    const createdProduct = await Product.create({
      p_name: productInfo.p_name.trim().toLowerCase(),
      p_raw_mat_base_id: productInfo.p_raw_mat_base_id,
    });

    return res.status(201).json({
      item: createdProduct,
      message: "material base was created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error_message: "server error",
      error,
    });
  }
}

async function postProductInventory(req, res) {
  const productInventoryInfo = req.body;

  if (
    !productInventoryInfo.pi_quantity ||
    !productInventoryInfo.pi_unit_price ||
    !productInventoryInfo.pi_prod_variant_id ||
    !productInventoryInfo.pi_raw_mat_inv_id
  )
    return res.status(400).json({
      error_message: "missing required fields",
      missing_field: [
        !productInventoryInfo.pi_quantity && "pi_quantity",
        !productInventoryInfo.pi_unit_price && "pi_unit_price",
        !productInventoryInfo.pi_prod_variant_id && "pi_prod_variant_id",
        !productInventoryInfo.pi_raw_mat_inv_id && "pi_raw_mat_inv_id",
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
    return res.status(500).json({
      error_message: "server error",
      error,
    });
  }
}

async function postProductVariety(req, res) {
  const productVarietyInfo = req.body;

  if (!productVarietyInfo.pv_name || !productVarietyInfo.pv_product_id)
    return res.status(400).json({
      error_message: "missing required fields",
      missing_field: [
        !productVarietyInfo.pv_product_id && "pv_product_id",
        !productVarietyInfo.pv_name && "pv_name",
      ],
    });

  try {
    const productVarietyWithName = await ProductVariety.findOne({
      where: { pv_name: productVarietyInfo.pv_name.trim().toLowerCase() },
    });
    console.log(productVarietyWithName);
    if (productVarietyWithName)
      return res.status(201).json({
        item: productVarietyWithName,
        message: `can't create a product variety with the same name: ${productVarietyInfo.pv_name}`,
      });

    const createdProductVariety = await ProductVariety.create({
      productVarietyInfo,
      pv_name: productVarietyInfo.pv_name.trim().toLowerCase(),
      pv_image: "sdfdsf",
    });

    return res.status(201).json({
      item: createdProductVariety,
      message: "product varirty was created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error_message: "server error",
      error,
    });
  }
}

module.exports = {
  getProducts,
  getProductsInventory,
  getProductsVariety,
  postProduct,
  postProductInventory,
  postProductVariety,
};
