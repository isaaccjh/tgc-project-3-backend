const { Lure, Serie, Variant, Colour, Property } = require("../models")

const getAllLures = async () => {
    return await Lure.fetchAll();
};

const getAllSeries = async () => {
    return await Serie.fetchAll();
};

const getAllProperties = async () => {
    return await Property.fetchAll();
};

const getAllColours = async () => {
    return await Colour.fetchAll();
}

module.exports = {
    getAllLures,
    getAllSeries,
    getAllProperties,
    getAllColours
};
