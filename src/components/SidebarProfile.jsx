import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SidebarProfile = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut();
            toast.success("Logged out successfully!");
            navigate("/signin");
        } catch (error) {
            toast.error("Logout failed. Please try again.");
            console.error("Logout error:", error);
        }
    };

    const isAdminVerified = sessionStorage.getItem("admin_verified") === "true";
    const adminEmail = sessionStorage.getItem("admin_email") || "admin@bluecare.com";

    if (!user && !isAdminVerified) return null;

    // Prioritize admin details if they are in the admin dashboard (verified)
    // Otherwise fallback to regular user details
    let displayUser = user || {};
    
    if (isAdminVerified) {
        displayUser = {
            name: 'Administrator',
            email: adminEmail
        };
    } else if (user) {
         displayUser = {
             name: user.name || user.displayName || 'User',
             email: user.email
         }
    }

    const initials = (displayUser.name && displayUser.name.trim())
        ? displayUser.name.trim().split(' ').map(n => n[0]).join('').toUpperCase()
        : (displayUser.email ? displayUser.email[0].toUpperCase() : 'U');

    return (
        <div className="p-4 border-t border-gray-50 bg-white">
            <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm overflow-hidden">
                    {initials}
                </div>
                <div className="flex-1 overflow-hidden flex flex-col justify-center min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 truncate leading-tight">
                        {displayUser.name || 'User'}
                    </h4>
                    {displayUser.email && (
                        <p className="text-[10px] text-gray-500 truncate leading-tight mt-0.5">
                            {displayUser.email}
                        </p>
                    )}
                </div>
                <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Logout"
                >
                    <LogOut className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default SidebarProfile;
