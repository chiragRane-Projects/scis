import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
    stockName: {
        type: String,
        required: true
    },
    stockSKU:{
        type: String,
        required: true
    },
    stockQuantity: {
        type: Number,
        required: true
    }, 
    stockPerPrice: {
        type: Number,
        default: 100, 
        required: true
    },
    stockWarehouse: {
        type: mongoose.Types.ObjectId,
        ref: "Warehouse",
        required: true
    },
    createdBy: {
        type: String,
        required: false
    }
}, {timestamps: true});

stockSchema.index(
  { stockSKU: 1, stockWarehouse: 1 },
  { unique: true }
);

const Stock = mongoose.models.Stock || mongoose.model("Stock", stockSchema);

export default Stock;