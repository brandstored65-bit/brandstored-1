

import dbConnect from "@/lib/mongodb";
import HomeSection from "@/models/HomeSection";
import { NextResponse } from "next/server";

// GET - Fetch all home sections (public)
export async function GET(request) {
    try {
        await dbConnect();
        const sections = await HomeSection.find().sort({ sortOrder: 1 });
        return NextResponse.json({ sections });
    } catch (error) {
        console.error('Error fetching home sections:', error);
        return NextResponse.json(
            { error: "Failed to fetch home sections" },
            { status: 500 }
        );
    }
}

// POST - Create new home section
export async function POST(request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { section, category, tag, productIds, title, subtitle, slides, bannerCtaText, bannerCtaLink, layout, isActive, sortOrder } = body;
        if (!section) {
            return NextResponse.json(
                { error: "Section key is required" },
                { status: 400 }
            );
        }
        const newSection = await HomeSection.create({
            section,
            category,
            tag,
            productIds,
            title,
            subtitle,
            slides,
            bannerCtaText,
            bannerCtaLink,
            layout,
            isActive,
            sortOrder,
        });
        return NextResponse.json({ section: newSection }, { status: 201 });
    } catch (error) {
        console.error('Error creating home section:', error);
        return NextResponse.json(
            { error: "Failed to create home section" },
            { status: 500 }
        );
    }
}
