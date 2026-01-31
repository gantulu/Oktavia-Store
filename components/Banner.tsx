
import React, { useState, useEffect, useCallback } from 'react';
import { APP_CONFIG } from '../constants';
import { BannerItem } from '../types';

const Banner: React.FC = () => {
  const { url, interval, autoSwipe } = APP_CONFIG.main.home.banner;
  const [items, setItems] = useState<BannerItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchBanners = useCallback(async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      // Map API data to handle string booleans and ensure icon accessibility
      const mappedData = data.map((item: any) => ({
        ...item,
        tombol_ambil: item.tombol_ambil === 'TRUE' || item.tombol_ambil === true,
        // Ensure icon has width/height if missing from remote SVG string
        icon: item.icon.replace('<svg', '<svg class="w-12 h-12"')
      }));
      setItems(mappedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching banners:", error);
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const nextSlide = useCallback(() => {
    if (items.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (autoSwipe && items.length > 0) {
      const timer = setInterval(nextSlide, interval);
      return () => clearInterval(timer);
    }
  }, [autoSwipe, interval, nextSlide, items.length]);

  if (loading) {
    return (
      <div className="px-4 mt-4">
        <div className="w-full h-40 bg-gray-100 animate-pulse rounded-2xl"></div>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="relative overflow-hidden w-full px-4 mt-4">
      <div 
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {items.map((item) => (
          <div 
            key={item.id} 
            className="min-w-full h-40 rounded-2xl p-6 flex flex-col justify-between"
            style={{ backgroundColor: item.backgroundColor, color: item.textColor }}
          >
            <div className="flex justify-between items-start">
              <div className="max-w-[70%]">
                <h3 className="text-xl font-bold line-clamp-1">{item.title}</h3>
                <p className="text-xs opacity-80 mt-1 line-clamp-2">{item.subtitle}</p>
              </div>
              <div dangerouslySetInnerHTML={{ __html: item.icon }} />
            </div>
            
            {item.tombol_ambil && (
              <div className="flex items-center justify-between">
                <div className="px-3 py-1 bg-white/20 backdrop-blur rounded-md border border-white/30">
                  <span className="text-xs font-mono font-bold">{item.kode_voucher}</span>
                </div>
                <button className="bg-black text-white text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-wider hover:opacity-90 transition">
                  Ambil Voucher
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="flex justify-center gap-1.5 mt-3">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${activeIndex === i ? 'w-6 bg-black' : 'w-1.5 bg-gray-300'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
