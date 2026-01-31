
import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Product } from '../types';
import { APP_CONFIG } from '../constants';

interface PopularProductsProps {
  onProductClick: (groupId: string) => void;
}

const PopularProducts: React.FC<PopularProductsProps> = ({ onProductClick }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(APP_CONFIG.main.catalog.url);
        const data: Product[] = await response.json();
        
        // Take 8 products, sort by sold desc
        const popular = data
          .sort((a, b) => parseInt(b.sold) - parseInt(a.sold))
          .slice(0, 8);

        setProducts(popular);
      } catch (err) {
        console.error("Failed to fetch popular products", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="mt-6 px-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Popular Produk</h2>
        <button className="text-blue-600 text-xs font-bold hover:underline">Lainnya</button>
      </div>

      <div className="grid grid-cols-2 gap-3 pb-20">
        {products.length > 0 ? (
          products.map(p => (
            <ProductCard 
              key={p.id} 
              product={p} 
              onClick={onProductClick}
            />
          ))
        ) : (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse rounded-2xl" />
          ))
        )}
      </div>
    </div>
  );
};

export default PopularProducts;
