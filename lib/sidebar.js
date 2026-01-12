import { PieChart, BoxIcon, Truck, Warehouse, BarChart } from "lucide-react"

const sidebar = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: PieChart, 
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
        role: ["admin", "analyst"]
    },
    {
        name: "Reports",
        href: "/reports",
        icon: BarChart,
        role: ["admin"]
    },
]

export default sidebar;