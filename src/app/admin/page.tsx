"use client";

import { useState, useEffect } from "react";
import { auth } from "@/services/firebase";
import { signOut, onAuthStateChanged, User } from "firebase/auth";
import { LogOut, LayoutDashboard, Utensils, ShoppingBag, MessageSquare, Users, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProductsTab from "@/components/admin/tabs/ProductsTab";
import OrdersTab from "@/components/admin/tabs/OrdersTab";
import MessagesTab from "@/components/admin/tabs/MessagesTab";
import SubscribersTab from "@/components/admin/tabs/SubscribersTab";
import ReviewsTab from "@/components/admin/tabs/ReviewsTab";
import SettingsTab from "@/components/admin/tabs/SettingsTab";
import { Settings } from "lucide-react";

const ADMIN_EMAIL = "sahprabhas293@gmail.com";

type AdminTab = "products" | "orders" | "messages" | "subscribers" | "reviews" | "settings";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("products");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser || currentUser.email !== ADMIN_EMAIL) {
        window.location.href = "/";
        return;
      }
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-sand text-brand-950 font-sans">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-800 mb-4"></div>
          <p className="font-bold tracking-tight">Accessing Secure Vault...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "products", label: "Database Items", icon: Utensils },
    { id: "orders", label: "Live Orders", icon: ShoppingBag },
    { id: "messages", label: "Customer Messages", icon: MessageSquare },
    { id: "subscribers", label: "Newsletter List", icon: Users },
    { id: "reviews", label: "User Reviews", icon: Star },
    { id: "settings", label: "Site Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-sand pt-12 pb-12">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header Section - Polished Content Manager Look */}
        <div className="bg-white p-8 rounded-3xl shadow-xl mb-12 flex flex-col md:flex-row justify-between items-center border border-brand-100">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h1 className="text-xl font-bold text-brand-400 uppercase tracking-[0.3em] mb-2">The Mud House</h1>
            <h2 className="text-4xl font-black text-brand-950 tracking-tight mb-2">Content Manager</h2>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-xs font-bold text-brand-600">Admin Verified: {user?.email}</span>
            </div>
          </div>
          <div className="flex gap-4">
             <Link href="/" className="flex items-center gap-2 px-6 py-3 bg-brand-50 text-brand-800 rounded-xl hover:bg-brand-100 transition-all font-bold text-sm border border-brand-200">
               Visit Store
             </Link>
             <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 px-6 py-3 bg-brand-950 text-white rounded-xl hover:bg-brand-800 transition-all font-bold text-sm shadow-lg shadow-brand-900/20"
            >
              <LogOut size={18} /> Secure Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-md p-4 rounded-3xl shadow-xl border border-brand-100 flex flex-col gap-2 sticky top-12">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-400 px-4 mb-2">Management</p>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as AdminTab)}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all ${
                    activeTab === tab.id 
                      ? "bg-brand-950 text-white shadow-xl translate-x-2" 
                      : "text-brand-600 hover:bg-brand-50 hover:text-brand-900"
                  }`}
                >
                  <tab.icon size={20} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9 animate-in fade-in slide-in-from-right-4 duration-500">
            {activeTab === "products" && <ProductsTab />}
            {activeTab === "orders" && <OrdersTab />}
            {activeTab === "messages" && <MessagesTab />}
            {activeTab === "subscribers" && <SubscribersTab />}
            {activeTab === "reviews" && <ReviewsTab />}
            {activeTab === "settings" && <SettingsTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
