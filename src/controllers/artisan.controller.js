const { sequelize } = require("../database/sql.connect");

const Artisan = require("../models/artisan-sql");
const Artisans = require("../models/artisan-sql");
const ArtisanCompta = require("../models/artisanCompta-sql");

async function getArtisans(req, res) {
  const artisan = await Artisans.findAll();

  return res.status(200).json(artisan);
}

async function postArtisan(req, res) {
  const artisanInfo = req.body;

  if (!artisanInfo.a_name)
    return res.status(400).json({
      error_message: "missing required field 'name'",
    });

  const artisan = await Artisans.findOne({
    where: { a_name: artisanInfo.a_name },
  });
  if (artisan)
    return res.json({
      artisan,
      error_message: `artisan with the name ${artisanInfo.a_name} already exists`,
    });
  try {
    const artisan = await Artisans.create(artisanInfo);

    return res.status(201).json(artisan);
  } catch (error) {
    return res.status(500).json({
      error_message: "artisan was not created",
    });
  }
}

async function putArtisanInfo(req, res) {
  const { id } = req.params;
  const artisanInfo = req.body;

  const updatedArtisanCount = await Artisan.update(artisanInfo, {
    where: {
      a_id: id,
    },
  });

  if (updatedArtisanCount[0] !== 0) return res.status(200).json(updatedArtisan);
}

async function getArtisansCompta(req, res) {
  const query = `
  SELECT ac.*, a.a_name FROM artisancompta ac
  LEFT JOIN artisans a
  on a.a_id = ac.ac_artisan_id
  `;
  try {
    const artisanCompta = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });
    return res.status(200).json(artisanCompta);
  } catch (err) {}
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

  console.log(artisanComptaInfo);

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

    return res.status(201).json(artisanCompta);
  } catch (error) {
    return res.status(500).json({
      error_message: "artisan compta was not created",
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
