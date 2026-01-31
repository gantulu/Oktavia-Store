
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  horizontal?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, horizontal }) => {
  const formatIDR = (val: string) => {
    const num = parseInt(val.replace(/\D/g, ''));
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  };

  const hasDiscount = product.discount_percentage && parseInt(product.discount_percentage) > 0;
  const rating = (parseFloat(product.rating) / 100).toFixed(1);

  if (horizontal) {
    return (
      <div className="flex-shrink-0 w-32 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="relative aspect-square bg-gray-50 p-3">
          <img src={product.image_link} alt={product.title} className="w-full h-full object-contain" />
          {hasDiscount && (
            <div className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
              {product.discount_percentage}%
            </div>
          )}
        </div>
        <div className="p-2">
          <p className="text-[10px] font-medium text-gray-900 line-clamp-2 min-h-[28px] leading-tight">
            {product.title}
          </p>
          <div className="mt-1">
            <p className="text-[11px] font-bold text-red-600">{formatIDR(product.sale_price || product.price)}</p>
            {hasDiscount && (
              <p className="text-[9px] text-gray-400 line-through">{formatIDR(product.price)}</p>
            )}
          </div>
          <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 w-[60%]"></div>
          </div>
          <p className="text-[8px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">Segera Habis</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full group">
      <div className="relative aspect-square bg-gray-50 p-4">
        <img 
          src={product.image_link} 
          alt={product.title} 
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" 
        />
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-red-200">
            -{product.discount_percentage}%
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col flex-1">
        <h3 className="text-xs font-medium text-gray-800 line-clamp-2 leading-snug mb-2 flex-1">
          {product.title}
        </h3>
        
        <div className="mt-auto">
          <div className="flex flex-wrap items-baseline gap-1">
            <p className="text-sm font-bold text-black">{formatIDR(product.sale_price || product.price)}</p>
            {hasDiscount && (
              <p className="text-[10px] text-gray-400 line-through">{formatIDR(product.price)}</p>
            )}
          </div>
          
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-50">
            <div className="flex items-center text-yellow-500 text-[10px] font-bold">
              <i className="fas fa-star mr-0.5"></i>
              <span>{rating}</span>
            </div>
            <div className="h-2 w-[1px] bg-gray-200"></div>
            <p className="text-[10px] text-gray-500">Terjual {product.sold}+</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
