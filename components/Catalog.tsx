
import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Product } from '../types';
import { APP_CONFIG } from '../constants';

const Catalog: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(APP_CONFIG.main.catalog.url);
        const data: Product[] = await response.json();
        
        // Filter unique by item_group_id
        const uniqueProducts = data.reduce((acc: Product[], curr) => {
          if (!acc.find(p => p.item_group_id === curr.item_group_id)) {
            acc.push(curr);
          }
          return acc;
        }, []);

        setAllProducts(uniqueProducts);
        setFilteredProducts(uniqueProducts);
        
        const cats = Array.from(new Set(data.map(p => p.category_name || p.category)));
        setCategories(['All', ...cats.filter(Boolean) as string[]]);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredProducts(allProducts);
    } else {
      setFilteredProducts(allProducts.filter(p => (p.category_name || p.category) === activeCategory));
    }
  }, [activeCategory, allProducts]);

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 bg-white sticky z-40 border-b border-gray-100">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                activeCategory === cat 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 grid grid-cols-2 gap-4 pb-24">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-50 animate-pulse rounded-2xl" />
          ))
        ) : (
          filteredProducts.map(p => <ProductCard key={p.id} product={p} />)
        )}
      </div>
    </div>
  );
};

export default Catalog;
