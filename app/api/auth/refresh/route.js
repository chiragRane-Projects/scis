import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import User from "@/models/users";
import { verifyRefreshToken, generateAccessToken } from "@/utils/auth";

export async function POST(req) {
    try {
        await connectDB();

        const refreshToken = req.cookies.get("refreshToken")?.value;

        if (!refreshToken) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const decoded = verifyRefreshToken(refreshToken);

        const user = await User.findById(decoded.userId);


        if (!user || user.refreshToken !== refreshToken) {
            return NextResponse.json(
                { message: "Invalid refresh token" },
                { status: 403 }
            );
        }

        const newAccessToken = generateAccessToken({
            userId: user._id,
            role: user.role,
        });

        return NextResponse.json(
            { accessToken: newAccessToken },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
      { message: "Token expired or invalid" },
      { status: 403 }
    );
    }
}