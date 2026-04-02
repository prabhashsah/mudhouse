"use client";

import { useState, useEffect } from "react";
import { db } from "@/services/firebase";
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Mail, Trash2, CheckCircle, Clock, User, Calendar, MessageSquare, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function MessagesTab() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const markAsRead = async (id: string, current: boolean) => {
    try {
      await updateDoc(doc(db, "messages", id), { read: !current });
      toast.success(current ? "Marked as unread" : "Marked as read");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    try {
      await deleteDoc(doc(db, "messages", id));
      toast.success("Message deleted");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white/50 rounded-3xl border border-brand-100">
           <Loader2 className="animate-spin text-brand-600 mb-4" size={40} />
           <p className="font-bold text-brand-800">Fetching Messages...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white p-20 rounded-3xl text-center border-2 border-dashed border-brand-200 shadow-sm animate-in fade-in duration-500">
          <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-200">
            <MessageSquare size={40} />
          </div>
          <h3 className="text-2xl font-bold text-brand-950 mb-2">No messages</h3>
          <p className="text-brand-500 max-w-xs mx-auto">Customer enquiries from the contact form will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`bg-white p-8 rounded-3xl shadow-sm border transition-all ${msg.read ? 'border-brand-50 opacity-70' : 'border-brand-200 shadow-md ring-1 ring-brand-100'}`}>
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${msg.read ? 'bg-brand-50 text-brand-400' : 'bg-brand-600 text-white shadow-lg'}`}>
                    <User size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-950">{msg.name}</h4>
                    <div className="flex items-center gap-1 text-xs text-brand-400 mt-0.5">
                      <Calendar size={12} />
                      {msg.createdAt?.toDate().toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                   <button 
                    onClick={() => markAsRead(msg.id, msg.read)}
                    className={`p-2 rounded-lg transition-colors ${msg.read ? 'text-brand-400 hover:bg-brand-50' : 'bg-brand-50 text-brand-700 hover:bg-brand-100'}`}
                    title={msg.read ? "Mark Unread" : "Mark Read"}
                   >
                    {msg.read ? <Clock size={20} /> : <CheckCircle size={20} />}
                  </button>
                  <button 
                    onClick={() => deleteMessage(msg.id)}
                    className="p-2 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-brand-600 text-sm mb-4 font-medium">
                <Mail size={16} />
                {msg.email}
              </div>
              
              <div className="bg-brand-50/50 p-4 rounded-xl text-brand-800 text-sm leading-relaxed border border-brand-100/50">
                {msg.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
