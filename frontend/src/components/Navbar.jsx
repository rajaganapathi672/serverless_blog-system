import React from 'react';
import { Link } from 'react-router-dom';
import { PenTool, Home, User } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="bg-white border-b sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-2 text-indigo-600">
                    <PenTool size={24} />
                    <span className="font-bold text-xl tracking-tight text-gray-900">Serverless Blog</span>
                </Link>
                <div className="flex items-center space-x-6 text-gray-600 font-medium">
                    <Link to="/" className="hover:text-indigo-600 flex items-center space-x-1">
                        <Home size={18} />
                        <span>Home</span>
                    </Link>
                    <Link to="/admin" className="hover:text-indigo-600 flex items-center space-x-1">
                        <User size={18} />
                        <span>Admin</span>
                    </Link>
                    <Link to="/login" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                        Login
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
