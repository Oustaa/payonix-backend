const { sequelize } = require("../database/sql.connect");

const Supplier = require("../models/supplier-sql");
const SupplierCompta = require("../models/supplierCompta-sql");

async function getSupplier(req, res) {
  const supplier = await Supplier.findAll();

  return res.status(200).json(supplier);
}

async function postSupplier(req, res) {
  const supplierInfo = req.body;

  if (!supplierInfo.s_name)
    return res.status(400).json({
      error_message: "missing required field",
      missing_field: ["s_name"],
    });

  const supplier = await Supplier.findOne({
    where: { s_name: supplierInfo.s_name },
  });
  if (supplier)
    return res.json({
      supplier,
      error_message: `artisan with the name ${supplierInfo.s_name} already exists`,
    });
  try {
    const supplier = await Supplier.create(supplierInfo);

    return res.status(201).json(supplier);
  } catch (error) {
    return res.status(500).json({
      error_message: "supplier was not created",
    });
  }
}

async function putSupplierInfo(req, res) {
  const { id } = req.params;
  const supplierInfo = req.body;

  try {
    const supplier = await Supplier.findOne({ s_id: id });
    if (supplier)
      return res.status(404).json({
        error_message: `supplier with the id provided does not exist`,
      });
    const updatedSupplierCount = await Supplier.update(supplierInfo, {
      where: {
        s_id: id,
      },
    });

    if (updatedSupplierCount[0] !== 0)
      return res.status(200).json(updatedSupplierCount);
  } catch (error) {
    res.status(500).json({ error_message: "server error", error });
  }
}

async function getSupplierCompta(req, res) {
  const query = `
  SELECT sc.*, s.s_name FROM SuppliersCompta sc
  LEFT JOIN Suppliers s
  on s.s_id = sc.sc_supplier_id
  `;
  try {
    const supplierCompta = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });
    console.log(supplierCompta);
    return res.status(200).json(supplierCompta);
  } catch (err) {
    console.log(err);
  }
}

async function getComptaBySupplier(req, res) {
  const { id } = req.params;

  const supplierCompta = await SupplierCompta.findAll({
    where: {
      sc_supplier_id: id,
    },
  });

  return res.status(200).json(supplierCompta);
}

async function postSupplierCompta(req, res) {
  const supplierComptaInfo = req.body;

  if (!supplierComptaInfo.sc_amount || !supplierComptaInfo.sc_supplier_id)
    return res.status(400).json({
      error_message: `missing required field`,
      missing_field: [
        !supplierComptaInfo.sc_amount && "sc_amount",
        !supplierComptaInfo.sc_supplier_id && "sc_supplier_id",
      ],
    });

  try {
    const supplierCompta = await SupplierCompta.create(supplierComptaInfo);

    return res.status(201).json(supplierCompta);
  } catch (error) {
    return res.status(500).json({
      error_message: "artisan compta was not created",
    });
  }
}

module.exports = {
  getSupplier,
  postSupplier,
  putSupplierInfo,
  getSupplierCompta,
  getComptaBySupplier,
  postSupplierCompta,
};
