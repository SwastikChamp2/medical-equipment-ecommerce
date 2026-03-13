import { Heart } from 'lucide-react';
import Button from '../components/Button';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

export default function WishlistPage() {
  const { items } = useWishlist();

  return (
    <div className="container-main animate-fade-in py-8">
      <h1 className="text-2xl font-bold text-text-primary mb-2">My Wishlist</h1>
      <p className="text-sm text-text-secondary mb-8">{items.length} items saved</p>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <Heart size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-lg font-medium text-text-primary mb-2">Your wishlist is empty</p>
          <p className="text-sm text-text-secondary mb-6">Browse products and tap the heart icon to save your favorites.</p>
          <Button variant="primary" href="/products">Browse Products</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              isWishlistPage={true} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
