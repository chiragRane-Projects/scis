"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { toast } from "sonner"
import { PlusCircle, Warehouse, Loader2 } from "lucide-react"

export default function CreateWarehouse({ onWarehouseCreated }) {
    const [formData, setFormData] = useState({
        warehouseName: '',
        warehouseLocation: '',
    });
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/warehouse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            if (!res.ok) {
                throw new Error("Failed to create warehouse")
            }

            toast.success("Warehouse created successfully")
            setFormData({
                warehouseName: '',
                warehouseLocation: ''
            })
            setOpen(false)
            onWarehouseCreated?.()
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                    <PlusCircle className="h-4 w-4"/>
                    Add Warehouse
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Warehouse className="h-5 w-5"/>
                        Create new Warehouse
                    </DialogTitle>
                    <DialogDescription>
                        Add a new warehouse
                    </DialogDescription>
                </DialogHeader>
                <form  onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="warehouseName">Warehouse Name</Label>
                            <Input
                                id="warehouseName"
                                placeholder="Enter warehouse name"
                                value={formData.warehouseName}
                                onChange={(e) => handleChange('warehouseName', e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="warehouseLocation">Warehouse Location</Label>
                            <Input
                                id="warehouseLocation"
                                placeholder="Enter warehouse location"
                                value={formData.warehouseLocation}
                                onChange={(e) => handleChange('warehouseLocation', e.target.value)}
                                required
                            />
                        </div>
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
                                "Create Warehouse"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}