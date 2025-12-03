'use client'
import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import GuestOrderLinker from "@/components/GuestOrderLinker";
import TopBarNotification from "@/components/TopBarNotification";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/lib/features/product/productSlice";

import { fetchCart, uploadCart } from "@/lib/features/cart/cartSlice";
import { fetchAddress } from "@/lib/features/address/addressSlice";
import { fetchUserRatings } from "@/lib/features/rating/ratingSlice";



function PublicLayoutAuthed({ children }) {
    const dispatch = useDispatch();
    const { cartItems } = useSelector((state) => state.cart);

    useEffect(() => { 
        // Defer product fetch to allow critical content to load first
        const timer = setTimeout(() => {
            dispatch(fetchProducts({})); 
        }, 100);
        return () => clearTimeout(timer);
    }, [dispatch]);

    return (
        <div className="flex flex-col min-h-screen">
            <GuestOrderLinker />
            <TopBarNotification />
            {/* <Banner />/ */}
            <Navbar />
            <main className="flex-1 pb-20 lg:pb-0">{children}</main>
            <MobileBottomNav />
            <Footer />
        </div>
    );
}

function PublicLayoutGuest({ children }) {
    const dispatch = useDispatch();
    useEffect(() => { 
        // Defer product fetch
        const timer = setTimeout(() => {
            dispatch(fetchProducts({})); 
        }, 100);
        return () => clearTimeout(timer);
    }, [dispatch]);
    return (
        <div className="flex flex-col min-h-screen">
            <TopBarNotification />
            {/* <Banner /> */}
            <Navbar />
         
            <main className="flex-1 pb-20 lg:pb-0">{children}</main>
            <MobileBottomNav />
            <Footer />
        </div>
    );
}

export default function PublicLayout(props) {
    return (
        <PublicLayoutAuthed {...props} />
    );
}
