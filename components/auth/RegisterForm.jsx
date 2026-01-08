"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Card, CardAction, CardContent } from "../ui/card"
import { toast } from "sonner"

export default function RegisterForm() {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/register', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({name, username, password, role})
            });

            if(!res.ok){
                const data = await res.json();
                setError(data.message)
                console.log(data);
                toast.error(data);
            } else  {
                toast.success("User registered");
                router.push("/dashboard")
            }
        } catch (error) {
            setError("Failed to register user");
        }
    };

    return(
        <>
        
        </>
    )
}