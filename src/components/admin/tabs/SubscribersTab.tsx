"use client";

import { useState, useEffect } from "react";
import { db } from "@/services/firebase";
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { Mail, Trash2, Users, Download, Calendar, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function SubscribersTab() {
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "subscribers"), orderBy("subscribedAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSubs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const deleteSub = async (id: string) => {
    if (!confirm("Remove this subscriber?")) return;
    try {
      await deleteDoc(doc(db, "subscribers", id));
      toast.success("Subscriber removed");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const exportCSV = () => {
    const headers = ["Email", "Subscribed At"];
    const rows = subs.map(s => [s.email, s.subscribedAt?.toDate().toISOString()]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "subscribers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-brand-100">
        <h3 className="text-xl font-bold text-brand-950 flex items-center gap-3">
          <Users size={24} className="text-brand-600" />
          {subs.length} Active Subscribers
        </h3>
        <button 
          onClick={exportCSV} 
          disabled={subs.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-800 rounded-xl font-bold text-sm hover:bg-brand-100 transition-all border border-brand-100 disabled:opacity-50"
        >
          <Download size={18} /> Export CSV
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white/50 rounded-3xl border border-brand-100">
           <Loader2 className="animate-spin text-brand-600 mb-4" size={40} />
           <p className="font-bold text-brand-800">Syncing Emails...</p>
        </div>
      ) : subs.length === 0 ? (
        <div className="bg-white p-20 rounded-3xl text-center border-2 border-dashed border-brand-200 shadow-sm animate-in fade-in duration-500">
          <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-200">
            <Mail size={40} />
          </div>
          <h3 className="text-2xl font-bold text-brand-950 mb-2">No subscribers</h3>
          <p className="text-brand-500 max-w-xs mx-auto">Users who sign up via the footer newsletter will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-brand-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-50 border-b border-brand-100">
                <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-brand-400">Email Address</th>
                <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-brand-400">Joined On</th>
                <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-brand-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {subs.map((sub) => (
                <tr key={sub.id} className="hover:bg-brand-50/30 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-xs">
                        {sub.email[0].toUpperCase()}
                      </div>
                      <span className="font-medium text-brand-900">{sub.email}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-brand-500 text-sm">
                      <Calendar size={14} />
                      {sub.subscribedAt?.toDate().toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => deleteSub(sub.id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove Subscriber"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
