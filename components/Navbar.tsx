"use client"
import { useEffect } from "react";
import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Search, Menu, X } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu"

// --- 1. LIST ITEM COMPONENT ---
interface ListItemProps {
  className?: string;
  title: string;
  children: React.ReactNode;
  href?: string;
}

const ListItem = React.forwardRef<HTMLAnchorElement, ListItemProps>(
  ({ className, title, children, href, ...props }, ref) => {
    return (
      <li>
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
  }
)
ListItem.displayName = "ListItem"

// --- 2. MAIN NAVBAR ---
const Navbar = () => {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navbarClasses = cn(
    "fixed top-0 z-50 w-full transition-all duration-300 ease-in-out border-none",
    isScrolled || isMobileMenuOpen
      ? "bg-white text-black shadow-md py-2"
      : "bg-transparent text-white pt-1"
  )

  const navItemClasses = cn(
    "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50",
    isScrolled
      ? "text-slate-900 hover:bg-slate-100 focus:bg-slate-100 data-[active]:bg-slate-100 data-[state=open]:bg-slate-100"
      : "text-white bg-transparent hover:bg-white/10 hover:text-white focus:bg-white/10 data-[active]:bg-white/10 data-[state=open]:bg-white/10"
  )

  return (
    <header className={navbarClasses}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        {/* LEFT: LOGO */}
        <div className="flex flex-col leading-none z-50">
          <Link href="/">
            <h1 className="font-semibold text-xl">Shortify</h1>
          </Link>
        </div>

        {/* CENTER: DESKTOP MENU */}
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
                  <Link href="/dashboard" className={navItemClasses}>
                    Dashboard
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/dashboard" className={navItemClasses}>
                    Logout
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>




            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="flex md:hidden z-50">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn("p-2 focus:outline-none", (isScrolled || isMobileMenuOpen) ? "text-black" : "text-white")}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 flex flex-col p-4 animate-in slide-in-from-top-5 duration-200">
          <nav className="flex flex-col space-y-4">
            <Link href="/" className="text-lg font-medium text-slate-900 hover:text-blue-600" onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </Link>

            <Link
              href="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-medium text-slate-900 hover:text-blue-600"
            >
              Dashboard
            </Link>




            <Link href="" className="text-lg font-medium text-slate-900 hover:text-blue-600" onClick={() => setIsMobileMenuOpen(false)}>
              Logout
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Navbar
