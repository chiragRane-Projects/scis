"use client"
import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableRow, TableHeader, TableHead } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/AuthContext"
import { Button } from "@/components/ui/button"
import { Pencil, Trash, Package, AlertTriangle, Filter } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CreateStock from "@/components/inventory/CreateStock"
import EditStock from "@/components/inventory/EditStock"
import { toast } from "sonner"

export default function Inventory(){
    const { user } = useAuth()
    const [inventory, setInventory] = useState([])
    const [loading, setLoading] = useState(true)
    const [warehouses, setWarehouses] = useState([])
    const [selectedWarehouse, setSelectedWarehouse] = useState("all")
    const isAdmin = user?.role === "admin"

    const fetchInventory = async () => {
        try {
            const res = await fetch("/api/stock")
            if (!res.ok) throw new Error("Failed to fetch inventory")
            const data = await res.json()
            setInventory(data.stocks || [])
        } catch (error) {
            console.error("Error fetching inventory:", error)
        } finally {
            setLoading(false)
        }
    }

    const fetchWarehouses = async () => {
        try {
            const res = await fetch("/api/warehouse")
            if (!res.ok) throw new Error("Failed to fetch warehouses")
            const data = await res.json()
            setWarehouses(data.warehouses || [])
        } catch (error) {
            console.error("Error fetching warehouses:", error)
        }
    }

    useEffect(() => {
        fetchInventory()
        fetchWarehouses()
    }, [])

    const filteredInventory = selectedWarehouse === "all" 
        ? inventory 
        : inventory.filter(item => item.stockWarehouse?._id === selectedWarehouse)

    const getStockStatus = (quantity) => {
        if (quantity === 0) return { label: "Out of Stock", variant: "destructive" }
        if (quantity < 10) return { label: "Low Stock", variant: "secondary" }
        return { label: "In Stock", variant: "default" }
    }

    const getTotalValue = () => {
        return filteredInventory.reduce((total, item) => total + (item.stockQuantity * item.stockPerPrice), 0)
    }

    const getLowStockCount = () => {
        return filteredInventory.filter(item => item.stockQuantity < 10 && item.stockQuantity > 0).length
    }

    const getOutOfStockCount = () => {
        return filteredInventory.filter(item => item.stockQuantity === 0).length
    }

    const handleDeleteStock = async (stockId) => {
        if (!confirm('Are you sure you want to delete this stock item?')) return
        
        try {
            const res = await fetch(`/api/stock/${stockId}`, {
                method: 'DELETE'
            })
            
            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.message || 'Failed to delete stock')
            }
            
            toast.success('Stock deleted successfully')
            fetchInventory()
        } catch (error) {
            toast.error(error.message)
        }
    }

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
            <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-2">
                    <Package className="h-6 w-6" />
                    <h1 className="text-2xl font-semibold">Inventory</h1>
                </div>
                {isAdmin && <CreateStock onStockCreated={fetchInventory} />}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Items</p>
                                <p className="text-2xl font-bold">{filteredInventory.length}</p>
                            </div>
                            <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Value</p>
                                <p className="text-2xl font-bold">₹{getTotalValue().toLocaleString()}</p>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                <span className="text-green-600 font-bold">$</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Low Stock</p>
                                <p className="text-2xl font-bold text-yellow-600">{getLowStockCount()}</p>
                            </div>
                            <AlertTriangle className="h-8 w-8 text-yellow-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Out of Stock</p>
                                <p className="text-2xl font-bold text-red-600">{getOutOfStockCount()}</p>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                                <span className="text-red-600 font-bold">!</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Stock Overview</span>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4" />
                                <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Warehouses</SelectItem>
                                        {warehouses.map((warehouse) => (
                                            <SelectItem key={warehouse._id} value={warehouse._id}>
                                                {warehouse.warehouseName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Badge variant="outline">{filteredInventory.length} Items</Badge>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead className="hidden sm:table-cell">SKU</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead className="hidden md:table-cell">Price</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="hidden lg:table-cell">Warehouse</TableHead>
                                    <TableHead className="hidden xl:table-cell">Created By</TableHead>
                                    {isAdmin && <TableHead className="text-center">Actions</TableHead>}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredInventory.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={isAdmin ? 8 : 7} className="text-center py-8 text-muted-foreground">
                                            <div className="flex flex-col items-center gap-2">
                                                <AlertTriangle className="h-8 w-8" />
                                                <span>No inventory items found</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredInventory.map((item) => {
                                        const status = getStockStatus(item.stockQuantity)
                                        return (
                                            <TableRow key={item._id}>
                                                <TableCell className="font-medium">
                                                    <div>
                                                        <div className="font-medium">{item.stockName}</div>
                                                        <div className="text-sm text-muted-foreground sm:hidden">{item.stockSKU}</div>
                                                        <div className="text-sm text-muted-foreground md:hidden">₹{item.stockPerPrice}</div>
                                                        <div className="text-sm text-muted-foreground xl:hidden">By: {item.createdBy || 'N/A'}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell text-muted-foreground">
                                                    {item.stockSKU}
                                                </TableCell>
                                                <TableCell className="font-mono">{item.stockQuantity}</TableCell>
                                                <TableCell className="hidden md:table-cell font-mono">
                                                    ₹{item.stockPerPrice}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={status.variant}>{status.label}</Badge>
                                                </TableCell>
                                                <TableCell className="hidden lg:table-cell">
                                                    {item.stockWarehouse?.warehouseName || 'N/A'}
                                                </TableCell>
                                                <TableCell className="hidden xl:table-cell text-muted-foreground">
                                                    {item.createdBy || 'N/A'}
                                                </TableCell>
                                                {isAdmin && (
                                                    <TableCell className="text-center">
                                                        <div className="flex justify-center gap-2">
                                                            <EditStock stock={item} onStockUpdated={fetchInventory} />
                                                            <Button 
                                                                variant="ghost" 
                                                                size="sm" 
                                                                className="text-destructive hover:text-destructive"
                                                                onClick={() => handleDeleteStock(item._id)}
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