import { PieChart, BoxIcon, Truck, Warehouse, Settings } from "lucide-react"

const sidebar = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: PieChart, // Passing the component itself, not <PieChart />
        role: ["admin", "analyst"]
    },
    {
        name: "Inventory",
        href: "/inventory",
        icon: BoxIcon,
        role: ["admin", "analyst"]
    },
    {
        name: "Orders",
        href: "/orders",
        icon: Truck,
        role: ["admin", "analyst"]
    },
    {
        name: "Warehouse",
        href: "/warehouse",
        icon: Warehouse,
        role: ["admin"]
    },
    {
        name: "Settings",
        href: "/settings",
        icon: Settings,
        role: ["admin"]
    }
]

export default sidebar;