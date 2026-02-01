'use client'
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Dashboard() {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === "loading") return // Wait for session to load

        if (status === "unauthenticated") {
            router.push("/login")
        }
    }, [status, router])

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
                <div className="text-lg">Loading...</div>
            </div>
        )
    }

    if (status === "unauthenticated") {
        return null // Will redirect
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
                <p className="text-lg mb-8">Welcome, {session?.user?.name || "User"}!</p>

                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-4">Your Shortened URLs</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Dashboard content will go here - showing your URL history, analytics, etc.
                    </p>
                </div>
            </div>
        </div>
    )
}
