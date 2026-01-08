import mongoose from "mongoose";

const warehouseSchema = new mongoose.Schema({
    warehouseName: {
        type: String,
        unique: true,
        required: true
    },
    warehouseLocation: {
        type: String,
        required: true
    }
}, {timestamps: true});

const Warehouse = mongoose.models.Warehouse || mongoose.model("Warehouse", warehouseSchema);

export default Warehouse;