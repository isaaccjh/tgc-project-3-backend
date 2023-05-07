const { Lure, Serie, Variant, Colour, Property } = require("../models")

const getAllSeries = async () => {
    const series = await Serie.fetchAll().map(s => [s.get("id"), s.get("name")]);
    return series;
}


const getAllLures = async () => {
    const lures = await Lure.fetchAll({
        
    });
    return lures;
}

const getLureById = async (lureId) => {
    const lure = await Lure.where({
        "id": parseInt(lureId)
    }).fetch({
        require: true,
        withRelated: ["serie"]
    });
    return lure; 
}

const getAllVariantsByLureId = async (lureId) => {
    const variants = await Variant.collection().where({
        lure_id: lureId
    }).fetch({
        require: false,
        withRelated: ["lure", "colour", "property"]
    })

    return variants;
}

const getAllColours = async () => {
    const colours = await Colour.fetchAll().map(c => [c.get("id"), c.get("name")]);
    return colours;
}

const getAllProperties = async () => {
    const properties = await Property.fetchAll().map(p => [p.get("id"), p.get("name")]);
    return properties;
}

const getVariantById = async (variantId) => {
    const variant = await Variant.where({
        "id": variantId
    }).fetch({
        require: true,
        withRelated: ["colour", "property", "lure"]
    });
    return variant;
}


module.exports = {
    getAllSeries,
    getLureById,
    getAllVariantsByLureId,
    getAllColours,
    getAllProperties,
    getVariantById,
    getAllLures
}