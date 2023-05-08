const express = require("express");
const router = express.Router();

const { Lure } = require("../../models");
const { createLureForm } = require("../../forms")

const lureDataLayer = require("../../dal/lures");
const { checkIfAuthenticated } = require("../../middlewares");

router.get("/", async (req, res) => {
    res.send(await lureDataLayer.getAllLures());
});

router.get("/:lure_id", async (req, res) => {
    const lures = await lureDataLayer.getAllVariantsByLureId(req.params.lure_id);
    res.send(lures);
})

router.post("/", checkIfAuthenticated,  async (req, res) => {
    const allSeries = await lureDataLayer.getAllSeries()
    const lureForm = createLureForm(allSeries);

    lureForm.handle(req, {
        "success": async (form) => {
            const lure = new Lure(form.data);
            await lure.save();
            res.send(lure);
        }, 
        "error": async (form) => {
            let errors = {};
            for (let key in form.fields) {
                if (form.fields[key].error) {
                    errors[key] = form.fields[key].error
                }
            }
            res.send(JSON.stringify(errors))
        }
    })
})


module.exports = router;