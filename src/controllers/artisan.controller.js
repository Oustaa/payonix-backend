const { sequelize } = require("../database/sql.connect");

// const Artisan = require("../models/artisan-sql");
const Artisans = require("../models/artisan-sql");
const ArtisanCompta = require("../models/artisanCompta-sql");
const ProductInventory = require("../models/productInventory-sql");
const RawMatInventory = require("../models/rawMatInventory-sql");

async function getArtisans(req, res) {
  try {
    const artisan = await Artisans.findAll();

    return res.status(200).json(artisan);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error_message: "internale server error" });
  }
}

async function postArtisan(req, res) {
  const artisanInfo = req.body;

  if (!artisanInfo.a_name)
    return res.status(400).json({
      error_message: "missing required field",
      missing_field: ["a_name"],
    });

  try {
    const artisanExists = await Artisans.findOne({
      where: { a_name: artisanInfo.a_name },
    });
    if (artisanExists)
      return res.status(409).json({
        item: artisanExists,
        error_message: `can't create artisan with the name "${artisanInfo.a_name}"`,
      });

    const artisan = await Artisans.create(artisanInfo);

    return res.status(201).json({
      item: artisan,
      message: `artisan with the name ${artisanInfo.a_name} was added successfuly`,
    });
  } catch (error) {
    return res.status(500).json({
      error_message: "internale server error",
    });
  }
}

async function putArtisanInfo(req, res) {
  const id = req.params.id;
  const artisanInfo = req.body;

  if (!artisanInfo.a_name)
    return res.status(400).json({
      error_message: "missing required field",
      missing_field: ["a_name"],
    });

  try {
    const conflect = await Artisans.findOne({ where: { a_id: id } });
    if (!conflect)
      return res.status(404).json({
        message_error: `there is no artisan with the provided id: ${id}`,
      });

    const nameConflect = await Artisans.findOne({
      where: { a_name: artisanInfo.a_name },
    });

    if (nameConflect && nameConflect.a_id !== id)
      return res.status(400).json({
        error_message:
          "Can't update artisan with the given name, allredy exist one.",
      });

    const updatedArtisanCount = await Artisans.update(artisanInfo, {
      where: {
        a_id: id,
      },
    });

    if (updatedArtisanCount[0] !== 0)
      return res.status(201).json({
        message: "Artisan updated successfully",
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error_message: "internale server error",
    });
  }
}

async function getArtisansCompta(req, res) {
  let { limit, page } = req.query;
  page = page ? page : 0;
  const skip = limit * page - limit;

  const query = `
    SELECT ac.*, a.a_name FROM ArtisanCompta ac
    LEFT JOIN Artisans a
    on a.a_id = ac.ac_artisan_id
    order by ac.ac_date DESC
  `;
  // limit ${limit} OFFSET ${skip}
  try {
    const artisanCompta = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    return res.status(200).json(artisanCompta);
  } catch (err) {
    return res.status(500).json({
      error_message: "internale server error",
    });
  }
}

async function getComptaByArtisan(req, res) {
  const { id } = req.params;

  const artisanCompta = await ArtisanCompta.findAll({
    where: {
      ac_artisan_id: id,
    },
  });

  return res.status(200).json(artisanCompta);
}

async function postArtisanCompta(req, res) {
  const artisanComptaInfo = req.body;

  if (!artisanComptaInfo.ac_amount || !artisanComptaInfo.ac_artisan_id)
    return res.status(400).json({
      error_message: `missing required field`,
      missing_field: [
        !artisanComptaInfo.ac_amount && "ac_amount",
        !artisanComptaInfo.ac_artisan_id && "ac_artisan_id",
      ],
    });

  try {
    const artisanCompta = await ArtisanCompta.create(artisanComptaInfo);

    return res.status(201).json({
      item: artisanCompta,
      message: "artisan's compta was created successefuly",
    });
  } catch (error) {
    return res.status(500).json({
      error_message: "internale server error",
    });
  }
}

async function deleteArtisan(req, res) {
  const { id } = req.params;

  if (!id)
    return res
      .status(204)
      .json({ error_message: "No artisan ID have been provided" });

  try {
    const conflect = [
      ...(await ArtisanCompta.findAll({ where: { ac_artisan_id: id } })),
      ...(await ProductInventory.findAll({ where: { pi_artisan_id: id } })),
      ...(await RawMatInventory.findAll({ where: { rmi_artisan_id: id } })),
    ];
    if (conflect && conflect.length !== 0) {
      return res.status(406).json({
        error_message: `artisan can't be deleted. it has ${conflect.length} instanse in the artisans compta, (and/or) product inventory, (and/or) raw material inventory Table.`,
      });
    }

    const deletedCount = await Artisans.destroy({
      where: { a_id: id },
    });

    // check if deleting count is 1
    if (deletedCount >= 1)
      return res.status(200).json({
        message: `Artisan with the ID: ${id} was deleted successfuly`,
        deletionCount: deletedCount,
      });
    return res.status(400).json({
      error_message: `Artisan with the ID: ${id} was not deleted.`,
      deletionCount: deletedCount,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error_message: "internale server error",
    });
  }
}

async function putArtisanCompta(req, res) {
  const id = req.params.id;
  const artisanComptaInfo = req.body;

  if (!artisanComptaInfo.ac_amount || !artisanComptaInfo.ac_artisan_id)
    return res.status(400).json({
      error_message: `missing required field`,
      missing_field: [
        !artisanComptaInfo.ac_amount && "ac_amount",
        !artisanComptaInfo.ac_artisan_id && "ac_artisan_id",
      ],
    });

  try {
    const conflect = await ArtisanCompta.findOne({ ac_id: id });

    if (!conflect)
      return res.status(404).json({
        message_error: `there is no artisan compta with the provided id: ${id}`,
      });

    const updatedCount = await ArtisanCompta.update(artisanComptaInfo, {
      where: {
        ac_id: id,
      },
    });
    if (updatedCount[0] !== 0)
      return res.status(201).json({
        message: "Artisan Compta updated successfully",
      });
    return res
      .status(404)
      .json({ error_message: "Artisan Compta was not updated!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error_message: "internale server error",
    });
  }
}

async function deleteArtisanCompta(req, res) {
  const { id } = req.params;

  if (!id)
    return res
      .status(204)
      .json({ error_message: "No artisan compta ID have been provided" });

  try {
    const deletedCount = await ArtisanCompta.destroy({
      where: { ac_id: id },
    });

    // check if deleting count is 1
    if (deletedCount >= 1)
      return res.status(200).json({
        message: `Artisan compta with the ID: ${id} was deleted successfuly`,
        deletionCount: deletedCount,
      });
    return res.status(400).json({
      error_message: `Artisan compta with the ID: ${id} was not deleted.`,
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
  getArtisans,
  postArtisan,
  putArtisanInfo,
  getArtisansCompta,
  getComptaByArtisan,
  postArtisanCompta,
  deleteArtisan,
  putArtisanCompta,
  deleteArtisanCompta,
};
