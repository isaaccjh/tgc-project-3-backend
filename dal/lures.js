const { Lure, Serie, Variant, Colour, Property } = require("../models")

const getAllSeries = async () => {
    const series = await Serie.fetchAll().map(s => [s.get("id"), s.get("name")]);
    return series;
}

const searchLures = async (query) => {
    const search = Lure.collection();
    if (query.name) {
        search.where("name", "like", `%${query.name}%`);
    };
    if (query.hook) {
        search.where("hook", "like", `%${query.hook}`);
    };
    if (query.type) {
        search.where("type", "like", `%${query.type}`);
    };

    if (query.min_size) {
        search.where("size", ">=", query.min_size);
    };
    if (query.max_size) {
        search.where("size", "<=", query.max_size)
    };
    if (query.min_weight) {
        search.where("weight", ">=", query.min_weight);
    };
    if (query.max_weight) {
        search.where("weight", "<=", query.max_weight)
    };
    if (query.min_depth) {
        search.where("depth", ">=", query.min_depth);
    };
    if (query.max_depth) {
        search.where("depth", "<=", query.max_depth);
    };

    if (query.colour) {
        search.query("join", "variants", "lures.id", "lure_id")
                .where("colour_id", "in", query.colour);
    };

    let result = await search.orderBy('id').fetch({
        withRelated: [
            "variant", "variant.colour", "variant.property"
        ]
    });
    return result;
}


const getAllLures = async () => {
    const lures = await Lure.fetchAll({});
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

const getAllVariants = async () => {
    const variants = await Variant.fetchAll({withRelated: ["colour", "property", "lure"]});
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
    getAllLures,
    getAllVariants,
    searchLures
}