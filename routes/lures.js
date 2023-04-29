const express = require("express");
const router = express.Router();

const { Lure, Serie, Variant, Colour, Property } = require("../models");
const { bootstrapField, createLureForm, createVariantForm } = require("../forms");
const { updateValues } = require("../helpers/updateForm");
const { checkIfAuthenticated } = require("../middlewares");

router.get("/", async (req, res) => {
    const lure = await Lure.collection().fetch({
        withRelated: ["serie"]
    });

    res.render("lures/index", {
        "lure": lure.toJSON()
    })
});

router.get("/create", checkIfAuthenticated, async (req, res) => {
    const allSeries = await Serie.fetchAll().map(serie => {
        return [serie.get("id"), serie.get("name")]
    })

    const lureForm = createLureForm(allSeries);

    res.render("lures/create", {
        "form": lureForm.toHTML(bootstrapField)
    })
})

router.post("/create", checkIfAuthenticated,  async (req, res) => {
    const allSeries = await Serie.fetchAll().map(serie => {
        return [serie.get("id"), serie.get("name")]
    })
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
            req.flash("success_messages", `${lure.name} has been successfully updated`)
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

router.get("/:lure_id/variant", async (req, res) => {
    const variants = await Variant.collection().where({
        lure_id: req.params.lure_id
    }).fetch({
        withRelated: ["lure", "colour", "property"]
    })


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

    const variantForm = createVariantForm(allColours, allProperties, req.params.lure_id);

    res.render("variants/create", {
        "form": variantForm.toHTML(bootstrapField),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

router.post("/:lure_id/variant/create", async (req, res) => {
    
    const allColours = await Colour.fetchAll().map(colour => {
        return [colour.get("id"), colour.get("name")]
    });

    const allProperties = await Property.fetchAll().map(property => {
        return [property.get("id"), property.get("name")]
    });

    const lure = await Lure.where({
        "id": req.params.lure_id
    }).fetch({
        require: true
    })

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

router.get("/:lure_id/variant/:variant_id/update", async (req, res) => {
    const variant = await Variant.where({
        "id": req.params.variant_id
    }).fetch({
        require: true,
        withRelated: ["property", "colour", "lure"]
    })

    const allColours = await Colour.fetchAll().map(colour => {
        return [colour.get("id"), colour.get("name")]
    });

    const allProperties = await Property.fetchAll().map(property => {
        return [property.get("id"), property.get("name")]
    });

    const variantForm = createVariantForm(allColours, allProperties, req.params.lure_id);
    updateValues(variantForm.fields, variant, ["colour_id", "property_id", "stock", "cost", "image_url"])


    res.render("variants/update", {
        "form": variantForm.toHTML(bootstrapField),
        "variant": variant.toJSON(),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

router.post("/:lure_id/variant/:variant_id/update", async (req, res) => {
    const variant = await Variant.where({
        "id": req.params.variant_id
    }).fetch({
        require: true,
        withRelated: ["property", "colour"]
    });

    const allColours = await Colour.fetchAll().map(colour => {
        return [colour.get("id"), colour.get("name")]
    });

    const allProperties = await Property.fetchAll().map(property => {
        return [property.get("id"), property.get("name")]
    });

    const variantForm = createVariantForm(allColours, allProperties, req.params.lure_id);
   
    variantForm.handle(req, {
        "success": async (form) => {
            console.log(form.data)
            variant.set(form.data);
            await variant.save();
            req.flash("success_messages", `Variant #${variant.toJSON().id} has been successfully updated!`)
            res.redirect(`/lures/${req.params.lure_id}/variant`) 
        },
        "error": (form) => {
            console.log("error",form.data)
            res.render("variants/create", {
                "form": variantForm.toHTML(bootstrapField),
                "variant": variant.toJSON()
            })
        },
        "empty": (form) => {
            console.log("empty",form.data)
            res.render("variants/create", {
                "form": variantForm.toHTML(bootstrapField),
                "variant": variant.toJSON()
            })
        }
    })
})

router.get("/:lure_id/variant/:variant_id/delete", async (req, res) => {
    const variant = await Variant.where({
        "id": req.params.variant_id
    }).fetch({
        require: true,
        withRelated: ["lure", "property", "colour"]
    })

    res.render("variants/delete", {
        variant: variant.toJSON()
    })
})

router.post("/:lure_id/variant/:variant_id/delete", async (req, res) => {
    const variant = await Variant.where({
        "id": req.params.variant_id
    }).fetch({
        require: true
    })

    await variant.destroy();
    req.flash("error_messages", `Variant has successfully been deleted`);
    res.redirect(`/lures/${req.params.lure_id}/variant`)

})

module.exports = router;