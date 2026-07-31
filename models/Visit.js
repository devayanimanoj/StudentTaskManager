const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({

    timestamp: {

        type: Date,

        default: Date.now

    },

    browser: {

        type: String,

        default: "Unknown"

    },

    os: {

        type: String,

        default: "Unknown"

    },

    device: {

        type: String,

        default: "Desktop"

    },

    ip: {

        type: String,

        default: "Unknown"

    }

});

module.exports = mongoose.model("Visit", visitSchema);