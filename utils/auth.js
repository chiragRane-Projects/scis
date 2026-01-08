import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;

export async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds)
}

export async function comparePassword(password, hashPwd){
    return await bcrypt.compare(password, hashPwd)
}

export function generateAccessToken(payload){
    return jwt.sign(payload, ACCESS_SECRET, {expiresIn: "15m"})
}

export function generateRefreshToken(payload) {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET);
}