const express = require("express");
const router = express.Router();

const { Lure } = require("../models");
const { bootstrapField, createLureForm } = require("../forms");
const { updateValues } = require("../helpers/updateForm")

router.get("/", async (req, res) => {
    const lures = await Lure.collection().fetch();

    res.render("lures/index", {
        "lures": lures.toJSON()
    })
});

router.get("/create", async (req, res) => {
    const lureForm = createLureForm();

    res.render("lures/create", {
        "form": lureForm.toHTML(bootstrapField)
    })
})

router.post("/create", async (req,res) => {
    const lureForm = createLureForm();

    lureForm.handle(req, {
        "success": async (form) => {
            const lure = new Lure(form.data)
            await lure.save();
            res.redirect("/lures")
        }
    })
})

router.get("/:lure_id/update", async (req, res) => {
    const lure = await Lure.where({
        "id": req.params.lure_id
    }).fetch({
        require: true
    });

    const lureForm = createLureForm();

    updateValues(lureForm.fields, lure, ["name", "description", "hook", "type", "size", "weight", "depth"]);

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

    const lureForm = createLureForm();
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

module.exports = router;