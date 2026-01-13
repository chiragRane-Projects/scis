"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PlusCircle, Package, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/lib/AuthContext"

export default function CreateStock({ onStockCreated }){
    const { user } = useAuth()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [warehouses, setWarehouses] = useState([])
    const [formData, setFormData] = useState({
        stockName: '',
        stockSKU: '',
        stockQuantity: '',
        stockPerPrice: '',
        stockWarehouse: '',
        createdBy: user.name
    })

    const fetchWarehouses = async () => {
        try {
            const res = await fetch('/api/warehouse')
            if (!res.ok) throw new Error("Failed to fetch warehouses")
            const data = await res.json()
            setWarehouses(data.warehouses || [])
        } catch (error) {
            console.error("Error fetching warehouses:", error)
            toast.error("Failed to load warehouses")
        }
    }

    useEffect(() => {
        if (open) {
            fetchWarehouses()
        }
    }, [open])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        
        try {
            const res = await fetch('/api/stock', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    stockQuantity: parseInt(formData.stockQuantity),
                    stockPerPrice: parseFloat(formData.stockPerPrice),
                    createdBy: user?.name || 'Unknown'
                })
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.message || "Failed to create stock")
            }

            toast.success("Stock created successfully")
            setFormData({
                stockName: '',
                stockSKU: '',
                stockQuantity: '',
                stockPerPrice: '',
                stockWarehouse: ''
            })
            setOpen(false)
            onStockCreated?.()
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return(
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Add Stock
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Create New Stock
                    </DialogTitle>
                    <DialogDescription>
                        Add a new item to your inventory
                    </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="stockName">Product Name</Label>
                            <Input
                                id="stockName"
                                placeholder="Enter product name"
                                value={formData.stockName}
                                onChange={(e) => handleChange('stockName', e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="stockSKU">SKU</Label>
                            <Input
                                id="stockSKU"
                                placeholder="Enter SKU"
                                value={formData.stockSKU}
                                onChange={(e) => handleChange('stockSKU', e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="stockQuantity">Quantity</Label>
                            <Input
                                id="stockQuantity"
                                type="number"
                                placeholder="0"
                                value={formData.stockQuantity}
                                onChange={(e) => handleChange('stockQuantity', e.target.value)}
                                required
                                min="0"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="stockPerPrice">Price per Unit</Label>
                            <Input
                                id="stockPerPrice"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={formData.stockPerPrice}
                                onChange={(e) => handleChange('stockPerPrice', e.target.value)}
                                required
                                min="0"
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="stockWarehouse">Warehouse</Label>
                        <Select value={formData.stockWarehouse} onValueChange={(value) => handleChange('stockWarehouse', value)} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select warehouse" />
                            </SelectTrigger>
                            <SelectContent>
                                {warehouses.map((warehouse) => (
                                    <SelectItem key={warehouse._id} value={warehouse._id}>
                                        {warehouse.warehouseName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="flex-1">
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Stock"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}