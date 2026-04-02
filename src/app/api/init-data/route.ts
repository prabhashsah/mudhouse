import { db } from "@/services/firebase";
import { doc, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Initializing Firestore data via API...");

    // 1. Update Contact Info
    await setDoc(doc(db, "site_settings", "contact"), {
      address: "Baluwatar, Kathmandu, Nepal",
      phone: "+977 9702032444",
      email: "hello@themudhouse.com",
      whatsapp: "9779702032444",
      locationUrl: "https://maps.google.com/?q=Baluwatar,Kathmandu,Nepal",
      openingHours: "07:00 AM - 10:00 PM"
    });

    // 2. Initialize Home Page Content
    await setDoc(doc(db, "page_content", "home"), {
      heroTitle: "Experience the Soul of Coffee",
      heroSubtitle: "Hand-pressed, ethically sourced, and brewed with love in the heart of Kathmandu.",
      featuresHeader: "Why Choose The Mud House?",
      quoteText: "Coffee is more than just a drink; it's a moment of peace in a busy world.",
      quoteAuthor: "The Mud House Team"
    });

    // 3. Initialize About Page Content
    await setDoc(doc(db, "page_content", "about"), {
      heroTitle: "Our Journey",
      heroText: "From a small dream in Kathmandu to your favorite neighborhood sanctuary. The Mud House is built on community and quality.",
      storyTitle: "Brewing Since 2024",
      storyText1: "We believe in the power of a perfect cup to bring people together. That's why we source our beans directly from local high-altitude farms.",
      storyText2: "Every detail at The Mud House is designed to make you feel at home. From our handcrafted furniture to our carefully curated menu.",
      valuesTitle: "Our Core Values",
      values: [
        { title: "Local First", desc: "Supporting Nepali coffee farmers and local ingredients." },
        { title: "Pure Quality", desc: "Small-batch roasting for the richest possible flavor." },
        { title: "Warm Heart", desc: "A space where everyone is welcome and every smile is real." }
      ]
    });

    // 4. Initialize Menu Page Header
    await setDoc(doc(db, "page_content", "menu"), {
        title: "The Kathmandu Menu",
        description: "Handcrafted coffee, traditional treats, and modern fusion, all made with Himalayan ingredients."
    });

    return NextResponse.json({ success: true, message: "Data initialized successfully" });
  } catch (error: any) {
    console.error("Initialization error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
