
import React from 'react';

export const APP_CONFIG = {
  main: {
    home: {
      banner: {
        type: "premium",
        autoSwipe: true,
        interval: 4000,
        url: "https://opensheet.elk.sh/1pztiIdabsxJ_NyIuaHFFio0ppS1pTP9Fy8Hnxi5Rjws/Sheet1"
      },
      quickAction: [
        {
          id: "quick-iphone",
          title: "iPhone",
          icon: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' class='w-6 h-6'><rect x='7' y='2' width='10' height='20' rx='2'/><circle cx='12' cy='18' r='1'/></svg>`
        },
        {
          id: "quick-iwatch",
          title: "iWatch",
          icon: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' class='w-6 h-6'><rect x='7' y='2' width='10' height='20' rx='3'/><circle cx='12' cy='12' r='3'/></svg>`
        },
        {
          id: "quick-imac",
          title: "iMac",
          icon: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' class='w-6 h-6'><rect x='2' y='4' width='20' height='14' rx='2'/><line x1='8' y1='20' x2='16' y2='20'/></svg>`
        },
        {
          id: "quick-ipad",
          title: "iPad",
          icon: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' class='w-6 h-6'><rect x='4' y='2' width='16' height='20' rx='2'/><circle cx='12' cy='19' r='1'/></svg>`
        },
        {
          id: "quick-airpods",
          title: "AirPods",
          icon: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' class='w-6 h-6'><path d='M9 3l2 18h2l2-18'/></svg>`
        }
      ]
    },
    catalog: {
      url: "https://opensheet.elk.sh/1x2Rtyeyq3WR6yFybA8stGP0mdI2dlKvBz6fhx7FIjhQ/Sheet1"
    },
    profile: {
      accountMenu: [
        { id: 1, name: "Pesanan Saya", icon: "fa-shopping-bag" },
        { id: 2, name: "Wishlist", icon: "fa-heart" },
        { id: 3, name: "Voucher", icon: "fa-ticket-alt" }
      ]
    }
  }
};
