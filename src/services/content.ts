import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const getPageContent = async (pageId: string, defaultValue: any): Promise<any> => {
  try {
    const docRef = doc(db, "page_content", pageId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return defaultValue;
    }
  } catch (error) {
    console.warn(`Error fetching content for ${pageId}:`, error);
    return defaultValue;
  }
};

export const updatePageContent = async (pageId: string, data: any): Promise<void> => {
  try {
    const docRef = doc(db, "page_content", pageId);
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    console.error(`Error updating content for ${pageId}:`, error);
    throw error;
  }
};
