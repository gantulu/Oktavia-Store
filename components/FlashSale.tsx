
import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Product } from '../types';
import { APP_CONFIG } from '../constants';

const FlashSale: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [timeLeft, setTimeLeft] = useState(7200); // 2 hours in seconds

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(APP_CONFIG.main.catalog.url);
        const data: Product[] = await response.json();
        
        // Filter: event_tag === 'flashsale', group by item_group_id
        const flashSaleProducts = data
          .filter(p => p.event_tag === 'flashsale')
          .reduce((acc: Product[], current) => {
            if (!acc.find(item => item.item_group_id === current.item_group_id)) {
              acc.push(current);
            }
            return acc;
          }, [])
          .sort((a, b) => parseInt(b.discount_percentage || '0') - parseInt(a.discount_percentage || '0'))
          .slice(0, 10);

        setProducts(flashSaleProducts);
      } catch (err) {
        console.error("Failed to fetch flash sale products", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return { h, m, s };
  };

  const { h, m, s } = formatTime(timeLeft);

  return (
    <div className="mt-8">
      <div className="px-4 flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-gray-900">Flash Sale</h2>
          <div className="flex items-center gap-1">
            <span className="bg-red-500 text-white font-bold px-1.5 py-0.5 rounded text-[11px]">{h}</span>
            <span className="text-red-500 font-bold">:</span>
            <span className="bg-red-500 text-white font-bold px-1.5 py-0.5 rounded text-[11px]">{m}</span>
            <span className="text-red-500 font-bold">:</span>
            <span className="bg-red-500 text-white font-bold px-1.5 py-0.5 rounded text-[11px]">{s}</span>
          </div>
        </div>
        <button className="text-blue-600 text-xs font-bold hover:underline">Lihat Semua</button>
      </div>

      <div className="flex gap-3 overflow-x-auto px-4 pb-4 hide-scrollbar">
        {products.length > 0 ? (
          products.map(p => <ProductCard key={p.id} product={p} horizontal />)
        ) : (
          Array(5).fill(0).map((_, i) => (
            <div key={i} className="w-32 h-48 bg-gray-100 animate-pulse rounded-xl" />
          ))
        )}
      </div>
    </div>
  );
};

export default FlashSale;
