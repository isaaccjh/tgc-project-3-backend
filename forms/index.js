const forms = require("forms");

const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

var bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group">' + label + widget + error + '</div>';
};


const createLureForm = (series) => {
    return forms.create({
        "name": fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label, mt-2"]
            },
            validators: [validators.required()]
        }),
        "description": fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label, mt-2"]
            },
            widget: widgets.textarea()
        }),
        "hook": fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label, mt-2"]
            }
        }),
        "type": fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label, mt-2, disabled"]
            }
        }),
        "size": fields.number({
            label: "Size (mm)",
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label, mt-2"]
            }
        }),
        "weight": fields.number({
            label: "Weight (g)",
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label, mt-2"]
            }
        }),
        "depth": fields.number({
            label: "Depth (m)",
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label, mt-2"]
            },
            placeholder: "Please put 0 if not applicable"
        }),
        "serie_id": fields.string({
            label: "Series",
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label, mt-2']
            },
            widget: widgets.select(),
            choices: series
        })
    })
}

const createVariantForm = (colours, property, lure_id) => {
    return forms.create({
        "colour_id": fields.string({
            label: "Colour",
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label, mt-2"]
            },
            widget: widgets.select(),
            choices: colours,
            validators: [validators.required()]
        }),
        "property_id": fields.string({
            label: "Property",
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label, mt-2"]
            },
            widget: widgets.select(),
            choices: property,
            validators: [validators.required()]
        }),
        "stock": fields.number({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label mt-2"]
            },
            validators: [validators.required(), validators.integer()]
        }),
        "cost": fields.number({
            label: "Cost (in cents)",
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label mt-2"]
            },
            validators: [validators.required(), validators.integer()]
        }),
        "lure_id": fields.number({
            required: true,
            errorAfterField: true,
            widget: widgets.hidden(),
            value: lure_id
        }),
        "image_url": fields.string({
            widget: widgets.hidden()
        }),
        "thumbnail_url": fields.string({
            widget: widgets.hidden()
        })
    })
}

const createRegistrationForm = () => {
    return forms.create({
        "email": fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label, mt-2"]
            },
            validators: [validators.email(), validators.required()]
        }),
        "password": fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label, mt-2"]
            },
            validators: [validators.required(), validators.minlength(8, "Your password has to be at least 8 characters long!")]
        }),
        "confirm_password": fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label, mt-2"]
            },
            validators: [validators.matchField("password"), validators.required()]
        }),
        "first_name": fields.string({
            errorAfterField: true,
            cssClasses: {
                label: ["form-label, mt-2"]
            },
            validators: [validators.maxlength(100)]
        }),
        "last_name": fields.string({
            errorAfterField: true,
            cssClasses: {
                label: ["form-label, mt-2"]
            },
            validators: [validators.maxlength(100)]
        }),
        "username": fields.string({
            errorAfterField: true,
            cssClasses: {
                label: ["form-label, mt-2"]
            },
            validators: [validators.alphanumeric()]
        }),
        "contact_number": fields.string({
            errorAfterField: true,
            cssClasses: {
                label: ["form-label, mt-2"]
            },
            validators: [validators.integer()]
        }),
        "profile_picture": fields.string({
            widget: widgets.hidden()
        })
    })
}

const createLoginForm = () => {
    return forms.create({
        "email": fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label"]
            },
            validators: [validators.email()]
        }),
        "password": fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label"]
            }
        })
    })
}

const createLureSearchForm = (series) => {
    return forms.create({
        "series": fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label"]
            },
            widget: widgets.select(),
            choices: series
        }),
        "hook": fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label"]
            }

        }),
        "type": fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label"]
            }
        }),
        "max_size": fields.number({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label"]
            }
        }),
        "min_size": fields.number({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label"]
            }
        }),
        "max_weight": fields.number({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label"]
            }
        }),
        "min_weight": fields.number({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label"]
            }
        }),
        "max_depth": fields.number({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label"]
            }
        }),
        "min_depth": fields.number({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label"]
            }
        })

    })
}

const createOrderStatusUpdateForm = (order_statuses) => {
    return forms.create({
        "order_status_id": fields.string({
            label: "Order Status",
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label"]
            },
            widget: widgets.select(),
            choices: order_statuses
        })
    })
}

const createOrderSearchForm = (order_statuses) => {
    return forms.create({
        "email": fields.string({
            label: "E-mail",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label"]
            },
            validators: [validators.email()]
        }),
        "min_total": fields.string({
            label: "Min. Total Cost ($)",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label, col-6"],
                input: ["col-6"]
            }
        }),
        "max_total": fields.string({
            label: "Max. Total Cost ($)",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label, col-6"],
                input: ["col-6"]
            }
        }),
        "order_status": fields.string({
            label: "Order Status",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label"]
            },
            widget: widgets.select(),
            choices: order_statuses
        }),
        "lure_name": fields.string({
            label: "Lure",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label"],
            }
        })
    })
}

module.exports = {
    createLureForm,
    createVariantForm,
    bootstrapField,
    createRegistrationForm,
    createLoginForm,
    createLureSearchForm,
    createOrderStatusUpdateForm,
    createOrderSearchForm
};