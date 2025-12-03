import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Section4 from '@/models/Section4';

// GET - Fetch all Section4 sections
export async function GET(request) {
  try {
    await connectDB();
    
    const sections = await Section4.find({ visible: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    
    return NextResponse.json({ sections }, { status: 200 });
  } catch (error) {
    console.error('Error fetching Section4:', error);
    return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 });
  }
}

// POST - Create new Section4
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { title, category, gridSize, products, visible } = body;
    
    if (!title || !category) {
      return NextResponse.json({ error: 'Title and category are required' }, { status: 400 });
    }
    
    const section = await Section4.create({
      title,
      category,
      gridSize: gridSize || 6,
      products: products || [],
      visible: visible !== false,
    });
    
    return NextResponse.json({ section }, { status: 201 });
  } catch (error) {
    console.error('Error creating Section4:', error);
    return NextResponse.json({ error: 'Failed to create section' }, { status: 500 });
  }
}
