const { Lure, Serie } = require("../models")

const getAllSeries = async () => {
    const series = await Serie.fetchAll().map(s => [s.get("id"), s.get("name")]);
    return series;
}