"use client";

import { useState, useEffect } from "react";
import { getContactSettings, setContactSettings, type ContactSettings } from "@/services/settings";
import { Save, Mail, Phone, MapPin, MessageCircle, Clock, Globe } from "lucide-react";
import { toast } from "react-hot-toast";

export default function SettingsTab() {
  const [settings, setSettings] = useState<ContactSettings>({
    email: "",
    phone: "",
    address: "",
    whatsapp: "",
    locationUrl: "",
    openingHours: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getContactSettings();
        setSettings(data);
      } catch (error) {
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Add a timeout warning for propagation delay
    const timeout = setTimeout(() => {
      toast("Still saving... Firestore might still be connecting. If this takes too long, please refresh the page.", {
        icon: "⏳",
        duration: 6000
      });
    }, 5000);

    try {
      await setContactSettings(settings);
      clearTimeout(timeout);
      toast.success("Settings updated successfully!");
    } catch (error: any) {
      clearTimeout(timeout);
      console.error("Save error:", error);
      toast.error(`Failed to update settings: ${error.message || "Unknown error"}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-800"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-brand-100">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-brand-950 mb-2">Site Settings</h3>
        <p className="text-brand-600">Update your contact information and other global site settings.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-brand-800 ml-1">
              <Mail size={16} /> Contact Email
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full bg-sand border border-brand-100 rounded-2xl px-4 py-3.5 focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 transition-all text-brand-900 font-medium"
              placeholder="hello@themudhouse.com"
              required
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-brand-800 ml-1">
              <Phone size={16} /> Contact Phone
            </label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full bg-sand border border-brand-100 rounded-2xl px-4 py-3.5 focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 transition-all text-brand-900 font-medium"
              placeholder="+977 9702032444"
              required
            />
          </div>

          {/* WhatsApp */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-brand-800 ml-1">
              <MessageCircle size={16} /> WhatsApp Number
            </label>
            <input
              type="text"
              value={settings.whatsapp}
              onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
              className="w-full bg-sand border border-brand-100 rounded-2xl px-4 py-3.5 focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 transition-all text-brand-900 font-medium"
              placeholder="9779702032444 (Number only)"
              required
            />
          </div>

          {/* Opening Hours */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-brand-800 ml-1">
              <Clock size={16} /> Opening Hours
            </label>
            <input
              type="text"
              value={settings.openingHours}
              onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })}
              className="w-full bg-sand border border-brand-100 rounded-2xl px-4 py-3.5 focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 transition-all text-brand-900 font-medium"
              placeholder="07:00 AM - 10:00 PM"
              required
            />
          </div>

          {/* Address */}
          <div className="col-span-1 md:col-span-2 space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-brand-800 ml-1">
              <MapPin size={16} /> Physical Address
            </label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full bg-sand border border-brand-100 rounded-2xl px-4 py-3.5 focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 transition-all text-brand-900 font-medium"
              placeholder="34 E Garden Ave, Porterville, CA"
              required
            />
          </div>

          {/* Location URL */}
          <div className="col-span-1 md:col-span-2 space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-brand-800 ml-1">
              <Globe size={16} /> Google Maps URL
            </label>
            <input
              type="url"
              value={settings.locationUrl}
              onChange={(e) => setSettings({ ...settings, locationUrl: e.target.value })}
              className="w-full bg-sand border border-brand-100 rounded-2xl px-4 py-3.5 focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 transition-all text-brand-900 font-medium"
              placeholder="https://goo.gl/maps/..."
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-10 py-4 bg-brand-950 text-white rounded-2xl hover:bg-brand-800 transition-all font-bold shadow-xl shadow-brand-900/20 disabled:opacity-50"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Save size={20} />
            )}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
