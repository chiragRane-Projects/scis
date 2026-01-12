import Warehouse from "@/models/warehouse";
import connectDB from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { warehouseName, warehouseLocation } = await req.json();
    try {
        await connectDB();

        const warehouseExists = await Warehouse.findOne({ warehouseName });

        if (warehouseExists) {
            return NextResponse.json({ message: "Warehouse already exists" }, { status: 400 });
        }

        const newWarehouse = await Warehouse.create({
            warehouseName,
            warehouseLocation
        });

        return NextResponse.json({ message: "Warehouse Created", warehouseId: newWarehouse._id }, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}

export async function GET() {
    try {
        await connectDB();

        const warehouse = await Warehouse.find();

        if (warehouse.length === 0) {
            return NextResponse.json({ message: "No Warehouse Found" }, { status: 404 });
        }

        return NextResponse.json(warehouse, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}