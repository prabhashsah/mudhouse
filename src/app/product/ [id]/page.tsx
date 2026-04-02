import { db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Metadata } from "next";
import ProductDetailClient from "@/components/products/ProductDetailClient";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
  try {
    const docSnap = await getDoc(doc(db, "items", id));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as any;
    }
  } catch (err) {
    console.error("Error fetching product:", err);
  }
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: "Product Not Found | The Mud House",
    };
  }

  return {
    title: `${product.name} | The Mud House`,
    description: product.description || `Enjoy our delicious ${product.name} at The Mud House.`,
    openGraph: {
      title: `${product.name} | The Mud House`,
      description: product.description,
      images: [product.imageUrl || "/images/hero-1.jpg"],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <div className="pt-32 pb-24 bg-sand min-h-screen text-center">
        <h1 className="text-3xl font-bold text-brand-950 mb-6">Product Not Found</h1>
        <Link href="/menu" className="text-brand-600 hover:underline">Back to Menu</Link>
      </div>
    );
  }

  return <ProductDetailClient product={product} />;
}
