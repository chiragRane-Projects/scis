"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/AuthContext"

export default function Dashboard(){
  const {user} = useAuth()
  return(
    <>
    <main className="">
      <p className="text-2xl">Welcome, <span className="font-semibold">{user.name}</span></p>
    </main>
    </>
  )
}