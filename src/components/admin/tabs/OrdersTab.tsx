"use client";

import { useState, useEffect } from "react";
import { db } from "@/services/firebase";
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from "firebase/firestore";
import { ShoppingBag, Clock, CheckCircle, Truck, User, Calendar, ChevronRight, Filter, Coffee, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-orange-100 text-orange-700 border-orange-200",
  preparing: "bg-blue-100 text-blue-700 border-blue-200",
  delivered: "bg-green-100 text-green-700 border-green-200",
};

export default function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const updateStatus = async (orderId: string, newStatus: string) => {
    const loadingToast = toast.loading(`Updating order to ${newStatus}...`);
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
      toast.success(`Order set to ${newStatus}`, { id: loadingToast });
    } catch (err: any) {
      toast.error(err.message, { id: loadingToast });
    }
  };

  const filteredOrders = statusFilter === "All" 
    ? orders 
    : orders.filter(o => o.status === statusFilter.toLowerCase());

  return (
    <div className="space-y-8">
      {/* Filter Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-brand-100 shadow-sm">
        <div className="flex items-center gap-2 px-2">
          <Filter size={18} className="text-brand-400" />
          <span className="text-sm font-bold text-brand-700">Filter Status:</span>
        </div>
        <div className="flex gap-2">
          {["All", "Pending", "Preparing", "Delivered"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                statusFilter === status 
                  ? "bg-brand-950 text-white shadow-lg" 
                  : "bg-brand-50 text-brand-600 hover:bg-brand-100"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white/50 rounded-3xl border border-brand-100">
           <Loader2 className="animate-spin text-brand-600 mb-4" size={40} />
           <p className="font-bold text-brand-800">Watching Orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white p-20 rounded-3xl text-center border-2 border-dashed border-brand-200 shadow-sm animate-in fade-in duration-500">
          <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-200">
            <ShoppingBag size={40} />
          </div>
          <h3 className="text-2xl font-bold text-brand-950 mb-2">No {statusFilter !== "All" ? statusFilter.toLowerCase() : ""} orders</h3>
          <p className="text-brand-500 max-w-xs mx-auto">When customers place orders, they will appear here in real-time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-3xl shadow-sm border border-brand-100 overflow-hidden hover:shadow-xl transition-all group">
              <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between gap-8">
                {/* Order Meta */}
                <div className="space-y-6 flex-grow">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="bg-brand-50 text-brand-900 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-brand-100">
                        Order #{order.id.slice(-6).toUpperCase()}
                      </span>
                      <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-700"}`}>
                        {order.status}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-brand-400 text-xs font-bold bg-brand-50/50 px-3 py-1 rounded-lg">
                      <Calendar size={14} />
                      {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : "Just now"}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-brand-50/30 border border-brand-50">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-brand-400 shadow-sm">
                      <User size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-brand-400">Customer</p>
                      <p className="text-lg font-bold text-brand-950">{order.customerEmail}</p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-brand-50 space-y-4 shadow-inner">
                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-400 mb-2">Order Items</p>
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center group/item">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-800 font-black text-xs">
                            {item.quantity}
                          </div>
                          <span className="font-bold text-brand-900">{item.name}</span>
                        </div>
                        <span className="font-bold text-brand-600">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="h-px bg-brand-50 my-4" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-black uppercase tracking-widest text-brand-400">Total Amount</span>
                      <span className="text-2xl font-black text-brand-950">${order.totalPrice?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Status Actions */}
                <div className="flex flex-col justify-start gap-3 md:w-64">
                  <p className="text-[10px] font-black uppercase tracking-widest text-brand-400 mb-2">Update Progress</p>
                  <button 
                    onClick={() => updateStatus(order.id, "pending")}
                    className={`flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-bold transition-all border ${order.status === 'pending' ? 'bg-orange-600 text-white border-orange-600 shadow-lg shadow-orange-600/20' : 'bg-white text-orange-600 border-orange-100 hover:bg-orange-50'}`}
                  >
                    <div className="flex items-center gap-3"><Clock size={20} /> Pending</div>
                    <ChevronRight size={18} className="opacity-40" />
                  </button>
                  <button 
                    onClick={() => updateStatus(order.id, "preparing")}
                    className={`flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-bold transition-all border ${order.status === 'preparing' ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20' : 'bg-white text-blue-600 border-blue-100 hover:bg-blue-50'}`}
                  >
                    <div className="flex items-center gap-3"><Coffee size={20} /> Preparing</div>
                    <ChevronRight size={18} className="opacity-40" />
                  </button>
                  <button 
                    onClick={() => updateStatus(order.id, "delivered")}
                    className={`flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-bold transition-all border ${order.status === 'delivered' ? 'bg-green-600 text-white border-green-600 shadow-lg shadow-green-600/20' : 'bg-white text-green-600 border-green-100 hover:bg-green-50'}`}
                  >
                    <div className="flex items-center gap-3"><CheckCircle size={20} /> Delivered</div>
                    <ChevronRight size={18} className="opacity-40" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
