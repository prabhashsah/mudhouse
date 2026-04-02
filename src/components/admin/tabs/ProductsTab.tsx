"use client";

import { useState, useEffect } from "react";
import { db, storage } from "@/services/firebase";
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Plus, Trash2, Edit2, X, Image as ImageIcon, Upload, Search, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";

const CATEGORIES = ["Espresso Drinks", "Iced Coffee", "Teas & Refreshers", "Desserts & Bakery", "Seasonal Specials"];

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&q=80";

export default function ProductsTab() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Filter/Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const q = query(collection(db, "items"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setItems(fetched);
        setLoading(false);
        setFetchError(null);
      },
      (error) => {
        console.error("Firestore error in ProductsTab:", error);
        if (error.message?.includes("index")) {
          setFetchError(
            "A Firestore index is required. Check the browser console for a link to create it."
          );
        } else {
          setFetchError("Failed to load products. Please refresh.");
        }
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const clearForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setCategory(CATEGORIES[0]);
    setImageUrl("");
    setImageFile(null);
    setImagePreview("");
    setEditingId(null);
    setIsAdding(false);
    setUploadProgress(0);
  };

  const startEdit = (item: any) => {
    setName(item.name || item.title || "");
    setDescription(item.description || "");
    setPrice(item.price?.toString() || "");
    setCategory(item.category || CATEGORIES[0]);
    setImageUrl(item.imageUrl || "");
    setImagePreview(item.imageUrl || "");
    setEditingId(item.id);
    setIsAdding(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setImageUrl("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setUploadProgress(0);
    const loadingToast = toast.loading(editingId ? "Updating item..." : "Creating item...");

    try {
      let finalImageUrl = imageUrl;
      
      if (imageFile) {
        const storageRef = ref(storage, `items/${Date.now()}_${imageFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        await new Promise((resolve, reject) => {
          uploadTask.on('state_changed', 
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            }, 
            (error) => reject(error), 
            async () => {
              finalImageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(true);
            }
          );
        });
      }

      const itemData = {
        name,
        description,
        price: parseFloat(price),
        category,
        imageUrl: finalImageUrl,
        isAvailable: true,
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(doc(db, "items", editingId), itemData);
        toast.success("Product updated!", { id: loadingToast });
      } else {
        await addDoc(collection(db, "items"), {
          ...itemData,
          createdAt: serverTimestamp(),
        });
        toast.success("Product created!", { id: loadingToast });
      }
      clearForm();
    } catch (err: any) {
      toast.error(err.message, { id: loadingToast });
    } finally {
      setProcessing(false);
      setUploadProgress(0);
    }
  };

  const toggleAvailability = async (id: string, current: boolean) => {
    try {
      await updateDoc(doc(db, "items", id), { isAvailable: !current });
      toast.success(`Product ${!current ? 'available' : 'unavailable'}`);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteDoc(doc(db, "items", id));
      toast.success("Product deleted");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = (item.name || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "All" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-brand-100">
        <div className="flex-grow w-full md:max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400" size={18} />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-brand-50 border border-brand-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select 
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="bg-white border border-brand-100 px-4 py-2 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-brand-800 text-white px-6 py-2 rounded-xl font-bold hover:bg-brand-900 transition-all shadow-md"
          >
            <Plus size={18} /> Add New
          </button>
        </div>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white border border-brand-100 p-8 rounded-3xl shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-brand-950">{editingId ? "Edit Product" : "New Product"}</h3>
            <button type="button" onClick={clearForm} className="p-2 hover:bg-brand-50 rounded-full transition-colors text-brand-400">
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-brand-700 mb-2">Item Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-brand-200 focus:ring-2 focus:ring-brand-500 bg-brand-50/30 outline-none" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-brand-700 mb-2">Price ($)</label>
                  <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-brand-200 focus:ring-2 focus:ring-brand-500 bg-brand-50/30 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-700 mb-2">Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-brand-200 focus:ring-2 focus:ring-brand-500 bg-brand-50/30 outline-none">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-700 mb-2">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full px-4 py-3 rounded-xl border border-brand-200 focus:ring-2 focus:ring-brand-500 bg-brand-50/30 outline-none resize-none" required />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-brand-700 mb-2">Image Selection</label>
                <div className="flex flex-col gap-4">
                  <label className="flex flex-col items-center py-10 rounded-2xl border-2 border-dashed border-brand-200 cursor-pointer hover:bg-brand-50 hover:border-brand-500 transition-all group relative overflow-hidden">
                    {processing && uploadProgress > 0 && (
                       <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-10">
                          <div className="w-2/3 h-2 bg-brand-100 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-600 transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                          </div>
                          <span className="text-xs font-bold text-brand-600 mt-2">{Math.round(uploadProgress)}% Uploaded</span>
                       </div>
                    )}
                    <Upload size={32} className="text-brand-400 group-hover:text-brand-600 mb-2" />
                    <span className="text-sm text-brand-600 font-medium">{imageFile ? imageFile.name : "Select image file"}</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                  <input type="text" placeholder="Or paste image URL" value={imageUrl} onChange={e => {setImageUrl(e.target.value); setImagePreview(e.target.value);}} className="w-full px-4 py-2 text-sm rounded-lg border border-brand-200 outline-none focus:ring-1 focus:ring-brand-500" />
                </div>
              </div>
              <div className="h-48 rounded-2xl overflow-hidden border border-brand-100 bg-brand-50 relative">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-brand-200">
                    <ImageIcon size={48} />
                    <span className="text-sm font-bold uppercase mt-2">Preview</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-10 pt-8 border-t border-brand-50">
            <button type="button" onClick={clearForm} className="px-8 py-3 rounded-xl font-bold text-brand-600 hover:bg-brand-50 transition-colors">Cancel</button>
            <button type="submit" disabled={processing} className="px-10 py-3 rounded-xl font-bold text-white bg-brand-800 hover:bg-brand-950 transition-all shadow-lg disabled:opacity-50 flex items-center gap-2">
              {processing ? <><Loader2 className="animate-spin" size={18} /> {uploadProgress > 0 ? "Uploading..." : "Syncing..."}</> : (editingId ? "Update Product" : "Create Product")}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white/50 rounded-3xl border border-brand-100">
           <Loader2 className="animate-spin text-brand-600 mb-4" size={40} />
           <p className="font-bold text-brand-800">Reading Database...</p>
        </div>
      ) : fetchError ? (
        <div className="flex flex-col items-center justify-center py-24 bg-red-50 rounded-3xl border border-red-200 gap-4">
          <AlertCircle className="text-red-500" size={40} />
          <p className="font-bold text-red-700 text-center max-w-sm">{fetchError}</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-brand-200 shadow-sm animate-in fade-in duration-700">
           <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mb-6 text-brand-200">
              <ImageIcon size={40} />
           </div>
           <h3 className="text-2xl font-bold text-brand-950 mb-2">No items found</h3>
           <p className="text-brand-500 mb-8 max-w-sm text-center">Get started by creating your first item in the database.</p>
           <button 
              onClick={() => setIsAdding(true)}
              className="px-8 py-3 bg-white border border-brand-200 rounded-xl font-bold text-brand-800 hover:bg-brand-50 transition-all shadow-sm flex items-center gap-2"
           >
              Add an Item
           </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-brand-100 group transition-all hover:shadow-xl ${!item.isAvailable && 'opacity-60 grayscale'}`}>
              <div className="h-52 relative overflow-hidden">
                <img
                  src={item.imageUrl || FALLBACK_IMAGE}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={() => toggleAvailability(item.id, item.isAvailable)}
                    className={`p-2 rounded-full shadow-md backdrop-blur-md transition-all ${item.isAvailable ? 'bg-white/90 text-brand-800 hover:bg-white' : 'bg-brand-800 text-white'}`}
                    title={item.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                  >
                    {item.isAvailable ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                <div className="absolute top-4 left-4 bg-brand-800 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                  {item.category}
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-xl font-bold text-brand-950 truncate">{item.name || item.title}</h4>
                  <span className="text-brand-800 font-bold">${Number(item.price).toFixed(2)}</span>
                </div>
                <p className="text-brand-600 text-sm line-clamp-2 mb-6 h-10">{item.description}</p>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(item)} className="flex-1 py-2 bg-brand-50 text-brand-800 rounded-lg text-sm font-bold hover:bg-brand-100 transition-colors flex items-center justify-center gap-2">
                    <Edit2 size={14} /> Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                    <Trash2 size={14} /> Delete
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
