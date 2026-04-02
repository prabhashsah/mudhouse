import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export interface ContactSettings {
  email: string;
  phone: string;
  address: string;
  whatsapp: string;
  locationUrl: string;
  openingHours: string;
}

const DEFAULT_CONTACT_SETTINGS: ContactSettings = {
  email: "info@fake-themudhouse.com",
  phone: "+977 0000000000",
  address: "123 Fake Street, Sanctuary City",
  whatsapp: "9770000000000",
  locationUrl: "https://maps.google.com/?q=fake+location",
  openingHours: "09:00 AM - 09:00 PM"
};

const SETTINGS_COLLECTION = "site_settings";
const CONTACT_DOC = "contact";

export const getContactSettings = async (): Promise<ContactSettings> => {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, CONTACT_DOC);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as ContactSettings;
    } else {
      // Return default values if document doesn't exist
      // We don't try to setDoc here to avoid build failures if offline
      return DEFAULT_CONTACT_SETTINGS;
    }
  } catch (error) {
    // If it's a build time or offline error, just return defaults quietly
    console.warn("Using default contact settings (Firestore unreachable)");
    return DEFAULT_CONTACT_SETTINGS;
  }
};

export const setContactSettings = async (settings: ContactSettings): Promise<void> => {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, CONTACT_DOC);
    await setDoc(docRef, settings);
  } catch (error) {
    console.error("Error saving contact settings:", error);
    throw error;
  }
};
