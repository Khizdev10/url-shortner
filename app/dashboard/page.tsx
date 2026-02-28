'use client'
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Search, Link2, Trash2, Copy, ExternalLink, TrendingUp, BarChart3, HomeIcon, X, ChartSpline, MousePointerClick, ChevronLeft, ChevronRight } from "lucide-react"
import Navbar from '../../components/Navbar'
interface Link {
    id: number
    longUrl: string
    alias: string
    shortUrl: string
    _count: { clicks: number }
}

import { handleShorten, copy } from "../utils/utils";
import Shortenerform from '../../components/Shortenerform'
import { navigate } from "next/dist/client/components/segment-cache/navigation"
export default function Dashboard(props: any) {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [links, setLinks] = useState<Link[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [copiedId, setCopiedId] = useState<number | null>(null)
    const [showModal, setShowModal] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const ITEMS_PER_PAGE = 5

    useEffect(() => {
        if (status === "loading") return

        if (status === "unauthenticated") {
            router.push("/login")
            return
        }

        fetchLinks()
    }, [status, router])



    const fetchLinks = async () => {
        try {
            const res = await fetch("/api/links")
            const data = await res.json()
            if (data.links) {
                console.log("LINKS INCOPMINGAAAAAAAAAAAAAAA", data.links)
                setLinks(data.links)
            }
        } catch (error) {
            console.error("Failed to fetch links:", error)
        } finally {
            setLoading(false)
        }
    }

    const deleteLink = async (id: number) => {
        if (!confirm("Are you sure you want to delete this link?")) return

        try {
            const res = await fetch("/api/links", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            })

            if (res.ok) {
                setLinks(links.filter(link => link.id !== id))
            }
        } catch (error) {
            console.error("Failed to delete link:", error)
        }
    }

    const copyToClipboard = (text: string, id: number) => {
        navigator.clipboard.writeText(text)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const filteredLinks = links.filter(link =>
        link.longUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.alias.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const totalPages = Math.max(1, Math.ceil(filteredLinks.length / ITEMS_PER_PAGE))
    const paginatedLinks = filteredLinks.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600">Loading your dashboard...</p>
                </div>
            </div>
        )
    }

    if (status === "unauthenticated") {
        return null
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Modal Overlay */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop with blur */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setShowModal(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative z-10 w-full max-w-md mx-4">
                        {/* Close button */}
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute -top-12 right-0 text-white hover:text-gray-300 transition"
                        >
                            <X size={32} />
                        </button>

                        <Shortenerform handleShorten={handleShorten} copy={copy} />
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Dashboard
                            </h1>
                            <p className="text-gray-600 mt-1">Welcome back, {session?.user?.name || "User"}!</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <a href="/" className="mr-4 flex items-center gap-2"><HomeIcon size={24} />Home</a>
                            <button
                                onClick={() => setShowModal(true)}
                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
                            >
                                Create New Link
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Total Links</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{links.length}</p>
                            </div>
                            <div className="bg-blue-100 p-4 rounded-xl">
                                <Link2 className="text-blue-600" size={28} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Active Links</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{links.length}</p>
                            </div>
                            <div className="bg-green-100 p-4 rounded-xl">
                                <TrendingUp className="text-green-600" size={28} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Total Clicks</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{links.reduce((sum, l) => sum + (l._count?.clicks ?? 0), 0)}</p>
                            </div>
                            <div className="bg-purple-100 p-4 rounded-xl">
                                <BarChart3 className="text-purple-600" size={28} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Links Section */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-100">
                    {/* Search Bar */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search links..."
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Links List */}
                    <div className="divide-y divide-gray-100">
                        {filteredLinks.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                                    <Link2 className="text-gray-400" size={32} />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {searchQuery ? "No links found" : "No links yet"}
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    {searchQuery ? "Try a different search term" : "Create your first shortened link to get started!"}
                                </p>
                                {!searchQuery && (
                                    <button
                                        onClick={() => router.push("/")}
                                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
                                    >
                                        Create Link
                                    </button>
                                )}
                            </div>
                        ) : (
                            paginatedLinks.map((link) => (
                                <div key={link.id} className="p-6 hover:bg-gray-50 transition-colors group">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            {/* Short URL */}
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="bg-blue-100 p-2 rounded-lg">
                                                    <Link2 className="text-blue-600" size={18} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <a
                                                        href={`/${link.alias}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-700 font-semibold text-lg inline-flex items-center gap-2"
                                                    >
                                                        {link.shortUrl}
                                                        <ExternalLink size={16} />
                                                    </a>
                                                    <p className="text-gray-500 text-sm mt-1">Alias: {link.alias}</p>
                                                    <span className="inline-flex items-center gap-1 mt-1 text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                                                        <MousePointerClick size={11} />
                                                        {link._count?.clicks ?? 0} {(link._count?.clicks ?? 0) === 1 ? 'click' : 'clicks'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Long URL */}
                                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                                <p className="text-gray-600 text-sm font-medium mb-1">Original URL:</p>
                                                <p className="text-gray-900 truncate">{link.longUrl}</p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => copyToClipboard(link.shortUrl, link.id)}
                                                className="p-2.5 hover:bg-blue-100 rounded-lg transition-colors group/copy"
                                                title="Copy link"
                                            >
                                                <Copy
                                                    size={18}
                                                    className={copiedId === link.id ? "text-green-600" : "text-gray-600 group-hover/copy:text-blue-600"}
                                                />


                                            </button>
                                            <button
                                                onClick={() => router.push(`/dashboard/stats/${link.id}`)}
                                                className="p-2.5 hover:bg-purple-100 rounded-lg transition-colors group/chart"
                                                title="View stats"
                                            >
                                                <ChartSpline
                                                    size={18}
                                                    className="text-gray-600 group-hover/chart:text-purple-600"
                                                />
                                            </button>
                                            <button
                                                onClick={() => deleteLink(link.id)}
                                                className="p-2.5 hover:bg-red-100 rounded-lg transition-colors group/delete"
                                                title="Delete link"
                                            >
                                                <Trash2 size={18} className="text-gray-600 group-hover/delete:text-red-600" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                                Showing <span className="font-semibold text-gray-700">{(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredLinks.length)}</span> of <span className="font-semibold text-gray-700">{filteredLinks.length}</span> links
                            </p>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    title="Previous page"
                                >
                                    <ChevronLeft size={18} className="text-gray-600" />
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${page === currentPage
                                            ? 'bg-blue-600 text-white shadow-sm'
                                            : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    title="Next page"
                                >
                                    <ChevronRight size={18} className="text-gray-600" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
