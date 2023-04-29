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
            }
        }),
        "description":fields.string({
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
        }) ,
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
            choices: colours
        }),
        "property_id": fields.string({
            label: "Property",
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label, mt-2"]
            },
            widget: widgets.select(),
            choices: property
        }),
        "stock": fields.number({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label mt-2"]
            }
        }),
        "cost": fields.number({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label mt-2"]
            }
        }),
        "lure_id": fields.number({
            required: true,
            errorAfterField: true,
            widget: widgets.hidden(),
            value: lure_id
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
            }
        }),
        "password": fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label, mt-2"]
            }
        }),
        "confirm_password": fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label, mt-2"]
            },
            validators: [validators.matchField("password")]
        }),
        "first_name": fields.string({
            errorAfterField: true,
            cssClasses: {
                label: ["form-label, mt-2"]
            }
        }),
        "last_name": fields.string({
            errorAfterField: true,
            cssClasses: {
                label: ["form-label, mt-2"]
            }
        }),
        "username": fields.string({
            errorAfterField: true,
            cssClasses: {
                label: ["form-label, mt-2"]
            }
        }),
        "contact_number": fields.string({
            errorAfterField: true,
            cssClasses: {
                label: ["form-label, mt-2"]
            }
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
            }
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


module.exports = { 
    createLureForm, 
    createVariantForm, 
    bootstrapField, 
    createRegistrationForm,
    createLoginForm

 };