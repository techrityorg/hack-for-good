import React from 'react'

interface TopheaderProps {
    title: string; // Make sure to type the props
}

const Topheader: React.FC<TopheaderProps> = ({ title }) => {
    return (
        <header className="top-0 left-0 right-0 z-10 py-4 bg-gray-800 py-4">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">{title}</h1>
                <nav>
                    <ul className="flex space-x-6">
                        <li><a href="/" className="text-white hover:text-cyan-400 transition-colors">About</a></li>
                        <li><a href="/manage-organization" className="text-white hover:text-cyan-400 transition-colors">Manage Organization</a></li>
                        <li><a href="/track-medicine" className="text-white hover:text-cyan-400 transition-colors">Track a Medicine</a></li>
                        <li><a href="/#team" className="text-white hover:text-cyan-400 transition-colors">Our Team</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Topheader;

