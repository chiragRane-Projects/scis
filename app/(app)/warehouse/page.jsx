"use client"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/AuthContext"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash, Pencil, Warehouse as WarehouseIcon, MapPin, AlertTriangle, Package, PlusCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import CreateWarehouse from "@/components/warehouse/CreateWarehouse"
import { toast } from "sonner"

export default function Warehouse() {
    const { user } = useAuth()
    const [warehouses, setWarehouses] = useState([])
    const [inventory, setInventory] = useState([])
    const [loading, setLoading] = useState(true)
    const isAdmin = user?.role === "admin"

    const fetchWarehouse = async () => {
        try {
            const res = await fetch('/api/warehouse')
            if (!res.ok) throw new Error("Failed to fetch warehouses")
            const data = await res.json()
            setWarehouses(data.warehouses || [])
        } catch (error) {
            console.error("Error fetching warehouses:", error)
            setWarehouses([])
        }
    }

    const deleteWarehouse = async (warehouseId) => {
        if (!confirm('Are you sure you want to delete this warehouse?')) return

        try {
            const res = await fetch(`/api/warehouse/${warehouseId}`, {
                method: 'DELETE'
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.message || 'Failed to delete stock')
            }

            toast.success("Warehouse Deleted")
            fetchWarehouse()
        } catch (error) {
            toast.error(error.message)
        }
    }

    const fetchInventory = async () => {
        try {
            const res = await fetch('/api/stock')
            if (!res.ok) throw new Error("Failed to fetch inventory")
            const data = await res.json()
            setInventory(data.stocks || [])
        } catch (error) {
            console.error("Error fetching inventory:", error)
            setInventory([])
        } finally {
            setLoading(false)
        }
    }

    const getWarehouseStats = (warehouseId) => {
        const warehouseItems = inventory.filter(item => item.stockWarehouse?._id === warehouseId)
        const totalItems = warehouseItems.reduce((sum, item) => sum + item.stockQuantity, 0)
        const totalValue = warehouseItems.reduce((sum, item) => sum + (item.stockQuantity * item.stockPerPrice), 0)
        return { itemCount: warehouseItems.length, totalItems, totalValue }
    }

    useEffect(() => {
        if (user) {
            fetchWarehouse()
            fetchInventory()
        }
    }, [user])

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-32" />
                </div>
                <Card>
                    <CardContent className="p-6">
                        <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                    <WarehouseIcon className="h-6 w-6" />
                    <h1 className="text-2xl font-semibold">Warehouses</h1>
                </div>
                {isAdmin && (
                    <CreateWarehouse onWarehouseCreated={fetchWarehouse} />
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Warehouse Locations</span>
                        <Badge variant="outline">{warehouses.length} Locations</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead className="hidden sm:table-cell">Items</TableHead>
                                    <TableHead className="hidden md:table-cell">Stock Value</TableHead>
                                    <TableHead className="hidden lg:table-cell">Created</TableHead>
                                    {isAdmin && <TableHead className="text-center">Actions</TableHead>}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {warehouses.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={isAdmin ? 6 : 5} className="text-center py-8 text-muted-foreground">
                                            <div className="flex flex-col items-center gap-2">
                                                <AlertTriangle className="h-8 w-8" />
                                                <span>No warehouses found</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    warehouses.map((item) => {
                                        const stats = getWarehouseStats(item._id)
                                        return (
                                            <TableRow key={item._id}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <WarehouseIcon className="h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <div>{item.warehouseName}</div>
                                                            <div className="text-sm text-muted-foreground sm:hidden">{item.warehouseLocation}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell">
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                                        {item.warehouseLocation}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell">
                                                    <div className="flex items-center gap-1">
                                                        <Package className="h-4 w-4 text-muted-foreground" />
                                                        <span>{stats.itemCount} types ({stats.totalItems} units)</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell font-mono">
                                                    ₹{stats.totalValue.toLocaleString()}
                                                </TableCell>
                                                <TableCell className="hidden lg:table-cell text-muted-foreground">
                                                    {new Date(item.createdAt).toLocaleDateString()}
                                                </TableCell>
                                                {isAdmin && (
                                                    <TableCell className="text-center">
                                                        <div className="flex justify-center gap-2">
                                                            
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-destructive hover:text-destructive"
                                                                onClick={() => deleteWarehouse(item._id)}
                                                            >
                                                                <Trash className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        )
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}