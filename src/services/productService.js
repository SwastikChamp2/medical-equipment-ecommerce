import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION = 'products';

export async function getProducts() {
  const snap = await getDocs(collection(db, COLLECTION));
  return snap.docs.map((d) => {
    const data = d.data();
    // Normalize fields for consistent filtering
    const category = data.category || data.type || data.categoryId || 'Uncategorized';
    const brand = data.brand || 'Generic';
    
    // Fallback ratings for demo purposes if not present
    return {
      id: d.id,
      ...data,
      category,
      brand,
      rating: data.rating || (4 + (d.id.length % 10) / 10).toFixed(1),
      reviews: data.reviews || (10 + (d.id.length % 40))
    };
  });
}

export async function getProductById(id) {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();
  return { 
    id: snap.id, 
    ...data,
    category: data.category || data.type || data.categoryId || 'Uncategorized',
    brand: data.brand || 'Generic'
  };
}

export async function getProductsByCategory(category) {
  const q = query(collection(db, COLLECTION), where('category', '==', category));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
