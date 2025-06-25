"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Menu, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { data: session, status } = useSession()

    return (
        <header className="fixed w-full backdrop-blur-sm">
            <div className="px-12 lg:px-24 xl:px-32 py-6">
                <div className="flex items-center justify-between mx-auto">
                    {/* Logo section */}
                    <Link href="/">
                        <div className="flex items-center gap-2">
                            {/* Logo Icon */}
                            <div>
                                <Image src="/icon0.svg" width={40} height={40} alt="Green Leaf Logo" className="w-10 h-10" priority/>
                            </div>
                            {/* Logo wordmark */}
                            <span className="font-brand text-brand-primary text-2xl font-medium tracking-tight">Greenleaf</span>
                        </div>
                    </Link>
                    {/* Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="jobs?query=">
                            All jobs
                        </Link>
                    </div>

                    {/* Login / account management buttons */}
                    { status === "loading" ? (
                        // Loading state
                        <div className="h-10 w-20 bg-gray-200 animate-pulse rounded-md"></div>
                    ) : !session? (
                        <div className="hidden md:flex items-center gap-4">
                            <Link href="/users/login">
                                <button className="text-lg text-brand-primary hover:bg-brand-primary/30 transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-4 py-2">
                                    Sign in
                                </button>
                            </Link>
                            <Link href="companies/login">
                                <button className="text-lg bg-brand-primary hover:bg-brand-primary/70 text-white transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-4 py-2">
                                    Post a job
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-4">
                            <button onClick={() => signOut()} className="text-lg text-brand-primary hover:bg-brand-primary/30 transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-4 py-2">
                                Sign out
                            </button>
                            {/* Link to user account management page (business or user) */}
                            <Link href="/">
                                <User size={16} />
                            </Link>
                        </div>
                    )}

                    {/* Mobile menu */}
                    <button 
                        className="md:hidden p-2" 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Mobile menu dropdown */}
                {mobileMenuOpen && (
                    <div className="md:hidden backdrop-blur-sm border-t border-gray-200/50">
                        {/* Login / account management buttons */}
                        { status === "loading" ? (
                            // Loading state
                            <div className="h-10 w-full bg-gray-200 animate-pulse rounded-md"></div>
                        ) : !session? (
                            <div className="container mx-auto flex flex-col gap-3">
                                <Link href="/users/login">
                                    <button className="justify-start text-lg text-brand-primary hover:bg-brand-primary/30 transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-4 py-2">
                                        Sign in
                                    </button>
                                </Link>
                                <Link href="companies/login">
                                    <button className="justify-start text-lg bg-brand-primary hover:bg-brand-primary/70 text-white transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-4 py-2">
                                        Post a job
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            <div className="container mx-auto flex flex-col gap-3">
                                <button onClick={() => signOut()} className="text-lg text-brand-primary hover:bg-brand-primary/30 transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-4 py-2">
                                    Sign out
                                </button>
                                {/* Link to user account management page (business or user) */}
                                <Link href="/">
                                    <User size={16} />
                                </Link>
                            </div>
                        )}
                    </div>                
                )}
            </div>
        </header>
    );
}