import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import User from "@/models/users";
import { hashPassword } from "@/utils/auth";

export async function POST(req){
    const {name, username, password, role} = await req.json();

    try {
        await connectDB();

        const userExists = await User.findOne({username})
        if(userExists){
            return NextResponse.json({message: "User already Exists"}, {status: 400})
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await User.create({
            name,
            username,
            password: hashedPassword,
            role
        });

        return NextResponse.json({message: "User created successfully : ", userId: newUser._id}, {status:201});
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "Internal Server Error"}, {status: 500})
    }
}

export async function GET(){
    try {
        await connectDB()

        const users = await User.find();

        if(!users){
            return NextResponse.json({message: "No users found"}, {status: 400});
        }

        return NextResponse.json({message: "Users found", users}, {status:200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "Internal Server Error"}, {status: 500})
    }
}