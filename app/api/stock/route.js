import Stock from "@/models/stock";
import connectDB from "@/utils/db";
import { NextResponse } from "next/server";
import Warehouse from "@/models/warehouse";

export async function GET(){
    try {
        await connectDB();

        const stocks = await Stock.find().populate("stockWarehouse");

        if(stocks.length === 0){
            return NextResponse.json({message: "No stocks found"}, {status: 400});
        }

        return NextResponse.json({message: "Stocks found", stocks}, {status: 200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "Internal Server Error"}, {status: 500})
    }
}

export async function POST(req){
    const {stockName, stockSKU, stockQuantity, stockPerPrice, stockWarehouse} = await req.json();
    try {
        await connectDB();

        const stockExists = await Stock.findOne({stockSKU, stockWarehouse});

        if(stockExists){
            return NextResponse.json({message: "Stock already exists"}, {status: 400});
        }

        const newStock = await Stock.create({
            stockName,
            stockSKU,
            stockQuantity,
            stockPerPrice, 
            stockWarehouse
        })

        return NextResponse.json({message: "Stock created", stockId: newStock._id}, {status:201});
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "Internal Server Error"}, {status: 500})
    }
}