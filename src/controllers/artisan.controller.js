const { sequelize } = require("../database/sql.connect");

// const Artisan = require("../models/artisan-sql");
const Artisans = require("../models/artisan-sql");
const ArtisanCompta = require("../models/artisanCompta-sql");

async function getArtisans(req, res) {
  try {
    const artisan = await Artisans.findAll();

    return res.status(200).json(artisan);
  } catch (error) {
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
  const { id } = req.params;
  const artisanInfo = req.body;

  try {
    const artisanWithName = await Artisans.findOne({ a_id: id });
    if (!artisanWithName)
      return res.status(404).json({
        message_error: `there is no artisan with the provided id: ${id}`,
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
    return res.status(500).json({
      error_message: "internale server error",
    });
  }
}

async function getArtisansCompta(req, res) {
  let { limit, page } = req.query;
  page = page ? page : 0;
  const skip = limit * page - limit;

  console.log(limit, skip);

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
    console.log(err);
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

module.exports = {
  getArtisans,
  postArtisan,
  putArtisanInfo,
  getArtisansCompta,
  getComptaByArtisan,
  postArtisanCompta,
};
