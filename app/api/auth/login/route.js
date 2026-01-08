import { NextResponse } from "next/server";
import { comparePassword } from "@/utils/auth";
import connectDB from "@/utils/db";
import User from "@/models/users";
import { generateAccessToken, generateRefreshToken } from "@/utils/auth";

export async function POST(req) {
    const { username, password } = await req.json();
    try {
        await connectDB();

        const user = await User.findOne({ username });

        if (!user) {
            return NextResponse.json({ message: "User not found0" }, { status: 404 })
        }

        const checkPassword = await comparePassword(password, user.password);

        if (!checkPassword) {
            return NextResponse.json({ message: "Invalid password" }, { status: 401 })
        }

        const payload = {
            userId: user._id,
            role: user.role,
        }

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        user.refreshToken = refreshToken;
        await user.save();

        const response = NextResponse.json(
            {
                message: "Logged in successfully",
                accessToken,
                user: {
                    id: user._id,
                    name: user.name,
                    role: user.role,
                },
            },
            { status: 200 }
        );

        response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60, 
        });

        return response;
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}