const updateValues = (form, item, fields) => {
   return fields.forEach(field => {
        form[field].value = item.get(`${field}`)
    })
}

module.exports = { updateValues }