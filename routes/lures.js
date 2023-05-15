const express = require("express");
const router = express.Router();

const { Lure, Variant } = require("../models");
const { bootstrapField, createLureForm, createVariantForm, createLureSearchForm } = require("../forms");
const { updateValues } = require("../helpers/updateForm");
const { checkIfAuthenticated, checkIfAdmin } = require("../middlewares");
const lureDataLayer = require("../dal/lures");

router.get("/", checkIfAuthenticated, async (req, res) => {
    const allSeries = await lureDataLayer.getAllSeries();
    allSeries.unshift([0, "----"]);

    const searchForm = createLureSearchForm(allSeries);
    const q = Lure.collection();
    searchForm.handle(req, {
        "success": async (form) => {
            if (form.data.name) {
                q.where("name", "like", `%${form.data.name}%`)
            }

            // if (form.data.series) {
            //     q.query("join", "series", "lures.serie_id", "series.id")
            //         .where("lures.name", "like", form.data.series)
            // }

            if (form.data.hook) {
                q.where("hook", "like", `%${form.data.hook}%`)
            }

            if (form.data.type) {
                q.where("type", "like", `%${form.data.type}%`)
            }

            if (form.data.min_size) {
                q.where('size', '>=', form.data.min_size)
            }

            if (form.data.max_size) {
                q = q.where('size', '<=', form.data.max_size);
            }

            if (form.data.min_weight) {
                q.where('weight', '>=', form.data.min_weight)
            }

            if (form.data.max_weight) {
                q = q.where('weight', '<=', form.data.max_weight);
            }
            if (form.data.min_depth) {
                q.where('depth', '>=', form.data.min_depth)
            }

            if (form.data.max_depth) {
                q = q.where('depth', '<=', form.data.max_depth);
            }

            let lures = await q.fetch({
                withRelated: ["serie"]
            })

            res.render("lures/index", {
                "lure": lures.toJSON(),
                "form": form.toHTML(bootstrapField)
            })
        },
        "error": async (form) => {
            let lure = await q.fetch({
                withRelated: ["serie"]
            })
            res.render("lures/index", {
                "lure": lure.toJSON(),
                "form": form.toHTML(bootstrapField)
            })
        },
        "empty": async (form) => {
            let lure = await q.fetch({
                withRelated: ["serie"]
            })
            res.render("lures/index", {
                "lure": lure.toJSON(),
                "form": form.toHTML(bootstrapField)
            })
        }
    })

})

router.get("/create", [checkIfAuthenticated, checkIfAdmin], async (req, res) => {
    const allSeries = await lureDataLayer.getAllSeries()

    const lureForm = createLureForm(allSeries);

    res.render("lures/create", {
        "form": lureForm.toHTML(bootstrapField)
    })
})

router.post("/create", [checkIfAuthenticated, checkIfAdmin], async (req, res) => {
    const allSeries = await lureDataLayer.getAllSeries()
    
    const lureForm = createLureForm(allSeries);

    lureForm.handle(req, {
        "success": async (form) => {
            const lure = new Lure(form.data)
            await lure.save();
            req.flash("success_messages", `${lure.toJSON().name} has been successfully created!`)
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

router.get("/:lure_id/update", [checkIfAuthenticated, checkIfAdmin], async (req, res) => {
    const lure = await lureDataLayer.getLureById(req.params.lure_id);

    const allSeries = await lureDataLayer.getAllSeries();

    const lureForm = createLureForm(allSeries);

    updateValues(lureForm.fields, lure, ["name", "description", "hook", "type", "size", "weight", "depth", "serie_id"]);

    res.render("lures/update", {
        "form": lureForm.toHTML(bootstrapField),
        "lure": lure.toJSON()
    })
});

router.post("/:lure_id/update", [checkIfAuthenticated, checkIfAdmin], async (req, res) => {
    const lure = await lureDataLayer.getLureById(req.params.lure_id);
    const allSeries = await lureDataLayer.getAllSeries();

    const lureForm = createLureForm(allSeries);
    lureForm.handle(req, {
        "success": async (form) => {
            lure.set(form.data);
            lure.save();
            req.flash("success_messages", "Lure has been updated")
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

router.get("/:lure_id/delete", [checkIfAuthenticated, checkIfAdmin], async (req, res) => {
    const lure = await lureDataLayer.getLureById(req.params.lure_id);

    res.render("lures/delete", {
        "lure": lure.toJSON()
    })
})

router.post("/:lure_id/delete", [checkIfAuthenticated, checkIfAdmin], async (req, res) => {
    const lure = await lureDataLayer.getLureById(req.params.lure_id)
    await lure.destroy();

    res.redirect("/lures")
})

router.get("/:lure_id/variant", checkIfAuthenticated, async (req, res) => {
    const variants = await lureDataLayer.getAllVariantsByLureId(req.params.lure_id);

    const lure = await lureDataLayer.getLureById(req.params.lure_id)

    res.render("variants/index", {
        "lure": lure.toJSON(),
        "variants": variants?.toJSON()
    })
})

router.get("/:lure_id/variant/create", [checkIfAuthenticated, checkIfAdmin], async (req, res) => {

    const allColours = await lureDataLayer.getAllColours();
    const allProperties = await lureDataLayer.getAllProperties();
    const variantForm = createVariantForm(allColours, allProperties, req.params.lure_id);

    res.render("variants/create", {
        "form": variantForm.toHTML(bootstrapField),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

router.post("/:lure_id/variant/create", [checkIfAuthenticated, checkIfAdmin], async (req, res) => {

    const allColours = await lureDataLayer.getAllColours();
    const allProperties = await lureDataLayer.getAllProperties();

    const lure = await lureDataLayer.getLureById(req.params.lure_id);

    const variantForm = createVariantForm(allColours, allProperties, req.params.lure_id)
    variantForm.handle(req, {
        "success": async (form) => {
            const variant = new Variant(form.data);
            await variant.save();
            req.flash("success_messages", `New variant of ${lure.toJSON().name} has been successfully created!`)
            res.redirect(`/lures/${req.params.lure_id}/variant`)
        },
        "error": () => {
            res.render("variants/create", {
                "form": variantForm.toHTML(bootstrapField)
            })
        },
        "empty": () => {
            res.render("variants/create", {
                "form": variantForm.toHTML(bootstrapField)
            })
        }
    })

})

router.get("/:lure_id/variant/:variant_id/update", [checkIfAuthenticated, checkIfAdmin], async (req, res) => {
    const variant = await lureDataLayer.getVariantById(req.params.variant_id);

    const allColours = await lureDataLayer.getAllColours();
    const allProperties = await lureDataLayer.getAllProperties();

    const variantForm = createVariantForm(allColours, allProperties, req.params.lure_id);
    updateValues(variantForm.fields, variant, ["colour_id", "property_id", "stock", "cost", "image_url", "thumbnail_url"])


    res.render("variants/update", {
        "form": variantForm.toHTML(bootstrapField),
        "variant": variant.toJSON(),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

router.post("/:lure_id/variant/:variant_id/update", [checkIfAuthenticated, checkIfAdmin],  async (req, res) => {
    const variant = await lureDataLayer.getVariantById(req.params.variant_id)
    const allColours = await lureDataLayer.getAllColours();
    const allProperties = await lureDataLayer.getAllProperties();
    const variantForm = createVariantForm(allColours, allProperties, req.params.lure_id);

    variantForm.handle(req, {
        "success": async (form) => {
            variant.set(form.data);
            await variant.save();
            req.flash("success_messages", `Variant #${variant.toJSON().id} has been successfully updated!`)
            res.redirect(`/lures/${req.params.lure_id}/variant`)
        },
        "error": (form) => {
            res.render("variants/create", {
                "form": variantForm.toHTML(bootstrapField),
                "variant": variant.toJSON()
            })
        },
        "empty": (form) => {
            res.render("variants/create", {
                "form": variantForm.toHTML(bootstrapField),
                "variant": variant.toJSON()
            })
        }
    })
})

router.get("/:lure_id/variant/:variant_id/delete", [checkIfAuthenticated, checkIfAdmin], async (req, res) => {
    const variant = await lureDataLayer.getVariantById(req.params.variant_id)
    res.render("variants/delete", {
        variant: variant.toJSON()
    })
})

router.post("/:lure_id/variant/:variant_id/delete", [checkIfAuthenticated, checkIfAdmin], async (req, res) => {
    const variant = await lureDataLayer.getVariantById(req.params.variant_id);
    await variant.destroy();
    req.flash("error_messages", `Variant has successfully been deleted`);
    res.redirect(`/lures/${req.params.lure_id}/variant`)

})

module.exports = router;