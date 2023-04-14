const { sequelize } = require("../database/sql.connect");

const RawMatBase = require("../models/rawMatBase-sql");
const RawMatType = require("../models/rawMatType-sql");
const RawMatStock = require("../models/rawMatStock-sql");
const RawMatInventory = require("../models/rawMatInventory-sql");
const ProductInventory = require("../models/productInventory-sql");

async function getRawMatBase(req, res) {
  try {
    const rawMatBases = await RawMatBase.findAll();

    return res.status(200).json(rawMatBases);
  } catch (error) {
    return res.status(500).json({
      error_message: "internale server error",
      error: error,
    });
  }
}

async function getRawMatInventory(req, res) {
  const query = `
    SELECT rmi.*, a.a_name as a_name, rms.rms_unit_price as rmi_unit_price from RowMaterialInventories rmi
    LEFT JOIN Artisans a 
    on a.a_id = rmi.rmi_artisan_id
    LEFT JOIN RowMaterialStocks rms
    on rms.rms_id = rmi_raw_mat_stock_id
  `;
  try {
    const rawMatInventorys = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });
    return res.status(200).json(rawMatInventorys);
  } catch (error) {
    return res.status(500).json({
      error_message: "internale server error",
      error: error,
    });
  }
}

async function getRawMatStock(req, res) {
  const query = ` SELECT rms.*, rmt.rmt_name AS rms_rm_type, rmb.rmb_name AS rms_rm_base FROM RowMaterialStocks rms 
                  LEFT JOIN RowMaterialTypes rmt
                  ON rms.rms_raw_mat_id = rmt.rmt_id
                  LEFT JOIN RowMaterialBases rmb
                  ON rmt.rmt_raw_mat_base_type = rmb.rmb_id 
                `;

  try {
    const rawMatStocks = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    return res.status(200).json(rawMatStocks);
  } catch (error) {
    return res.status(500).json({
      error_message: "internale server error",
      error: error,
    });
  }
}

async function getRawMatType(req, res) {
  const query = ` SELECT rmt.*, rmb.rmb_name as rmb_origin FROM RowMaterialTypes rmt
                  LEFT join RowMaterialBases rmb
                  on rmt.rmt_raw_mat_base_type = rmb.rmb_id `;
  try {
    const rawMatTypes = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    return res.status(200).json(rawMatTypes);
  } catch (error) {
    return res.status(500).json({
      error_message: "internale server error",
      error: error,
    });
  }
}

async function postRawMatBase(req, res) {
  const rawMatBaseInfo = req.body;

  if (!rawMatBaseInfo.rmb_name)
    return res.status(400).json({
      error_message: "missing required field",
      missing_field: ["rmb_name"],
    });

  try {
    const rawMatBaseWithName = await RawMatBase.findOne({
      where: { rmb_name: rawMatBaseInfo.rmb_name.trim().toLowerCase() },
    });
    if (rawMatBaseWithName)
      return res.status(409).json({
        item: rawMatBaseWithName,
        error_message: "can't create raw material base with the same name",
      });

    const createdRawMatBase = await RawMatBase.create({
      rmb_name: rawMatBaseInfo.rmb_name.trim().toLowerCase(),
    });

    return res.status(201).json({
      item: createdRawMatBase,
      message: "material base was created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error_message: "internale server error",
      error: error,
    });
  }
}

async function postRawMatInventory(req, res) {
  const inventoryInfo = req.body;
  const artisan_name = req.body.a_name;
  const data = inventoryInfo.rms_date_stock;

  const query = `
      SELECT RowMaterialTypes.rmt_name, RowMaterialBases.rmb_name from RowMaterialStocks 
      left JOIN RowMaterialTypes 
      ON RowMaterialStocks.rms_raw_mat_id = RowMaterialTypes.rmt_id
      left JOIN RowMaterialBases 
      ON RowMaterialTypes.rmt_raw_mat_base_type = RowMaterialBases.rmb_id
      WHERE RowMaterialStocks.rms_id = ? 
    `;

  if (
    !inventoryInfo.rmi_quantity ||
    !inventoryInfo.rmi_artisan_id ||
    !inventoryInfo.rmi_raw_mat_stock_id
  )
    return res.status(400).json({
      error_message: `missing required field`,
      missing_field: [
        !inventoryInfo.rmi_quantity && "rmi_quantity",
        !inventoryInfo.rmi_artisan_id && "rmi_artisan_id",
        !inventoryInfo.rmi_raw_mat_stock_id && "rmi_raw_mat_stock_id",
      ],
    });

  try {
    const [{ rmt_name, rmb_name }] = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      replacements: [inventoryInfo.rmi_raw_mat_stock_id],
    });

    const rmi_id = `${data}-${artisan_name}-${rmb_name}-${rmt_name}-${new Date()
      .getTime()
      .toString()
      .substring(8)}`;

    if (inventoryInfo.rmi_raw_mat_stock_id && inventoryInfo.rmi_quantity) {
      const rms_up = await RawMatStock.findOne({
        where: { rms_id: inventoryInfo.rmi_raw_mat_stock_id },
      });

      var rmi_unit_price = rms_up.rms_unit_price;
      var rmi_amount = rmi_unit_price * inventoryInfo.rmi_quantity;

      if (inventoryInfo.rmi_estimated_nbr_prod) {
        inventoryInfo.rmi_rawMat_price_prod =
          rmi_amount / inventoryInfo.rmi_estimated_nbr_prod;
        inventoryInfo.rmi_rawMat_prod =
          inventoryInfo.rmi_quantity / inventoryInfo.rmi_estimated_nbr_prod;
      }
    }
    const createdRawMatInventory = await RawMatInventory.create({
      ...inventoryInfo,
      rmi_unit_price,
      rmi_amount,
      rmi_id,
    });

    return res.status(201).json({
      item: createdRawMatInventory,
      message: "material inventory was created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error_message: "internale server error",
      error: error,
    });
  }
}

async function postRawMatStock(req, res) {
  const rawMatStockInfo = req.body;
  const data = rawMatStockInfo.rms_date_stock;

  const query = `
          SELECT rmt.rmt_name, rmb.rmb_name from RowMaterialTypes rmt
          left JOIN RowMaterialBases rmb
          ON rmb.rmb_id = rmt.rmt_raw_mat_base_type
          WHERE rmt.rmt_id = ? 
            `;
  if (
    !rawMatStockInfo.rms_quantity ||
    !rawMatStockInfo.rms_unit_price ||
    !rawMatStockInfo.rms_raw_mat_id
  )
    return res.status(400).json({
      error_message: `missing required field`,
      missing_field: [
        !rawMatStockInfo.rms_quantity && "rms_quantity",
        !rawMatStockInfo.rms_unit_price && "rms_unit_price",
        !rawMatStockInfo.rms_raw_mat_id && "rms_raw_mat_id",
      ],
    });

  const [{ rmt_name, rmb_name }] = await sequelize.query(query, {
    type: sequelize.QueryTypes.SELECT,
    replacements: [rawMatStockInfo.rms_raw_mat_id],
  });
  const rms_id = `${data}-${rmb_name}-${rmt_name}`;

  const rms_amount =
    rawMatStockInfo?.rms_quantity * rawMatStockInfo?.rms_unit_price;

  try {
    const createdRawMatStock = await RawMatStock.create({
      ...rawMatStockInfo,
      rms_id,
      rms_availability: rawMatStockInfo.rms_quantity,
      rms_amount,
    });

    return res.status(201).json({
      item: createdRawMatStock,
      message: "material stock was created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error_message: "server error",
    });
  }
}

async function postRawMatType(req, res) {
  const rawMatTypeInfo = req.body;

  if (!rawMatTypeInfo.rmt_name || !rawMatTypeInfo.rmt_raw_mat_base_type)
    return res.status(400).json({
      error_message: `missing required field`,
      missing_field: [
        !rawMatTypeInfo.rmt_name && "rmt_name",
        !rawMatTypeInfo.rmt_raw_mat_base_type && "rmt_raw_mat_base_type",
      ],
    });

  try {
    const rawMatWithName = await RawMatType.findOne({
      where: { rmt_name: rawMatTypeInfo.rmt_name },
    });

    if (rawMatWithName)
      return res.status(409).json({
        error_message: `can't create raw material type with the name: ${rawMatTypeInfo.rmt_name}`,
      });

    const createdRawMatType = await RawMatType.create({
      ...rawMatTypeInfo,
      rmt_name: rawMatTypeInfo.rmt_name.toLowerCase(),
    });

    return res.status(201).json({
      item: createdRawMatType,
      message: "material stock was created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error_message: "internale server error",
      error: error,
    });
  }
}

async function putRawMatBase(req, res) {
  const id = req.params.id;
  if (!id)
    return res.status(404).json({
      error_message: "please provide a raw material id",
    });
  const rawMatBaseInfo = req.body;

  if (!rawMatBaseInfo.rmb_name)
    return res.status(400).json({
      error_message: "missing required field",
      missing_field: ["rmb_name"],
    });

  try {
    const rawMatBaseWithName = await RawMatBase.findOne({
      where: { rmb_name: rawMatBaseInfo.rmb_name.trim().toLowerCase() },
    });
    if (rawMatBaseWithName && rawMatBaseWithName.rmb_id !== id)
      return res.status(409).json({
        item: rawMatBaseWithName,
        error_message: "can't update raw material base with the same name",
      });

    const updatedCount = await RawMatBase.update(
      {
        rmb_name: rawMatBaseInfo.rmb_name.trim().toLowerCase(),
      },
      {
        where: { rmb_id: id },
      }
    );

    if (updatedCount[0] !== 0)
      return res.status(201).json({
        message: "Raw Material Base updated successfully",
      });
    return res
      .status(404)
      .json({ error_message: "Raw Material Base was not updated!" });
  } catch (error) {
    return res.status(500).json({
      error_message: "internale server error",
      error: error,
    });
  }
}

async function putRawMatInventory(req, res) {
  const id = req.params.id;
  const inventoryInfo = req.body;

  if (
    !inventoryInfo.rmi_quantity ||
    !inventoryInfo.rmi_artisan_id ||
    !inventoryInfo.rmi_raw_mat_stock_id
  )
    return res.status(400).json({
      error_message: `missing required field`,
      missing_field: [
        !inventoryInfo.rmi_quantity && "rmi_quantity",
        !inventoryInfo.rmi_artisan_id && "rmi_artisan_id",
        !inventoryInfo.rmi_raw_mat_stock_id && "rmi_raw_mat_stock_id",
      ],
    });

  try {
    if (inventoryInfo.rmi_raw_mat_stock_id && inventoryInfo.rmi_quantity) {
      const rms_up = await RawMatStock.findOne({
        where: { rms_id: inventoryInfo.rmi_raw_mat_stock_id },
      });

      var rmi_unit_price = rms_up.rms_unit_price;
      var rmi_amount = rmi_unit_price * inventoryInfo.rmi_quantity;

      if (inventoryInfo.rmi_estimated_nbr_prod) {
        inventoryInfo.rmi_rawMat_price_prod =
          rmi_amount / inventoryInfo.rmi_estimated_nbr_prod;
        inventoryInfo.rmi_rawMat_prod =
          inventoryInfo.rmi_quantity / inventoryInfo.rmi_estimated_nbr_prod;
      }
    }
    const createdRawMatInventory = await RawMatInventory.create({
      ...inventoryInfo,
      rmi_unit_price,
      rmi_amount,
      rmi_id,
    });

    return res.status(201).json({
      item: createdRawMatInventory,
      message: "material inventory was created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error_message: "internale server error",
      error: error,
    });
  }
}

async function putRawMatStock(req, res) {
  const rawMatStockInfo = req.body;
  const data = rawMatStockInfo.rms_date_stock;

  const query = `
          SELECT rmt.rmt_name, rmb.rmb_name from RowMaterialTypes rmt
          left JOIN RowMaterialBases rmb
          ON rmb.rmb_id = rmt.rmt_raw_mat_base_type
          WHERE rmt.rmt_id = ? 
            `;
  if (
    !rawMatStockInfo.rms_quantity ||
    !rawMatStockInfo.rms_unit_price ||
    !rawMatStockInfo.rms_raw_mat_id
  )
    return res.status(400).json({
      error_message: `missing required field`,
      missing_field: [
        !rawMatStockInfo.rms_quantity && "rms_quantity",
        !rawMatStockInfo.rms_unit_price && "rms_unit_price",
        !rawMatStockInfo.rms_raw_mat_id && "rms_raw_mat_id",
      ],
    });

  const [{ rmt_name, rmb_name }] = await sequelize.query(query, {
    type: sequelize.QueryTypes.SELECT,
    replacements: [rawMatStockInfo.rms_raw_mat_id],
  });
  const rms_id = `${data}-${rmb_name}-${rmt_name}`;

  const rms_amount =
    rawMatStockInfo?.rms_quantity * rawMatStockInfo?.rms_unit_price;

  try {
    const createdRawMatStock = await RawMatStock.create({
      ...rawMatStockInfo,
      rms_id,
      rms_availability: rawMatStockInfo.rms_quantity,
      rms_amount,
    });

    return res.status(201).json({
      item: createdRawMatStock,
      message: "material stock was created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error_message: "server error",
    });
  }
}

async function putRawMatType(req, res) {
  const id = req.params.id;
  const rawMatTypeInfo = req.body;

  if (!rawMatTypeInfo.rmt_name || !rawMatTypeInfo.rmt_raw_mat_base_type)
    return res.status(400).json({
      error_message: `missing required field`,
      missing_field: [
        !rawMatTypeInfo.rmt_name && "rmt_name",
        !rawMatTypeInfo.rmt_raw_mat_base_type && "rmt_raw_mat_base_type",
      ],
    });

  try {
    const conflect = await RawMatType.findOne({
      where: { rmt_name: rawMatTypeInfo.rmt_name },
    });

    if (conflect)
      return res.status(409).json({
        error_message: `can't update raw material type with the name: ${rawMatTypeInfo.rmt_name}`,
      });

    const updateCount = await RawMatType.create({
      ...rawMatTypeInfo,
      rmt_name: rawMatTypeInfo.rmt_name.toLowerCase(),
    });

    if (updateCount[0] !== 0)
      return res.status(201).json({
        message: "Raw Material type updated successfully",
      });
    return res
      .status(404)
      .json({ error_message: "Raw Material Type was not updated!" });
  } catch (error) {
    return res.status(500).json({
      error_message: "internale server error",
      error: error,
    });
  }
}

async function putEstematedNbrProd(req, res) {
  const { id } = req.params;
  const { rmi_estimated_nbr_prod } = req.body;

  if (!rmi_estimated_nbr_prod) {
    return res.status(404).json({
      error_message:
        "please provide an estimation for the number of product by raw material",
    });
  }

  try {
    const prodInventory = await RawMatInventory.findOne({
      where: { rmi_id: id },
    });

    const prodInventoryFound = await RawMatInventory.findOne({
      where: { rmi_id: id },
    });

    if (!prodInventoryFound)
      return res.status(404).json({
        error_message: "no such raw material inventiry with the provided id",
      });

    const rmi_rawMat_price_prod =
      prodInventory.rmi_amount / rmi_estimated_nbr_prod;
    const rmi_rawMat_prod = prodInventory.rmi_quantity / rmi_estimated_nbr_prod;

    const updatedInventory = await RawMatInventory.update(
      { rmi_estimated_nbr_prod, rmi_rawMat_price_prod, rmi_rawMat_prod },
      {
        where: {
          rmi_id: id,
        },
      }
    );

    return res.status(201).json({
      item: updatedInventory,
      message: "estemated number of products updated",
    });
  } catch (error) {
    return res.status(500).json({
      error_message: "internale server error",
      error: error,
    });
  }
}

async function deleteRawMatBase(req, res) {
  const { id } = req.params;

  if (!id)
    return res
      .status(204)
      .json({ error_message: "No Material ID have been provided" });

  try {
    const conflect = await RawMatType.findAll({
      where: { rmt_raw_mat_base_type: id },
    });
    if (conflect && conflect.length !== 0) {
      return res.status(406).json({
        error_message: `raw material can't be deleted. it has ${conflect.length} instanse in the Raw Material type Table.`,
      });
    }

    const deletedCount = await RawMatBase.destroy({
      where: { rmb_id: id },
    });
    // check if deleting count is 1
    if (deletedCount >= 1)
      return res.status(200).json({
        message: `raw material base with the ID: ${id} was deleted successfuly`,
        deletionCount: deletedCount,
      });
    return res.status(400).json({
      error_message: `raw material base with the ID: ${id} was not deleted.`,
      deletionCount: deletedCount,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error_message: "internale server error",
    });
  }
}

async function deleteRawMatType(req, res) {
  const { id } = req.params;

  if (!id)
    return res
      .status(204)
      .json({ error_message: "No Material type ID have been provided" });

  try {
    const conflect = await RawMatStock.findAll({
      where: { rms_raw_mat_id: id },
    });
    if (conflect && conflect.length !== 0) {
      return res.status(406).json({
        error_message: `raw material type can't be deleted. it has ${conflect.length} instanse in the Raw Material stock Table.`,
      });
    }

    const deletedCount = await RawMatType.destroy({
      where: { rmt_id: id },
    });

    // check if deleting count is 1
    if (deletedCount >= 1)
      return res.status(200).json({
        message: `raw material base with the ID: ${id} was deleted successfuly`,
        deletionCount: deletedCount,
      });
    return res.status(400).json({
      error_message: `raw material base with the ID: ${id} was not deleted.`,
      deletionCount: deletedCount,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error_message: "internale server error",
    });
  }
}

async function deleteRawMatInventory(req, res) {
  const { id } = req.params;

  if (!id)
    return res
      .status(204)
      .json({ error_message: "No Material ID have been provided" });

  try {
    const conflect = await ProductInventory.findAll({
      where: { pi_raw_mat_inv_id: id },
    });
    if (conflect && conflect.length !== 0) {
      return res.status(406).json({
        error_message: `raw material inventory can't be deleted. it has ${conflect.length} instanse in the product inventory Table.`,
      });
    }

    const deletedCount = await RawMatInventory.destroy({
      where: { rmi_id: id },
    });
    // check if deleting count is 1
    if (deletedCount >= 1)
      return res.status(200).json({
        message: `raw material inventory with the ID: ${id} was deleted successfuly`,
        deletionCount: deletedCount,
      });
    return res.status(400).json({
      error_message: `raw material inventory with the ID: ${id} was not deleted.`,
      deletionCount: deletedCount,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error_message: "internale server error",
    });
  }
}

async function deleteRawMatStock(req, res) {
  const { id } = req.params;

  if (!id)
    return res
      .status(204)
      .json({ error_message: "No Material stock ID have been provided" });

  try {
    const conflect = await RawMatInventory.findAll({
      where: { rmi_raw_mat_stock_id: id },
    });
    if (conflect && conflect.length !== 0) {
      return res.status(406).json({
        error_message: `raw material stock can't be deleted. it has ${conflect.length} instanse in the Raw Material Inventory Table.`,
      });
    }

    const deletedCount = await RawMatStock.destroy({
      where: { rms_id: id },
    });
    // check if deleting count is 1
    if (deletedCount >= 1)
      return res.status(200).json({
        message: `raw material stock with the ID: ${id} was deleted successfuly`,
        deletionCount: deletedCount,
      });
    return res.status(400).json({
      error_message: `raw material stock with the ID: ${id} was not deleted.`,
      deletionCount: deletedCount,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error_message: "internale server error",
    });
  }
}

module.exports = {
  getRawMatBase,
  getRawMatInventory,
  getRawMatStock,
  getRawMatType,
  postRawMatBase,
  postRawMatInventory,
  postRawMatStock,
  postRawMatType,
  putEstematedNbrProd,
  deleteRawMatBase,
  deleteRawMatType,
  deleteRawMatInventory,
  deleteRawMatStock,
};
