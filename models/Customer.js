const mongoose = require("mongoose")

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;


const CustomerSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    id: {
        type: String,
        required: true,
    },
    currBalance: Number,
    accNumber: Number
});

mongoose.set('useFindAndModify', false);
module.exports = mongoose.model("Customers", CustomerSchema);