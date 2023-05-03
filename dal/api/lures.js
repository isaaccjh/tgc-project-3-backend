const { Lure, Serie, Variant, Colour, Property } = require("../../models")

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

const addLure = async (lureData) => {
    const lure = new Lure({
        "id": lureData.id,
        "name": lureData.name,
        "description": lureData.description,
        "hook": lureData.hook,
        "type": lureData.type,
        "size": lureData.size,
        "weight": lureData.weight,
        "depth": lureData.depth,
        "serie_id": lureData.serie_id
    });
    await lure.save();
    return lure;
}

const deleteLure = async (lureId) => {
    const lure = await Lure.where({
        "id": lureId
    }).fetch({
        require: true
    });
    await lure.destroy();
    return lure;
}



module.exports = {
    getAllLures,
    getAllSeries,
    getAllProperties,
    getAllColours,
    addLure,
    deleteLure, 
};
