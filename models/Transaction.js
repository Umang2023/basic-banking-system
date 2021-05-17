const mongoose = require("mongoose")

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const TransactionSchema = Schema({
    Name1: {
        type: String,
        required: true,
    },
    Acc1: {
        type: Number,
        required: true,
    },
    Name2: {
        type: String,
        required: true,
    },
    Acc2: {
        type: Number,
        required: true,
    },
    transferred: Number
});

mongoose.set('useFindAndModify', false);
module.exports = mongoose.model("Transactions", TransactionSchema);