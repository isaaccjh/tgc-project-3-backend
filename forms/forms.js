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


const createLureForm = () => {
    return forms.create({
        "name": fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label"]
            }
        }),
        "description":fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label"]
            }
        }),
        "hook": fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label"]
            }
        }),
        "type": fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label"]
            }
        }),
        "size": fields.number({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label"]
            }
        }) ,
        "weight": fields.number({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label"]
            }
        }),
        "depth": fields.number({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label"]
            }
        }),
        // "image_url": fields.url({
        //     required: true,
        //     widget: widgets.hidden()
        // }),
        // "thumbnail_url": fields.url({
        //     required: true,
        //     widget: widgets.hidden()
        // })
    })
}