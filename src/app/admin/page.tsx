"use client";

import { useState, useEffect } from "react";
import { auth, db, storage } from "@/services/firebase";
import { signOut, onAuthStateChanged, User } from "firebase/auth";
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Plus, Trash2, LogOut, Edit2, X, Save, Image as ImageIcon, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

const ADMIN_EMAIL = "sahprabhas293@gmail.com";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  
  // UI States
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setLoadingInitial(false);
      
      if (!currentUser || currentUser.email !== ADMIN_EMAIL) {
        console.warn("Unauthorized or unauthenticated user attempted to access admin. Redirecting to /...");
        // Fallback protection, redirect to Home if invalid
        window.location.href = "/";
        return;
      }
      
      setUser(currentUser);
      console.log("Admin verified. Fetching items...");
      const q = query(collection(db, "items"), orderBy("createdAt", "desc"));
      const unsubItems = onSnapshot(q, (snapshot) => {
        const fetchedItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setItems(fetchedItems);
      });
      return () => unsubItems();
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    console.log("Logging out admin");
    await signOut(auth);
    window.location.href = "/";
  };

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setImageUrl("");
    setImageFile(null);
    setImagePreview("");
    setEditingId(null);
    setIsAdding(false);
    setErrorMsg("");
  };

  const startEdit = (item: any) => {
    setTitle(item.title);
    setDescription(item.description);
    setPrice(item.price.toString());
    setImageUrl(item.imageUrl || "");
    setImageFile(null);
    setImagePreview(item.imageUrl || "");
    setEditingId(item.id);
    setIsAdding(true);
    setSuccessMsg("");
    setErrorMsg("");
  };

  const handleAddMode = () => {
    clearForm();
    setIsAdding(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      // Clear manual URL when a file is selected
      setImageUrl(""); 
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      let finalImageUrl = imageUrl;

      // 1. Handle File Upload if a direct file was selected
      if (imageFile) {
        console.log("File detected. Uploading to Firebase Storage...");
        const storageRef = ref(storage, `items/${Date.now()}_${imageFile.name}`);
        const uploadResult = await uploadBytes(storageRef, imageFile);
        finalImageUrl = await getDownloadURL(uploadResult.ref);
        console.log("File uploaded successfully. URL:", finalImageUrl);
      } else if (!finalImageUrl && !editingId) {
         setErrorMsg("Please provide an image file or an image URL.");
         setProcessing(false);
         return;
      }

      // 2. Handle DB update
      if (editingId) {
        console.log("Updating item:", editingId);
        await updateDoc(doc(db, "items", editingId), {
          title,
          description,
          price: parseFloat(price) || 0,
          imageUrl: finalImageUrl
        });
        setSuccessMsg("Item updated successfully!");
        console.log("Update success!");
      } else {
        console.log("Adding new item to Firestore database");
        await addDoc(collection(db, "items"), {
          title,
          description,
          price: parseFloat(price) || 0,
          imageUrl: finalImageUrl,
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
          <p className="text-gray-600">Verifying Admin Credentials...</p>
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
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span> Admin Verified: {user?.email}
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
              <button type="button" onClick={clearForm} className="text-gray-400 hover:text-gray-600 p-1"><X size={20} /></button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm mb-1 text-gray-700 font-medium">Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} disabled={processing} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500" required placeholder="e.g. Vanilla Latte" />
              </div>
              
              <div>
                <label className="block text-sm mb-1 text-gray-700 font-medium">Price (Number)</label>
                <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} disabled={processing} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500" required placeholder="5.50" />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm mb-1 text-gray-700 font-medium">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} disabled={processing} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 h-24 resize-none" required placeholder="A delicious blend of..." />
              </div>
              
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 items-start border-t border-gray-200 pt-6">
                <div>
                  <label className="block text-sm mb-1 text-gray-700 font-medium">Upload Image</label>
                  <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-sm tracking-wide uppercase border border-blue cursor-pointer hover:bg-gray-50 border-gray-300 transition-colors">
                      <Upload size={24} className="text-brand-500 mb-2" />
                      <span className="text-sm leading-normal text-gray-500 font-medium">{imageFile ? imageFile.name : 'Select a file'}</span>
                      <input type='file' className="hidden" accept="image/*" onChange={handleFileChange} disabled={processing} />
                  </label>
                  <p className="mt-2 text-xs text-center text-gray-500 font-medium">OR</p>
                  <label className="block text-sm mb-1 mt-2 text-gray-700 font-medium">External Image URL</label>
                  <input type="text" value={imageUrl} onChange={e => {setImageUrl(e.target.value); setImagePreview(e.target.value); setImageFile(null);}} disabled={processing} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500" placeholder="https://example.com/image.png" />
                </div>
                
                <div className="h-full flex flex-col">
                  <label className="block text-sm mb-1 text-gray-700 font-medium">Image Preview</label>
                  <div className="w-full h-40 flex items-center justify-center border border-gray-300 rounded-lg bg-gray-100 overflow-hidden relative shadow-inner">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview preview" className="object-cover w-full h-full" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Invalid+Image')} />
                    ) : (
                      <div className="text-gray-400 flex flex-col items-center">
                        <ImageIcon size={32} className="mb-2" />
                        <span className="text-sm font-medium">No Image Selected</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 mt-4 pt-4 border-t border-gray-200">
                <button type="button" onClick={clearForm} disabled={processing} className="px-6 py-2.5 rounded-lg font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors">Cancel</button>
                <button type="submit" disabled={processing} className="px-6 py-2.5 rounded-lg font-medium text-white bg-brand-800 hover:bg-brand-900 shadow transition-colors flex items-center disabled:opacity-50">
                  {processing ? "Saving..." : <span className="flex items-center"><Save size={18} className="mr-2"/> {editingId ? "Update Item" : "Save Item"}</span>}
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map(item => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col pt-1">
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
                  <button onClick={() => startEdit(item)} disabled={processing} className="flex-1 flex items-center justify-center py-2 bg-blue-50 text-blue-700 rounded border border-blue-100 hover:bg-blue-100 transition-colors disabled:opacity-50">
                    <Edit2 size={16} className="mr-1.5" /> Edit
                  </button>
                  <button onClick={() => handleDeleteItem(item.id)} disabled={processing} className="flex-1 flex items-center justify-center py-2 bg-red-50 text-red-700 rounded border border-red-100 hover:bg-red-100 transition-colors disabled:opacity-50">
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
              <button onClick={handleAddMode} className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium shadow-sm hover:bg-gray-50">Add an Item</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
