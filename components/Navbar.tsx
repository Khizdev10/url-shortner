"use client"
import { useEffect } from "react";
// import AOS from "aos";
import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Search, Menu, X } from "lucide-react" // Added Menu and X icons
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "./ui/navigation-menu"
// import Logo from './Currentlogocolor'

// --- 1. LIST ITEM COMPONENT (Unchanged) ---
interface ListItemProps {
    className?: string;
    title: string;
    children: React.ReactNode;
    href?: string;
}


const ListItem = React.forwardRef<HTMLAnchorElement, ListItemProps>(({ className, title, children, href, ...props }, ref) => {


    const checkLoggedIn = async() => {
      let res =   fetch("/api/auth/check", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
    }
    // useEffect(() => { AOS.init({ duration: 1000 }); }, []);
    return (
        <li >
            <NavigationMenuLink asChild>
                <Link
                    ref={ref}
                    href={href || "#"}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none text-foreground">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"

// --- 2. THE MAIN NAVBAR ---
const Navbar = () => {
    // State to track scroll position
    const [isScrolled, setIsScrolled] = React.useState(false)
    // State to track mobile menu open/close
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

    // Effect to handle scroll event
    React.useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // --- Dynamic Styles ---

    // 1. Navbar Container Style
    const navbarClasses = cn(
        "fixed top-0 z-50 w-full transition-all duration-300 ease-in-out border-none",
        isScrolled || isMobileMenuOpen // Force solid background if menu is open
            ? "bg-white text-black shadow-md py-2"
            : "bg-transparent text-white pt-1"
    )

    // 2. Link/Trigger Style (Desktop)
    const navItemClasses = cn(
        "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50",
        isScrolled
            ? "text-slate-900 hover:bg-slate-100 focus:bg-slate-100 data-[active]:bg-slate-100 data-[state=open]:bg-slate-100"
            : "text-white bg-transparent hover:bg-white/10 hover:text-white focus:bg-white/10 data-[active]:bg-white/10 data-[state=open]:bg-white/10"
    )

    // 3. Search Bar Style (Desktop)
    const searchContainerClasses = cn(
        "bg-white/20 text-white placeholder:text-gray-300 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-none w-48 transition-all hover:bg-white/30",
        isScrolled && "bg-slate-100 text-slate-900 placeholder:text-slate-500 hover:bg-slate-200"
    )

    return (
        <header className={navbarClasses}>
            <div className="container mx-auto flex h-16 items-center justify-between px-4">

                {/* LEFT: LOGO */}
                <div className="flex flex-col leading-none z-50">
                    <Link href="/">
                        {/* Pass the condition: if scrolled or mobile menu open, it should be dark (black) */}
                        {/* <Logo isDark={isScrolled || isMobileMenuOpen} /> */}
                        <h1 className="font-semibold text-xl">Shortify</h1>
                    </Link>
                </div>

                {/* CENTER: DESKTOP MENU (Hidden on Mobile) */}
                <div className="hidden md:block">
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link href="/" className={navItemClasses}>Home</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link href="/dashboard" className={navItemClasses}>Dashboard</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className={navItemClasses}>Services</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[400px] gap-3 p-4">
                                        <ListItem href="/services" title="Road Transport">Domestic and regional trucking fleet.</ListItem>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className={navItemClasses}>About Us</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[400px] gap-3 p-4">
                                        <ListItem href="/about" title="Our Story">Read about us.</ListItem>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                              
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link href="/contact" className={navItemClasses}>Contact</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* RIGHT: MOBILE MENU TOGGLE (Visible only on Mobile) */}
                <div className="flex md:hidden z-50">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={cn("p-2 focus:outline-none", (isScrolled || isMobileMenuOpen) ? "text-black" : "text-white")}
                    >
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

            </div>

            {/* --- MOBILE MENU OVERLAY --- */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 flex flex-col p-4 animate-in slide-in-from-top-5 duration-200">


                    {/* Mobile Links List */}
                    <nav className="flex flex-col space-y-4">
                        <Link href="/" className="text-lg font-medium text-slate-900 hover:text-blue-600" onClick={() => setIsMobileMenuOpen(false)}>
                            Home
                        </Link>

                        <Link href="/dashboard"  className="text-lg font-medium text-slate-900 hover:text-blue-600">
                            Dashboard
                        </Link>

                        {/* Services Section */}
                        <div className="flex flex-col space-y-2">
                            <span className="text-lg font-medium text-slate-900 opacity-80">Services</span>
                            <div className="flex flex-col pl-4 space-y-2 border-l-2 border-slate-100">
                                <Link href="/services" className="text-slate-600 hover:text-blue-600" onClick={() => setIsMobileMenuOpen(false)}>Road Transport</Link>
                            </div>
                        </div>

                        {/* About Section */}
                        <div className="flex flex-col space-y-2">
                            <span className="text-lg font-medium text-slate-900 opacity-80">About Us</span>
                            <div className="flex flex-col pl-4 space-y-2 border-l-2 border-slate-100">
                                <Link href="/about" className="text-slate-600 hover:text-blue-600" onClick={() => setIsMobileMenuOpen(false)}>Our Story</Link>
                            </div>
                        </div>

                        <Link href="/contact" className="text-lg font-medium text-slate-900 hover:text-blue-600" onClick={() => setIsMobileMenuOpen(false)}>
                            Contact
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    )
}

export default Navbar