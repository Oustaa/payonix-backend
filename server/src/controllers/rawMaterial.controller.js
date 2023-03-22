const { sequelize } = require("../database/sql.connect");

const RawMatBase = require("../models/rawMatBase-sql");
const RawMatInventory = require("../models/rawMatInventory-sql");
const RawMatStock = require("../models/rawMatStock-sql");
const RawMatType = require("../models/rawMatType-sql");

async function getRawMatBase(req, res) {
  try {
    const rawMatBases = await RawMatBase.findAll();

    return res.status(200).json(rawMatBases);
  } catch (error) {
    return res.status(500).json({
      error_message: "server error",
    });
  }
}

async function getRawMatInventory(req, res) {
  try {
    const rawMatInventorys = await RawMatInventory.findAll();

    return res.status(200).json(rawMatInventorys);
  } catch (error) {
    return res.status(500).json({
      error_message: "server error",
    });
  }
}

async function getRawMatStock(req, res) {
  const query = ` SELECT rms.*, rmt.rmt_name AS rms_rm_type, rmb.rmb_name AS rms_rm_base FROM rowmaterialstocks rms 
                  LEFT JOIN rowmaterialtypes rmt
                  ON rms.rms_raw_mat_id = rmt.rmt_id
                  LEFT JOIN rowmaterialbases rmb
                  ON rmt.rmt_raw_mat_base_type = rmb.rmb_id 
                `;

  try {
    const rawMatStocks = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    return res.status(200).json(rawMatStocks);
  } catch (error) {
    return res.status(500).json({
      error_message: "server error",
    });
  }
}

async function getRawMatType(req, res) {
  const query = ` SELECT rmt.*, rmb.rmb_name as rmb_origin FROM rowmaterialtypes rmt
                  LEFT join rowmaterialbases rmb
                  on rmt.rmt_raw_mat_base_type = rmb.rmb_id `;
  try {
    const rawMatTypes = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    return res.status(200).json(rawMatTypes);
  } catch (error) {
    return res.status(500).json({
      error: error,
      error_message: "server error",
    });
  }
}

async function postRawMatBase(req, res) {
  const rawMatBaseInfo = req.body;

  if (!rawMatBaseInfo.rmb_name)
    res.status(400).json({
      error_message: "missing required field 'rmb_name'",
    });

  try {
    const rawMatBaseWithName = await RawMatBase.findOne({
      where: { rmb_name: rawMatBaseInfo.rmb_name },
    });
    if (rawMatBaseWithName)
      return res.status(201).json({
        createdItem: rawMatBaseWithName,
        message: "can't create raw material base with the same name",
      });

    const createdRawMatBase = await RawMatBase.create(rawMatBaseInfo);

    return res.status(201).json({
      createdItem: createdRawMatBase,
      message: "material base was created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error_message: "server error",
      error,
    });
  }
}

async function postRawMatInventory(req, res) {
  const inventoryInfo = req.body;
  console.log(inventoryInfo);
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
    const createdRawMatInventory = await RawMatInventory.create(inventoryInfo);

    return res.status(201).json({
      createdItem: createdRawMatInventory,
      message: "material inventory was created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error_message: "server error",
    });
  }
}

async function postRawMatStock(req, res) {
  const rawMatStockInfo = req.body;
  const rms_amount =
    rawMatStockInfo?.rms_quantity * rawMatStockInfo?.rms_unit_price;
  console.log(rawMatStockInfo);
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

  try {
    const createdRawMatStock = await RawMatStock.create({
      ...rawMatStockInfo,
      rms_availability: rawMatStockInfo.rms_quantity,
      rms_amount,
    });

    return res.status(200).json({
      createdItem: createdRawMatStock,
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
    const createdRawMatType = await RawMatType.create(rawMatTypeInfo);

    return res.status(200).json({
      createdItem: createdRawMatType,
      message: "material stock was created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error_message: "server error",
      error,
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
};
