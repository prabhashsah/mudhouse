"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/services/firebase";
import { signOut, onAuthStateChanged, User } from "firebase/auth";
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { Plus, Trash2, LogOut, Edit2, X, Save, Image as ImageIcon } from "lucide-react";
import Login from "@/components/auth/Login";
import Signup from "@/components/auth/Signup";
import { useRouter } from "next/navigation";

const ADMIN_EMAIL = "sahprabhas293@gmail.com";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoginMode, setIsLoginMode] = useState(true);
  
  const [items, setItems] = useState<any[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  
  // Add / Edit form states
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  
  // UI States
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingInitial(false);
      
      if (currentUser) {
        if (currentUser.email !== ADMIN_EMAIL) {
          console.warn("Unauthorized user attempted to access admin. Redirecting...");
          // In a real app we might redirect entirely, for now just show error
        } else {
          console.log("Admin verified. Fetching items...");
          // Fetch from "items" collection
          const q = query(collection(db, "items"), orderBy("createdAt", "desc"));
          const unsubItems = onSnapshot(q, (snapshot) => {
            const fetchedItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log("Fetched items:", fetchedItems.length);
            setItems(fetchedItems);
          });
          return () => unsubItems();
        }
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    console.log("Logging out admin");
    await signOut(auth);
  };

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setImageUrl("");
    setEditingId(null);
    setIsAdding(false);
    setErrorMsg("");
  };

  const startEdit = (item: any) => {
    setTitle(item.title);
    setDescription(item.description);
    setPrice(item.price.toString());
    setImageUrl(item.imageUrl || "");
    setEditingId(item.id);
    setIsAdding(true);
    setSuccessMsg("");
    setErrorMsg("");
  };

  const handleAddMode = () => {
    clearForm();
    setIsAdding(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (editingId) {
        console.log("Updating item:", editingId);
        await updateDoc(doc(db, "items", editingId), {
          title,
          description,
          price: parseFloat(price) || 0,
          imageUrl
        });
        setSuccessMsg("Item updated successfully!");
        console.log("Update success!");
      } else {
        console.log("Adding new item to Firestore database");
        await addDoc(collection(db, "items"), {
          title,
          description,
          price: parseFloat(price) || 0,
          imageUrl,
          createdAt: serverTimestamp()
        });
        setSuccessMsg("Item added successfully!");
        console.log("Add success!");
      }
      clearForm();
    } catch (err: any) {
      console.error("Firestore operation failed:", err);
      setErrorMsg(err.message || "Operation failed.");
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (confirm("Are you sure you want to permanently delete this item?")) {
      setProcessing(true);
      try {
        console.log("Deleting item:", id);
        await deleteDoc(doc(db, "items", id));
        setSuccessMsg("Item deleted successfully!");
        console.log("Delete success!");
      } catch (err: any) {
        console.error("Delete failed:", err);
        setErrorMsg(err.message || "Failed to delete item.");
      } finally {
        setProcessing(false);
      }
    }
  };

  if (loadingInitial) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-800 mb-4"></div>
          <p className="text-gray-600">Loading Admin Portal...</p>
        </div>
      </div>
    );
  }

  // Display authentication components if not logged in
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-gray-200">
          <div className="text-center mb-6 border-b border-gray-100 pb-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Gateway</h1>
            <p className="text-sm text-gray-500 mt-1">Authorized access only.</p>
          </div>
          {isLoginMode ? (
            <Login onToggleMode={() => setIsLoginMode(false)} />
          ) : (
            <Signup onToggleMode={() => setIsLoginMode(true)} />
          )}
        </div>
      </div>
    );
  }

  // Protect against non-admin emails
  if (user.email !== ADMIN_EMAIL) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-700 mb-6">Your email ({user.email}) is not authorized to view the admin dashboard.</p>
          <button onClick={handleLogout} className="bg-gray-800 text-white px-6 py-2 rounded shadow hover:bg-gray-900">
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // Final Admin Dashboard Content
  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Manager</h1>
          <p className="text-green-600 text-sm mt-1 font-medium flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span> Admin Verified: {user.email}
          </p>
        </div>
        <button onClick={handleLogout} className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-red-50 text-red-700 rounded-lg border border-red-100 hover:bg-red-100 transition-colors shadow-sm">
          <LogOut size={18} className="mr-2" /> Secure Logout
        </button>
      </div>

      {errorMsg && <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700 rounded shadow-sm">{errorMsg}</div>}
      {successMsg && <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 text-green-700 rounded shadow-sm">{successMsg}</div>}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Database Items</h2>
          {!isAdding && (
            <button onClick={handleAddMode} className="flex items-center px-4 py-2 bg-brand-800 text-white rounded-lg shadow hover:bg-brand-900 transition-all hover:scale-105" disabled={processing}>
              <Plus size={18} className="mr-2" /> Create New Item
            </button>
          )}
        </div>

        {isAdding && (
          <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-200 p-6 rounded-xl mb-8">
            <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-3">
              <h3 className="text-lg font-bold text-gray-800">{editingId ? "Edit Item" : "Add New Item"}</h3>
              <button type="button" onClick={clearForm} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm mb-1 text-gray-700 font-medium">Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} disabled={processing} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50" required placeholder="e.g. Vanilla Latte"/>
              </div>
              
              <div>
                <label className="block text-sm mb-1 text-gray-700 font-medium">Price (Number)</label>
                <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} disabled={processing} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50" required placeholder="5.50"/>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm mb-1 text-gray-700 font-medium">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} disabled={processing} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50 resize-none h-24" required placeholder="A delicious blend of..."/>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm mb-1 text-gray-700 font-medium">Image URL</label>
                <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} disabled={processing} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50" required placeholder="https://example.com/image.png or /images/latte.png"/>
                
                {imageUrl && (
                  <div className="mt-4 p-4 border border-dashed border-gray-300 rounded-lg bg-white flex flex-col items-center justify-center">
                    <p className="text-xs text-gray-500 mb-2">Image Preview</p>
                    <div className="relative w-full max-w-[200px] h-[150px] overflow-hidden rounded shadow-sm bg-gray-100">
                      {/* Using standard img tag here instead of Next Image to avoid host config errors with random URLs */}
                      <img src={imageUrl} alt="Preview" className="object-cover w-full h-full" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/200?text=Invalid+Image+URL')} />
                    </div>
                  </div>
                )}
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 mt-2 pt-4 border-t border-gray-200">
                <button type="button" onClick={clearForm} disabled={processing} className="px-6 py-2.5 rounded-lg font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={processing} className="px-6 py-2.5 rounded-lg font-medium text-white bg-brand-800 hover:bg-brand-900 shadow transition-colors flex items-center disabled:opacity-50">
                  {processing ? "Saving..." : <><Save size={18} className="mr-2"/> {editingId ? "Update Item" : "Save Item"}</>}
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map(item => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
              <div className="h-48 w-full bg-gray-100 relative overflow-hidden border-b border-gray-100">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ImageIcon size={48} />
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-sm">
                  ${Number(item.price).toFixed(2)}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">{item.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">{item.description}</p>
                
                <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => startEdit(item)}
                    disabled={processing}
                    className="flex-1 flex items-center justify-center py-2 bg-blue-50 text-blue-700 rounded border border-blue-100 hover:bg-blue-100 transition-colors disabled:opacity-50"
                  >
                    <Edit2 size={16} className="mr-1.5" /> Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteItem(item.id)}
                    disabled={processing}
                    className="flex-1 flex items-center justify-center py-2 bg-red-50 text-red-700 rounded border border-red-100 hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={16} className="mr-1.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {items.length === 0 && !loadingInitial && !isAdding && (
            <div className="col-span-full py-16 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center">
              <ImageIcon size={48} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No items found</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first item.</p>
              <button onClick={handleAddMode} className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium shadow-sm hover:bg-gray-50">
                Add an Item
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
