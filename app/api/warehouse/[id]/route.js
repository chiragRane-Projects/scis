import Warehouse from "@/models/warehouse";
import connectDB from "@/utils/db";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
    const { id } = await params;

    const body = await req.json();

    try {
        await connectDB();

        const updatedItem = await Warehouse.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!updatedItem) {
            return NextResponse.json({ message: "Item not found" }, { status: 404 });
        }

        return NextResponse.json(updatedItem, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}

export async function DELETE(req, { params }) {
    const { id } = await params

    try {
        await connectDB();

        const deletedItem = await Warehouse.findByIdAndDelete(id);

        if (!deletedItem) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Item deleted successfully', deletedItem }, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}