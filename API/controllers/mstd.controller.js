const Mstd_Country = require('../models/Mstd_Country');

exports.getCountryMasters = async (req, res) => {
  try {
    const countries = await Mstd_Country.find({}).sort({ country: 1 });
    return res.status(200).json({
      success: true,
      data: countries,
    });

  } catch (error) {
    console.log("error getCountryMasters:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch country masters",
    });
  }
};