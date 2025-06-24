"use client"
import { useState, useEffect } from "react"
import { ArrowRight, Search } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function Hero() {
    const [isLoaded, setIsLoaded] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const { data: session, status } = useSession()
    const router = useRouter()
    
    useEffect(() => {
        const timer = requestAnimationFrame(() => {
            setTimeout(() => {
                setIsLoaded(true)
            }, 50)
        })
        
        return () => cancelAnimationFrame(timer)
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        if (status === "loading") {
            // Still loading, don't do anything
            return
        }
        
        if (!session) {
            // No session, redirect to login
            router.push("/users/login")
            return
        }
        
        // User is authenticated, redirect to jobs page with search query
        router.push(`/jobs?query=${encodeURIComponent(searchQuery)}`)
    }

    return (
        <section className="pt-20 min-h-screen w-full">
            <div className="w-full min-h-screen flex flex-col items-center justify-center" style={{
                backgroundImage: "url('/blob-scene-haikei.svg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}>
                {/* Headline */}
                <div className="container -mt-64 mx-auto px-6">
                    <div className="font-brand font-black max-w-4xl mx-auto text-center">
                        <h1 className={isLoaded? "text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight transition-all duration-1400 ease-out opacity-100 translate-y-0 scale-100" : "text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight transition-all duration-1400 ease-out opacity-0 translate-y-10 scale-95"}>
                            Find Your Purpose in a 
                            <span className={isLoaded? "text-brand-primary relative inline-block transition-all duration-1400 ease-out opacity-100 translate-y-0 scale-100" : "relative inline-block text-brand-primary transition-all duratoin-1400 ease-out opacity-0 translate-y-10 scale-95"} style={{ transitionDelay: "250ms" }}>
                                <span className="relative z-10">
                                    &nbsp;Sustainable&nbsp;
                                </span>
                                <svg className={isLoaded? "absolute bottom-1 left-0 w-full h-3 text-[#95D5B2]/50 z-0 transition-all duration-2000 ease-out opacity-100" : "absolute bottom-1 left-0 w-full h-3 text-[#95D5B2]/50 z-0 transition-all duration-2000 ease-out opacity-0"}
                                    viewBox="0 0 200 8"
                                    preserveAspectRatio="none"
                                    style={{ transitionDelay: "1500ms" }}
                                >
                                    <path
                                    d="M0,5 Q40,0 80,5 T160,5 T200,5"
                                    stroke="currentColor"
                                    strokeWidth="6"
                                    fill="none"
                                    className={isLoaded? "transition-all duration-2000 ease-out stroke-dasharray-none" : "transition-all duration-2000 ease-out stroke-dasharray-[200] stroke-dashoffset-[200]"}
                                    style={{
                                        strokeDasharray: isLoaded ? "none" : "200",
                                        strokeDashoffset: isLoaded ? "0" : "200",
                                        transitionDelay: "1500ms",
                                    }}
                                    />
                                </svg>
                            </span>
                            Career
                        </h1>
                    </div>
                </div>

                {/* Search bar */}
                <form onSubmit={handleSubmit} className={isLoaded? "bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 py-4 w-full max-w-lg mx-auto transition-all duration-1400 ease-out hover:shadow-xl hover:bg-white/90 opacity-100 translate-y-0 scale-100" : "bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 max-w-4xl mx-auto transition-all duration-1400 ease-out hover:shadow-xl hover:bg-white/90 opacity-0 translate-y-10 scale-95"} style={{ transitionDelay: "550ms" }}>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 relative">
                            <Search className="absolute left-8 top-1/2 transform -translate-y-1/2 w-6 h-6"/>
                            <input 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for green jobs, companies, or keywords..." 
                                className="w-full pl-16 h-16 text-xl border-0 bg-transparent focus:outline-none transition-all duration-300"
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={status === "loading"}
                            className="mr-6 w-16 h-16 rounded-2xl bg-brand-primary hover:bg-brand-primary/70 text-white transition-all duration-300 hover:scale-110 hover:rotate-3 flex items-center justify-center group shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:rotate-0"
                        >
                            <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-0.5"/>
                        </button>
                    </div>
                </form>
            </div>
        </section>
    )
}