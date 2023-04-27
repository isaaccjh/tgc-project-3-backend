const express = require("express");
const router = express.Router();

const { Lure, Serie, Variant, Colour, Property } = require("../models");
const { bootstrapField, createLureForm, createVariantForm } = require("../forms");
const { updateValues } = require("../helpers/updateForm")

router.get("/", async (req, res) => {
    const lure = await Lure.collection().fetch({
        withRelated: ["serie"]
    });

    res.render("lures/index", {
        "lure": lure.toJSON()
    })
});

router.get("/create", async (req, res) => {
    const allSeries = await Serie.fetchAll().map(serie => {
        return [serie.get("id"), serie.get("name")]
    })

    const lureForm = createLureForm(allSeries);

    res.render("lures/create", {
        "form": lureForm.toHTML(bootstrapField)
    })
})

router.post("/create", async (req, res) => {
    const allSeries = await Serie.fetchAll().map(serie => {
        return [serie.get("id"), serie.get("name")]
    })
    const lureForm = createLureForm(allSeries);

    lureForm.handle(req, {
        "success": async (form) => {
            const lure = new Lure(form.data)
            await lure.save();
            res.redirect("/lures")
        },
        "error": () => {
            res.render("lures/create", {
                "form": lureForm.toHTML(bootstrapField)
            })
        },
        "empty": () => {
            res.render("lures/create", {
                "form": lureForm.toHTML(bootstrapField)
            })
        }
    })
})

router.get("/:lure_id/update", async (req, res) => {
    const lure = await Lure.where({
        "id": req.params.lure_id
    }).fetch({
        require: true
    });

    const allSeries = await Serie.fetchAll().map(serie => {
        return [serie.get("id"), serie.get("name")]
    });


    const lureForm = createLureForm(allSeries);

    updateValues(lureForm.fields, lure, ["name", "description", "hook", "type", "size", "weight", "depth", "serie_id"]);

    res.render("lures/update", {
        "form": lureForm.toHTML(bootstrapField),
        "lure": lure.toJSON()
    })
});

router.post("/:lure_id/update", async (req, res) => {
    const lure = await Lure.where({
        "id": req.params.lure_id
    }).fetch({
        require: true
    });

    const allSeries = await Serie.fetchAll().map(serie => {
        return [serie.get("id"), serie.get("name")]
    })

    const lureForm = createLureForm(allSeries);
    lureForm.handle(req, {
        "success": async (form) => {
            lure.set(form.data);
            lure.save();
            res.redirect("/lures")
        },
        "error": async (form) => {
            res.render("lures/update", {
                "form": form.toHTML(bootstrapField),
                "lure": lure.toJSON()
            })
        },
        "empty": async (form) => {
            res.render("lures/update", {
                "form": form.toHTML(bootstrapField),
                "lure": lure.toJSON()
            })
        }
    })
})

router.get("/:lure_id/delete", async (req, res) => {
    const lure = await Lure.where({
        "id": req.params.lure_id
    }).fetch({
        require: true
    });

    res.render("lures/delete", {
        "lure": lure.toJSON()
    })
})

router.post("/:lure_id/delete", async (req, res) => {
    const lure = await Lure.where({
        "id": req.params.lure_id
    }).fetch({
        require: true
    })

    await lure.destroy();
    res.redirect("/lures")
})

router.get("/:lure_id/variants", async (req, res) => {
    let variants;
    try {
        variants = await Variant.where({
            "lure_id": req.params.lure_id
        }).fetch()
    } catch (e) {
        null;
    }

    const lure = await Lure.where({
        "id": req.params.lure_id
    }).fetch({
        require: true
    });

    res.render("variants/index", {
        "lure": lure.toJSON(),
        "variants": variants?.toJSON()
    })
})

router.get("/:lure_id/variant/create", async (req, res) => {

    const allColours = await Colour.fetchAll().map(colour => {
        return [colour.get("id"), colour.get("name")]
    });

    const allProperties = await Property.fetchAll().map(property => {
        return [property.get("id"), property.get("name")]
    });

    const variantForm = createVariantForm(allColours, allProperties);

    res.render("variants/create", {
        "form": variantForm.toHTML(bootstrapField)
    })
})

router.post("/:lure_id/variant/create", async (req, res) => {
    

})

module.exports = router;