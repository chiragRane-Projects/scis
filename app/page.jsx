"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  EyeIcon,
  EyeOff,
  Box,
  Loader2
} from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/AuthContext"
import ModeToggle from "@/components/layout/themeToggle"

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(username, password); 
      toast.success("Login successful");
      
      // Force navigation with window.location for mobile compatibility
      if (typeof window !== 'undefined') {
        window.location.href = '/dashboard';
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      toast.error(err.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen lg:grid lg:grid-cols-2">
      <div className="absolute inset-0 z-0 lg:hidden">
        <img
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop"
          alt="Warehouse Mobile Background"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-[2px]" />
      </div>

      <div className="hidden relative lg:flex flex-col justify-between p-10 text-white dark:border-r bg-zinc-900">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop"
            alt="Warehouse"
            className="h-full w-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-20 flex items-center text-lg font-medium">
          <Box className="mr-2 h-6 w-6 text-white" />
          SmartInventory
        </div>

        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2 border-l-2 border-white/50 pl-6">
            <p className="text-lg italic text-zinc-100">
              &ldquo;Real-time tracking is not just about knowing where your stock is, but knowing where your business is going.&rdquo;
            </p>
            <footer className="text-sm text-zinc-300 font-medium">System Admin</footer>
          </blockquote>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-12 bg-transparent lg:bg-background">

        <div className="absolute right-4 top-4 md:right-8 md:top-8 text-white lg:text-foreground">
          <ModeToggle />
        </div>

        <div className="mb-6 flex flex-col items-center gap-2 lg:hidden">
          <div className="bg-primary/10 p-3 rounded-full backdrop-blur-sm border border-white/10">
            <Box className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">SmartInventory</h1>
        </div>

        <Card className="mx-auto w-[90%] max-w-[400px] border-0 shadow-2xl bg-background/90 backdrop-blur-md sm:border sm:bg-card/100">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
            <CardDescription>
              Enter your credentials to access the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="admin"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="pr-10 bg-background/50"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}