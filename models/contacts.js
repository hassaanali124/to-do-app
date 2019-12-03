const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const tasksSchema = new Schema({
    date: {
        type: String
    },
    Day: {
        type: String
    },
    task: {
        type: String
    }
})

module.exports = mongoose.model("tasks", tasksSchema)