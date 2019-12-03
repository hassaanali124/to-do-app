const contact = require("../models/contacts")
exports.index = (req, res) => {
    contact.find({}).then((data) => {
        res.render("index", { data: data })
    })
}
exports.post = (req, res) => {

    contact.create({
        date: req.body.name,
        Day: req.body.email,
        task: req.body.mobile
    })
        .then(() => {
            res.redirect("/");
        })
        .catch(err => {
            console.log(err)
        })


}
exports.po = (req, res) => {
    contact.findByIdAndUpdate(req.params.id, {
        Day: req.body.Day,
        date: req.body.date,
        task: req.body.task
    })

        .then(() => {
            res.redirect("/");
        })
        .catch(err => {
            console.log(err)
        })
}
exports.delete = (req, res) => {
    contact.findByIdAndDelete(req.params.id)
        .then((contact) => {
            res.redirect("/");
        })
        .catch((err => {
            console.log(err)
        }))
}
exports.update = (req, res) => {
    contact.findById(req.params.id)
        .then((contact) => {
            res.render("update", { contact: contact })
        })
        .catch((err => {
            console.log(err)
        }))
}