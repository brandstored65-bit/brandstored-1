"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import Dummy from '../assets/ads.png';

export default function TopDeals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: sectionData }, { data: productData }] = await Promise.all([
          axios.get("/api/admin/home-sections"),
          axios.get("/api/products")
        ]);

        const adminSections = sectionData.sections || [];
        const allProducts = productData.products || productData;

        const section = adminSections.find(s => s.category);
        let result = allProducts;

        if (section && section.category) {
          result = allProducts.filter(p => p.category === section.category);
        }

        setProducts(result);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="w-full hidden xl:flex justify-center px-4 mt-5">
      <div className="w-full max-w-[1300px] flex gap-6">

        {/* LEFT GRID PRODUCTS */}
        <div className="flex-1">
          <h2 className="text-[28px] font-semibold mb-5">Top Deals</h2>

          {loading ? (
            <p className="text-gray-500 py-5 text-lg text-center">Loading...</p>
          ) : products.length === 0 ? (
            <p className="text-gray-500 py-5 text-center">No Deals Found</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">

              {products?.map((item, i) => {
                const img =
                  item.images?.[0] && item.images[0] !== ""
                    ? item.images[0]
                    : "https://ik.imagekit.io/jrstupuke/placeholder.png";

                return (
                  <a
                    key={i}
                    href={`/product/${item.slug}`}
                    className="cursor-pointer text-center block"
                  >
                    <img
                      src={img}
                      alt={item.name}
                      className="w-[150px] h-[140px] mx-auto object-contain hover:scale-105 transition-all duration-200"
                      onError={e => { e.currentTarget.src = "https://ik.imagekit.io/jrstupuke/placeholder.png"; }}
                    />
                    <p className="text-[15px] font-medium mt-2 truncate">
                      {item.name}
                    </p>
                    <p className="font-bold text-[16px] mt-1">
                      From ₹{item.price}
                    </p>
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT FIXED BANNER */}
        <div className="w-[300px] hidden md:block">
          <Image
            src={Dummy}   // <--- Replace with banner
            alt="Offer Banner"
            className="w-full rounded-lg shadow"
          />
        </div>
      </div>
    </div>
  );
}
