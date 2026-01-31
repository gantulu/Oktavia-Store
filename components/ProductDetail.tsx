
import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../types';
import { APP_CONFIG } from '../constants';

interface ProductDetailProps {
  groupId: string;
  onClose: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ groupId, onClose }) => {
  const [groupItems, setGroupItems] = useState<Product[]>([]);
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(APP_CONFIG.main.catalog.url);
        const data: Product[] = await response.json();
        const filtered = data.filter(p => p.item_group_id === groupId);
        setGroupItems(filtered);
        setSelectedItem(filtered[0] || null);
        setLoading(false);
        // Small delay to trigger animation
        setTimeout(() => setIsVisible(true), 10);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [groupId]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const formatIDR = (val: string) => {
    const num = parseInt(val.replace(/\D/g, ''));
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  };

  const colors = useMemo(() => {
    const unique = Array.from(new Set(groupItems.map(item => item.title.split(' - ')[1]?.split(',')[0] || 'Default')));
    return unique.filter(Boolean);
  }, [groupItems]);

  const variants = useMemo(() => {
    const unique = Array.from(new Set(groupItems.map(item => item.title.split(', ')[1] || 'Standard')));
    return unique.filter(Boolean);
  }, [groupItems]);

  const updateSelection = (color?: string, variant?: string) => {
    const currentColor = selectedItem?.title.split(' - ')[1]?.split(',')[0] || 'Default';
    const currentVariant = selectedItem?.title.split(', ')[1] || 'Standard';

    const targetColor = color || currentColor;
    const targetVariant = variant || currentVariant;

    const match = groupItems.find(item => {
      const itemColor = item.title.split(' - ')[1]?.split(',')[0] || 'Default';
      const itemVar = item.title.split(', ')[1] || 'Standard';
      return itemColor === targetColor && itemVar === targetVariant;
    });

    if (match) setSelectedItem(match);
  };

  const hasDiscount = selectedItem?.discount_percentage && parseInt(selectedItem.discount_percentage) > 0;

  if (loading) return null;

  return (
    <div className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      
      <div className={`absolute inset-x-0 bottom-0 top-0 max-w-md mx-auto bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out overflow-y-auto ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
        
        {/* Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-md px-4 py-4 flex items-center justify-between z-10 border-b border-gray-50">
          <button onClick={handleClose} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 active:scale-90 transition">
            <i className="fas fa-chevron-down"></i>
          </button>
          <div className="flex-1 text-center mx-4">
            <h2 className="text-sm font-bold truncate">Detail Produk</h2>
          </div>
          <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 active:scale-90 transition">
            <i className="fas fa-share-alt"></i>
          </button>
        </div>

        {selectedItem && (
          <div className="pb-32">
            {/* Image Section */}
            <div className="relative aspect-square bg-gray-50 flex items-center justify-center p-8">
              <img 
                src={selectedItem.image_link} 
                alt={selectedItem.title} 
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>

            <div className="p-6">
              {/* Info Section */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-xl font-bold text-gray-900 leading-tight">
                    {selectedItem.title}
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Official Store</span>
                    <div className="flex items-center text-yellow-500 text-xs font-bold">
                      <i className="fas fa-star mr-1"></i>
                      <span>{(parseFloat(selectedItem.rating)/100).toFixed(1)}</span>
                      <span className="text-gray-400 font-medium ml-1">({selectedItem.sold} terjual)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Section */}
              <div className="mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-black">
                    {formatIDR(selectedItem.sale_price || selectedItem.price)}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatIDR(selectedItem.price)}
                    </span>
                  )}
                </div>
                {hasDiscount && (
                  <div className="mt-1 flex items-center gap-2">
                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      DISKON {selectedItem.discount_percentage}%
                    </span>
                    <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider">Flash Sale Berakhir dalam 02:45:12</span>
                  </div>
                )}
              </div>

              {/* Variants: Colors */}
              {colors.length > 0 && colors[0] !== 'Default' && (
                <div className="mt-8">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Pilih Warna</h3>
                  <div className="flex flex-wrap gap-3">
                    {colors.map(color => {
                      const isActive = selectedItem.title.includes(color);
                      return (
                        <button
                          key={color}
                          onClick={() => updateSelection(color)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border-2 transition-all ${
                            isActive ? 'border-black bg-black text-white' : 'border-gray-100 bg-white text-gray-600'
                          }`}
                        >
                          <div 
                            className={`w-3 h-3 rounded-full border border-black/10`} 
                            style={{ backgroundColor: color.toLowerCase().replace(' ', '') }} 
                          />
                          {color}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Variants: Size/Capacity */}
              {variants.length > 0 && variants[0] !== 'Standard' && (
                <div className="mt-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Pilih Kapasitas</h3>
                  <div className="flex flex-wrap gap-2">
                    {variants.map(v => {
                      const isActive = selectedItem.title.includes(v);
                      return (
                        <button
                          key={v}
                          onClick={() => updateSelection(undefined, v)}
                          className={`min-w-[80px] px-4 py-3 rounded-xl text-xs font-bold border-2 transition-all ${
                            isActive ? 'border-black bg-black text-white' : 'border-gray-100 bg-white text-gray-600'
                          }`}
                        >
                          {v}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="mt-8">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Deskripsi Produk</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Dapatkan pengalaman premium dengan {selectedItem.title}. Produk orisinal dengan garansi resmi. Fitur unggulan meliputi desain elegan, performa luar biasa, dan integrasi sempurna ke dalam ekosistem Apple.
                </p>
                <button className="mt-4 text-blue-600 text-xs font-bold flex items-center gap-1">
                  Selengkapnya <i className="fas fa-chevron-right text-[10px]"></i>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sticky CTA */}
        <div className="fixed bottom-0 inset-x-0 max-w-md mx-auto p-4 bg-white/80 backdrop-blur-xl border-t border-gray-100 flex items-center gap-3 z-20">
          <button className="w-14 h-14 rounded-2xl border-2 border-gray-100 flex items-center justify-center text-gray-600 active:bg-gray-50">
            <i className="far fa-heart text-xl"></i>
          </button>
          <button className="flex-1 h-14 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition shadow-xl shadow-black/10">
            <i className="fas fa-shopping-bag"></i>
            Tambah ke Keranjang
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
