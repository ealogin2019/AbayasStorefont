import { RequestHandler } from "express";
import { Product } from "@shared/api";

const products: Product[] = [
  {
    id: "sable-classic-black",
    name: "Sable Classic Abaya",
    price: 475.0,
    currency: "AED",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2F9382199df584402087537bef94280808?format=webp&width=1200",
    thumbnail:
      "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2F9382199df584402087537bef94280808?format=webp&width=800",
    gallery: [
      "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2F9382199df584402087537bef94280808?format=webp&width=1200",
      "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2F81ce6da7ab2f4a539be7643f189385d0?format=webp&width=1200",
      "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2Fe98ea904eac24d2a837f6a410800c6d1?format=webp&width=1200",
    ],
    colors: ["Black"],
    sizes: ["S", "M", "L", "XL"],
    description:
      "A timeless black abaya crafted in premium crepe with a flowing silhouette and subtle satin piping.",
    tags: ["classic", "black", "modest"],
    inStock: true,
  },
  {
    id: "noor-sand-kimono",
    name: "Noor Sand Kimono Abaya",
    price: 585.0,
    currency: "AED",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2Faaa7802432b14c2bb78ec506a8aab37b?format=webp&width=1200",
    thumbnail:
      "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2Faaa7802432b14c2bb78ec506a8aab37b?format=webp&width=800",
    gallery: [
      "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2Faaa7802432b14c2bb78ec506a8aab37b?format=webp&width=1200",
      "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2Fc2f5ee03e6da48eb9353b11f7bc7da48?format=webp&width=1200",
      "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2Fe98ea904eac24d2a837f6a410800c6d1?format=webp&width=1200",
    ],
    colors: ["Sand", "Beige"],
    sizes: ["S", "M", "L"],
    description:
      "Lightweight kimono-style abaya in warm sand tone, perfect for layering and all-day comfort.",
    tags: ["kimono", "sand", "lightweight"],
    inStock: true,
  },
  {
    id: "almond-embroidered-edge",
    name: "Almond Embroidered Edge",
    price: 695.0,
    currency: "AED",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2Fe98ea904eac24d2a837f6a410800c6d1?format=webp&width=1200",
    thumbnail:
      "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2Fe98ea904eac24d2a837f6a410800c6d1?format=webp&width=800",
    gallery: [
      "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2Fe98ea904eac24d2a837f6a410800c6d1?format=webp&width=1200",
      "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2F81ce6da7ab2f4a539be7643f189385d0?format=webp&width=1200",
      "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2F9382199df584402087537bef94280808?format=webp&width=1200",
    ],
    colors: ["Almond", "Ivory"],
    sizes: ["M", "L", "XL"],
    description:
      "Elegant almond abaya with hand-embroidered edges and tailored drape.",
    tags: ["embroidered", "almond", "elegant"],
    inStock: true,
  },
  {
    id: "gold-trim-eid",
    name: "Eid Gold Trim Abaya",
    price: 805.0,
    currency: "AED",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2Fc2f5ee03e6da48eb9353b11f7bc7da48?format=webp&width=1200",
    thumbnail:
      "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2Fc2f5ee03e6da48eb9353b11f7bc7da48?format=webp&width=800",
    gallery: [
      "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2Fc2f5ee03e6da48eb9353b11f7bc7da48?format=webp&width=1200",
      "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2F9382199df584402087537bef94280808?format=webp&width=1200",
      "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2Faaa7802432b14c2bb78ec506a8aab37b?format=webp&width=1200",
    ],
    colors: ["Black", "Gold"],
    sizes: ["S", "M", "L", "XL"],
    description:
      "Occasion abaya in deep black with refined gold trim accents for a luxe finish.",
    tags: ["occasion", "gold", "luxe"],
    inStock: true,
  },
];

export const listProducts: RequestHandler = (_req, res) => {
  res.json({ products });
};

export const getProduct: RequestHandler = (req, res) => {
  const id = String(req.params.id);
  const product = products.find((p) => p.id === id);
  if (!product) return res.status(404).json({ error: "Not found" });
  res.json({ product });
};

export const featuredProducts = products.slice(0, 3);
