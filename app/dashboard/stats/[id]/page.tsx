'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Copy, ExternalLink, Link2, MousePointerClick, Users, Clock, Globe, Monitor } from "lucide-react"

interface Click {
    id: number
    ip: string | null
    userAgent: string | null
    referer: string | null
    country: string | null
    clickedAt: string
}

interface LinkStats {
    id: number
    longUrl: string
    alias: string
    shortUrl: string
    clicks: Click[]
}

function parseBrowser(ua: string | null): string {
    if (!ua) return "Unknown"
    if (ua.includes("Chrome") && !ua.includes("Edg")) return "Chrome"
    if (ua.includes("Firefox")) return "Firefox"
    if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari"
    if (ua.includes("Edg")) return "Edge"
    if (ua.includes("Opera") || ua.includes("OPR")) return "Opera"
    return "Other"
}

function parseOS(ua: string | null): string {
    if (!ua) return "Unknown"
    if (ua.includes("Windows")) return "Windows"
    if (ua.includes("Mac OS")) return "macOS"
    if (ua.includes("Linux")) return "Linux"
    if (ua.includes("Android")) return "Android"
    if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS"
    return "Other"
}

function formatDate(dateStr: string): string {
    const d = new Date(dateStr)
    return d.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
}

export default function StatsPage() {
    const { id } = useParams<{ id: string }>()
    const router = useRouter()
    const [link, setLink] = useState<LinkStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (!id) return
        fetch(`/api/stats/${id}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.error) setError(data.error)
                else setLink(data.link)
            })
            .catch(() => setError("Failed to load stats"))
            .finally(() => setLoading(false))
    }, [id])

    const copyLink = () => {
        if (!link) return
        navigator.clipboard.writeText(link.shortUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const uniqueIps = link ? new Set(link.clicks.map((c) => c.ip)).size : 0
    const lastClick = link?.clicks[0]?.clickedAt ?? null

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                    <p className="text-gray-600 font-medium">Loading stats...</p>
                </div>
            </div>
        )
    }

    if (error || !link) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <div className="text-center">
                    <p className="text-red-500 text-lg font-semibold mb-4">{error ?? "Link not found"}</p>
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-5 flex items-center gap-4">
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition font-medium"
                    >
                        <ArrowLeft size={20} />
                        Dashboard
                    </button>
                    <div className="h-6 w-px bg-gray-300" />
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Link Analytics
                    </h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Link Info Card */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                                    alias: {link.alias}
                                </span>
                            </div>
                            <a
                                href={link.shortUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 font-bold text-xl inline-flex items-center gap-2 mt-1"
                            >
                                {link.shortUrl}
                                <ExternalLink size={18} />
                            </a>
                            <div className="mt-3 bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
                                <p className="text-xs text-gray-500 font-medium mb-0.5">Original URL</p>
                                <p className="text-gray-800 break-all text-sm">{link.longUrl}</p>
                            </div>
                        </div>
                        <button
                            onClick={copyLink}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition text-sm font-semibold text-gray-700"
                        >
                            <Copy size={16} />
                            {copied ? "Copied!" : "Copy"}
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex items-center gap-4">
                        <div className="bg-blue-100 p-4 rounded-xl">
                            <MousePointerClick className="text-blue-600" size={26} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Clicks</p>
                            <p className="text-3xl font-bold text-gray-900">{link.clicks.length}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex items-center gap-4">
                        <div className="bg-purple-100 p-4 rounded-xl">
                            <Users className="text-purple-600" size={26} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Unique IPs</p>
                            <p className="text-3xl font-bold text-gray-900">{uniqueIps}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex items-center gap-4">
                        <div className="bg-green-100 p-4 rounded-xl">
                            <Clock className="text-green-600" size={26} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Last Click</p>
                            <p className="text-base font-bold text-gray-900">
                                {lastClick ? formatDate(lastClick) : "No clicks yet"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Click History Table */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-2">
                        <Link2 size={20} className="text-blue-600" />
                        <h2 className="text-lg font-bold text-gray-900">Click History</h2>
                        <span className="ml-auto text-sm text-gray-500">{link.clicks.length} total</span>
                    </div>

                    {link.clicks.length === 0 ? (
                        <div className="p-16 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                                <MousePointerClick className="text-gray-400" size={32} />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No clicks yet</h3>
                            <p className="text-gray-500">Share your link to start collecting analytics.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            <span className="flex items-center gap-1"><Clock size={13} /> Time</span>
                                        </th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            <span className="flex items-center gap-1"><Globe size={13} /> IP Address</span>
                                        </th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            <span className="flex items-center gap-1"><Monitor size={13} /> Browser / OS</span>
                                        </th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Referrer</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {link.clicks.map((click, i) => (
                                        <tr key={click.id} className="hover:bg-blue-50/30 transition-colors">
                                            <td className="px-6 py-4 text-gray-400 font-mono text-xs">{i + 1}</td>
                                            <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                                                {formatDate(click.clickedAt)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                                                    {click.ip ?? "—"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-700">
                                                <div className="flex flex-col gap-0.5">
                                                    <span>{parseBrowser(click.userAgent)}</span>
                                                    <span className="text-xs text-gray-400">{parseOS(click.userAgent)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                                                {click.referer ? (
                                                    <a
                                                        href={click.referer}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-500 hover:underline text-xs"
                                                    >
                                                        {click.referer}
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-400">Direct</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
