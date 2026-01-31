
export interface Product {
  id: string;
  item_group_id: string;
  title: string;
  image_link: string;
  price: string;
  sale_price?: string;
  discount_percentage?: string;
  category: string;
  category_name?: string;
  event_tag?: string;
  rating: string;
  sold: string;
  quantity_to_sell_on_facebook?: string;
}

export interface User {
  name: string;
  phone: string;
  profilePicture?: string;
  avatarSeed: string;
}

export interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  backgroundColor: string;
  textColor: string;
  icon: string;
  kode_voucher?: string;
  tombol_ambil?: boolean;
}

export interface QuickActionItem {
  id: string;
  title: string;
  icon: string;
}
