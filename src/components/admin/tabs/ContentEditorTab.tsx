"use client";

import { useState, useEffect } from "react";
import { getPageContent, updatePageContent } from "@/services/content";
import { Save, Loader2, ChevronRight } from "lucide-react";
import { toast } from "react-hot-toast";

const PAGES = [
  { id: "home", name: "Home Page" },
  { id: "about", name: "About Page" },
  { id: "menu", name: "Menu Page" },
  { id: "gallery", name: "Gallery Page" },
  { id: "reviews", name: "Reviews Page" },
  { id: "contact", name: "Contact Page" }
];

export default function ContentEditorTab() {
  const [selectedPage, setSelectedPage] = useState(PAGES[0].id);
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadContent() {
      setLoading(true);
      try {
        // We pass empty object as default because the actual default is in the page components
        // but for editing we just need what's in DB
        const data = await getPageContent(selectedPage, {});
        setContent(data);
      } catch (error) {
        toast.error("Failed to load page content");
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, [selectedPage]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updatePageContent(selectedPage, content);
      toast.success("Page content updated successfully!");
    } catch (error) {
      toast.error("Failed to save content");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (key: string, value: any) => {
    setContent({ ...content, [key]: value });
  };

  const updateArrayField = (key: string, index: number, field: string, value: any) => {
    const newArray = [...content[key]];
    newArray[index] = { ...newArray[index], [field]: value };
    setContent({ ...content, [key]: newArray });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-brand-800" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-100 flex flex-wrap gap-4 items-center">
        <span className="font-bold text-brand-900">Select Page to Edit:</span>
        <div className="flex flex-wrap gap-2">
          {PAGES.map((page) => (
            <button
              key={page.id}
              onClick={() => setSelectedPage(page.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedPage === page.id
                  ? "bg-brand-800 text-white shadow-md"
                  : "bg-sand text-brand-700 hover:bg-brand-100"
              }`}
            >
              {page.name}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white p-8 rounded-3xl shadow-xl border border-brand-100">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold text-brand-950 mb-1">Editing: {PAGES.find(p => p.id === selectedPage)?.name}</h3>
            <p className="text-brand-600 text-sm">Update text, quotes, and descriptions for this page.</p>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-brand-950 text-white rounded-xl hover:bg-brand-800 transition-all font-bold disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Save Changes
          </button>
        </div>

        <div className="space-y-8">
          {Object.keys(content).length === 0 ? (
            <div className="p-12 text-center border-2 border-dashed border-brand-200 rounded-2xl text-brand-500">
              No editable content found for this page yet. Please save once to initialize.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {Object.entries(content).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <label className="block text-sm font-bold text-brand-800 capitalize ml-1">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  
                  {Array.isArray(value) ? (
                    <div className="space-y-4 bg-sand/50 p-6 rounded-2xl border border-brand-50">
                      {value.map((item: any, idx: number) => (
                        <div key={idx} className="space-y-4">
                          <div className="flex items-center gap-2 text-brand-400 text-xs font-bold uppercase tracking-wider">
                            <ChevronRight size={14} /> Item {idx + 1}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(item).map(([field, val]) => (
                              <div key={field}>
                                <label className="block text-xs font-medium text-brand-500 mb-1">{field}</label>
                                {typeof val === 'string' && val.length > 50 ? (
                                  <textarea
                                    value={val as string}
                                    onChange={(e) => updateArrayField(key, idx, field, e.target.value)}
                                    className="w-full bg-white border border-brand-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-600"
                                    rows={3}
                                  />
                                ) : (
                                  <input
                                    type="text"
                                    value={val as string}
                                    onChange={(e) => updateArrayField(key, idx, field, e.target.value)}
                                    className="w-full bg-white border border-brand-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-600"
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : typeof value === 'string' && (value as string).length > 50 ? (
                    <textarea
                      value={value as string}
                      onChange={(e) => updateField(key, e.target.value)}
                      className="w-full bg-sand border border-brand-100 rounded-2xl px-5 py-4 focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 transition-all text-brand-900"
                      rows={4}
                    />
                  ) : (
                    <input
                      type="text"
                      value={value as string}
                      onChange={(e) => updateField(key, e.target.value)}
                      className="w-full bg-sand border border-brand-100 rounded-2xl px-5 py-4 focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 transition-all text-brand-900"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
