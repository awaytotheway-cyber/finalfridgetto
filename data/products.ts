/**
 * Seed catalogue.
 *
 * This file is the only place product content lives today. UI code never
 * imports it directly; it goes through `lib/catalog.ts`. To move to
 * Supabase, replace the functions in `lib/catalog.ts` and delete this file.
 *
 * Images: Unsplash photo IDs. Swap `unsplash("…")` for your own URLs
 * (e.g. "/images/ghee-1.jpg" in /public, or a Supabase Storage URL).
 */
import type { Category, Product } from "@/lib/types";
import { unsplash } from "@/lib/utils";

export const categories: Category[] = [
  {
    slug: "oils-ghee",
    name: "Oils & Ghee",
    description: "Slow, cold and wood-pressed fats the way our grandparents made them.",
  },
  {
    slug: "spices",
    name: "Spices",
    description: "Single-origin, sun-dried and stone-ground in small batches.",
  },
  {
    slug: "sweeteners",
    name: "Sweeteners",
    description: "Unrefined sweetness from cane fields and forest hives.",
  },
  {
    slug: "herbal-wellness",
    name: "Herbal Wellness",
    description: "Everyday Ayurvedic staples for a gentler daily ritual.",
  },
];

export const products: Product[] = [
  {
    id: "p-ghee",
    slug: "a2-bilona-desi-ghee",
    name: "A2 Bilona Desi Ghee",
    tagline: "Hand-churned · Gir cow milk",
    category: "oils-ghee",
    price: 1249,
    compareAtPrice: 1399,
    size: "500 ml",
    description:
      "Made the slow, traditional way: A2 milk from free-grazing Gir cows is set into curd overnight, hand-churned with a wooden bilona into butter, then simmered over a gentle wood fire until it turns golden and nutty. Grainy texture, deep aroma, nothing added.",
    ingredients: ["Cultured A2 Gir cow butter"],
    benefits: [
      "Rich in fat-soluble vitamins A, D, E and K",
      "High smoke point for everyday Indian cooking",
      "Traditionally valued in Ayurveda for digestion",
    ],
    images: [
      { src: unsplash("1573812461383-e5f8b759d12e"), alt: "Glass jar of golden ghee with a spoon" },
      { src: unsplash("1736752346246-61f4daedfde0"), alt: "Spoon resting in a bowl of melted ghee" },
      { src: unsplash("1702650730093-43cfa3237228"), alt: "Bowl of grainy homemade ghee on a table" },
    ],
    featured: true,
    badge: "Bestseller",
    rating: 4.9,
    reviewCount: 312,
  },
  {
    id: "p-honey",
    slug: "wild-forest-honey",
    name: "Wild Forest Honey",
    tagline: "Raw · Unfiltered · Unheated",
    category: "sweeteners",
    price: 549,
    size: "500 g",
    description:
      "Collected by forest communities from wild hives in the Sundarbans fringe. We strain it only through muslin, so the pollen, enzymes and floral character stay intact. It may crystallise in winter; that is a sign of real, raw honey.",
    ingredients: ["100% raw multi-floral wild honey"],
    benefits: [
      "Natural enzymes and antioxidants preserved",
      "Soothing for the throat with warm water and lemon",
      "A wholesome swap for refined sugar",
    ],
    images: [
      { src: unsplash("1587049352851-8d4e89133924"), alt: "Clear glass jar filled with amber honey" },
      { src: unsplash("1613548058193-1cd24c1bebcf"), alt: "Honey dripping from a wooden dipper into a jar" },
      { src: unsplash("1642067958024-1a2d9f836920"), alt: "Close-up of golden honeycomb" },
    ],
    featured: true,
    rating: 4.8,
    reviewCount: 228,
  },
  {
    id: "p-turmeric",
    slug: "lakadong-turmeric-powder",
    name: "Lakadong Turmeric Powder",
    tagline: "7–9% curcumin · Meghalaya",
    category: "spices",
    price: 299,
    size: "200 g",
    description:
      "Lakadong turmeric from the Jaintia Hills is among the most curcumin-rich in the world. Our farmers harvest, boil and sun-dry the rhizomes before we stone-grind them in small batches, giving a deep saffron colour and warm, earthy aroma.",
    ingredients: ["Sun-dried Lakadong turmeric root"],
    benefits: [
      "Naturally high curcumin content",
      "Supports everyday immunity and joint comfort",
      "Perfect for haldi doodh, curries and face packs",
    ],
    images: [
      { src: unsplash("1768729340164-7d83fe18384d"), alt: "Bowl of bright turmeric powder with fresh roots and leaves" },
      { src: unsplash("1583949885751-23b7d1909378"), alt: "Turmeric roots and powder on a pale wooden surface" },
      { src: unsplash("1702041295331-840d4d9aa7c9"), alt: "Close-up texture of fine turmeric powder" },
    ],
    featured: true,
    badge: "Single origin",
    rating: 4.9,
    reviewCount: 187,
  },
  {
    id: "p-mustard-oil",
    slug: "cold-pressed-mustard-oil",
    name: "Cold-Pressed Mustard Oil",
    tagline: "Wood-pressed · Kachi Ghani",
    category: "oils-ghee",
    price: 349,
    size: "1 L",
    description:
      "Black mustard seeds from Bengal farms are pressed slowly in a traditional wooden ghani at low temperature. The result is a pungent, golden oil with its natural nutrients and sharp aroma intact, the soul of every Bengali kitchen.",
    ingredients: ["Cold-pressed black mustard seed oil"],
    benefits: [
      "Rich in heart-friendly MUFA and omega-3",
      "No heat, no chemicals, no blending",
      "Ideal for pickles, tadka and massage",
    ],
    images: [
      { src: unsplash("1552592074-ea7a91b851b3"), alt: "Glass bottle of golden oil on a light background" },
      { src: unsplash("1701188543419-f2e932565056"), alt: "Pile of mustard seeds next to a wooden spoon" },
      { src: unsplash("1767607186818-3094b408222f"), alt: "Field of yellow mustard flowers under sunlight" },
    ],
    featured: true,
    rating: 4.7,
    reviewCount: 154,
  },
  {
    id: "p-jaggery",
    slug: "organic-jaggery-powder",
    name: "Organic Jaggery Powder",
    tagline: "Chemical-free · Sugarcane",
    category: "sweeteners",
    price: 199,
    size: "500 g",
    description:
      "Fresh sugarcane juice is boiled in open iron pans and stirred by hand until it sets, then gently crushed into a free-flowing powder. No sulphur, no bleach, just the caramel-and-molasses sweetness of the cane.",
    ingredients: ["Organic sugarcane juice"],
    benefits: [
      "Retains iron and minerals lost in white sugar",
      "Dissolves easily in tea, milk and desserts",
      "Traditionally eaten after meals to aid digestion",
    ],
    images: [
      { src: unsplash("1788238025855-55581a2ed354"), alt: "Pieces of jaggery on a small engraved metal plate" },
      { src: unsplash("1775817590687-f1da5d70d9ad"), alt: "Pile of small round palm jaggery pieces" },
      { src: unsplash("1576394435759-02a2674ff6e0"), alt: "Sweet pongal made with jaggery cooking over firewood" },
    ],
    rating: 4.6,
    reviewCount: 96,
  },
  {
    id: "p-moringa",
    slug: "moringa-leaf-powder",
    name: "Moringa Leaf Powder",
    tagline: "Shade-dried · Superfood",
    category: "herbal-wellness",
    price: 329,
    size: "150 g",
    description:
      "Young moringa leaves are picked at dawn, washed, and shade-dried to protect their vivid green colour and nutrients before being finely milled. Stir a teaspoon into smoothies, dals or warm water.",
    ingredients: ["Shade-dried Moringa oleifera leaves"],
    benefits: [
      "Naturally rich in iron, calcium and vitamin C",
      "Plant protein for daily energy",
      "Gentle, grassy flavour that blends easily",
    ],
    images: [
      { src: unsplash("1565117661210-fd54898de423"), alt: "Fine green moringa powder in a white bowl" },
      { src: unsplash("1650494701391-daceb922ce9d"), alt: "Fresh moringa pods and flowers on a white surface" },
      { src: unsplash("1704079698754-5e621edb610b"), alt: "Close-up texture of green herbal powder" },
    ],
    badge: "New",
    rating: 4.7,
    reviewCount: 64,
  },
  {
    id: "p-tulsi-tea",
    slug: "tulsi-green-tea",
    name: "Tulsi Green Tea",
    tagline: "Holy basil · Whole leaf",
    category: "herbal-wellness",
    price: 399,
    size: "100 g",
    description:
      "Whole-leaf green tea from Darjeeling's lower slopes, blended with three kinds of tulsi (Rama, Krishna and Vana) grown on our partner farms. Light, floral and calming, an evening cup that settles the mind.",
    ingredients: ["Green tea leaves", "Rama tulsi", "Krishna tulsi", "Vana tulsi"],
    benefits: [
      "Adaptogenic tulsi helps the body handle stress",
      "Antioxidant-rich green tea catechins",
      "Low caffeine, gentle enough for evenings",
    ],
    images: [
      { src: unsplash("1606163017137-888c0177b3dd"), alt: "Dried loose tea leaves on a white surface" },
      { src: unsplash("1701520839071-55bdfe64c5ed"), alt: "Cup of tea beside a bowl of loose leaves and a book" },
      { src: unsplash("1641997825980-cbaf406765db"), alt: "Teapot and two cups of green tea" },
    ],
    rating: 4.8,
    reviewCount: 121,
  },
  {
    id: "p-amla",
    slug: "amla-murabba",
    name: "Amla Murabba",
    tagline: "Slow-cooked · In jaggery",
    category: "herbal-wellness",
    price: 279,
    size: "400 g",
    description:
      "Whole Indian gooseberries from Pratapgarh are pricked by hand, soaked, and slow-cooked in jaggery syrup with a hint of cardamom until tender and translucent. One amla a day, the old-fashioned way.",
    ingredients: ["Indian gooseberry (amla)", "Jaggery", "Cardamom"],
    benefits: [
      "One of nature's richest sources of vitamin C",
      "Traditionally used for hair, skin and immunity",
      "Sweetened with jaggery, never refined sugar",
    ],
    images: [
      { src: unsplash("1676043967557-2b70d9facd71"), alt: "Fresh green amla gooseberries stacked together" },
      { src: unsplash("1671769194818-8ef02e30211b"), alt: "Gooseberries hanging from a tree branch" },
      { src: unsplash("1676043966983-f5bd22435e64"), alt: "Pile of fresh amla" },
    ],
    rating: 4.6,
    reviewCount: 78,
  },
];
