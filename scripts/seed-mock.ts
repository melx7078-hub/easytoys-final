import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function truncateAndSeed() {
  // Truncate by deleting everything
  const { error: deleteError } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (deleteError) {
    console.error('Error deleting generic products:', deleteError);
  } else {
    console.log('Successfully cleared generic products.');
  }

  // The 50 products
  const products = [
    {
      name: "Lubricante Anal EasyGlide - 150 ml",
      category: "Lubricantes",
      price: 9.99,
      original_price: 16.99,
      image: "https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?q=80&w=600&auto=format&fit=crop",
      description: "Lubricante anal a base de agua, ligeramente adormecedor, 100% seguro con preservativos, apto para veganos.",
      is_new: false,
      rating: 4.9,
      review_count: 845
    },
    {
      name: "Lubricante EasyGlide - 150 ml",
      category: "Lubricantes",
      price: 8.99,
      original_price: 11.99,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop",
      description: "A base de agua, inodoro, sabor neutro, fórmula vegana. Para juguetes y preservativos.",
      is_new: false,
      rating: 4.8,
      review_count: 2519
    },
    {
      name: "Estimulador de Clítoris Sona 2",
      category: "Vibradores",
      price: 99.00,
      original_price: 119.00,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop",
      description: "Experimenta orgasmos múltiples con las ondas sónicas del famoso Sona 2.",
      is_new: false,
      rating: 4.8,
      review_count: 532
    },
    {
      name: "Anillo Vibrador Estimulador",
      category: "Para parejas",
      price: 15.99,
      original_price: 24.99,
      image: "https://images.unsplash.com/photo-1602928321679-560bb453f190?q=80&w=600&auto=format&fit=crop",
      description: "Perfecto para jugar en pareja. Estimulación extra y batería de larga duración.",
      is_new: false,
      rating: 4.5,
      review_count: 120
    },
    // We will procedurally generate realistic names for the rest to reach 50
  ];

  const categories = ["Vibradores", "Lubricantes", "Para parejas", "Para pene", "Para vulva", "Lencería", "BDSM"];
  const bases = [
    "Vibrador Conejito", "Bala Vibradora", "Masturbador Masculino", "Aceite de Masaje Relajante", "Estimulador Sónico",
    "Kit de Bondage", "Tapón Anal de Silicona", "Dildo Realista", "Conjunto de Lencería de Encaje", "Dados Eróticos",
    "Lubricante Efecto Calor", "Vibrador con App", "Vibrador Clitoriano", "Masturbador con Texturas", "Bolas Chinas",
    "Arnés Ajustable", "Limpiador de Juguetes", "Gel Retardante", "Fusta de Cuero", "Antifaz Suave"
  ];
  
  const images = [
    'https://plus.unsplash.com/premium_photo-1675806655113-585efcba4912?w=600&auto=format&fit=crop', // generic silky pink bg
    'https://images.unsplash.com/photo-1518063777553-61a0fe10487d?q=80&w=600&auto=format&fit=crop', // romantic
    'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?q=80&w=600&auto=format&fit=crop', // bottle / lube
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop', // object
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1602928321679-560bb453f190?q=80&w=600&auto=format&fit=crop'
  ];

  for (let i = products.length; i < 50; i++) {
    const base = bases[i % bases.length];
    const cat = categories[i % categories.length];
    const originalPrice = parseFloat((Math.random() * 80 + 20).toFixed(2));
    const isDiscounted = Math.random() > 0.5;
    const price = isDiscounted ? parseFloat((originalPrice * 0.7).toFixed(2)) : originalPrice;

    products.push({
      name: `${base} Premium ${i + 1}`,
      category: cat,
      price: price,
      original_price: isDiscounted ? originalPrice : null,
      image: images[i % images.length],
      description: `Disfruta al máximo con el ${base.toLowerCase()}. Fabricado con silicona suave y diseño ergonómico.`,
      is_new: Math.random() > 0.8,
      rating: parseFloat((Math.random() * 1 + 4).toFixed(1)),
      review_count: Math.floor(Math.random() * 500) + 10
    });
  }

  const { error } = await supabase.from('products').insert(products);
  
  if (error) {
    console.error('Error inserting 50 products:', error);
  } else {
    console.log('Successfully inserted 50 realistic EasyToys products.');
  }
}

truncateAndSeed();
