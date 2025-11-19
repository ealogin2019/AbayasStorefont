import "dotenv/config";
import { prisma } from "./Backend/db.js";

const sampleProducts = [
  {
    name: "Sable Classic Abaya",
    description: "A timeless black abaya crafted in premium crepe with a flowing silhouette and subtle satin piping.",
    price: 475.0,
    currency: "AED",
    image: "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2F9382199df584402087537bef94280808?format=webp&width=1200",
    thumbnail: "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2F9382199df584402087537bef94280808?format=webp&width=800",
    gallery: [
      "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2F9382199df584402087537bef94280808?format=webp&width=1200",
      "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2F81ce6da7ab2f4a539be7643f189385d0?format=webp&width=1200",
      "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2Fe98ea904eac24d2a837f6a410800c6d1?format=webp&width=1200",
    ],
    colors: ["Black"],
    sizes: ["S", "M", "L", "XL"],
    tags: ["classic", "black", "modest"],
    inStock: true,
    quantity: 50,
  },
  {
    name: "Noor Sand Kimono Abaya",
    description: "Lightweight kimono-style abaya in warm sand tone, perfect for layering and all-day comfort.",
    price: 585.0,
    currency: "AED",
    image: "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2Faaa7802432b14c2bb78ec506a8aab37b?format=webp&width=1200",
    thumbnail: "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2Faaa7802432b14c2bb78ec506a8aab37b?format=webp&width=800",
    gallery: [
      "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2Faaa7802432b14c2bb78ec506a8aab37b?format=webp&width=1200",
      "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2Fc2f5ee03e6da48eb9353b11f7bc7da48?format=webp&width=1200",
      "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2Fe98ea904eac24d2a837f6a410800c6d1?format=webp&width=1200",
    ],
    colors: ["Sand", "Beige"],
    sizes: ["S", "M", "L"],
    tags: ["kimono", "sand", "lightweight"],
    inStock: true,
    quantity: 35,
  },
  {
    name: "Almond Embroidered Edge",
    description: "Elegant almond abaya with hand-embroidered edges and tailored drape.",
    price: 695.0,
    currency: "AED",
    image: "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2Fe98ea904eac24d2a837f6a410800c6d1?format=webp&width=1200",
    thumbnail: "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2Fe98ea904eac24d2a837f6a410800c6d1?format=webp&width=800",
    gallery: [
      "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2Fe98ea904eac24d2a837f6a410800c6d1?format=webp&width=1200",
      "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2F81ce6da7ab2f4a539be7643f189385d0?format=webp&width=1200",
      "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2F9382199df584402087537bef94280808?format=webp&width=1200",
    ],
    colors: ["Almond", "Ivory"],
    sizes: ["M", "L", "XL"],
    tags: ["embroidered", "almond", "elegant"],
    inStock: true,
    quantity: 25,
  },
  {
    name: "Eid Gold Trim Abaya",
    description: "Occasion abaya in deep black with refined gold trim accents for a luxe finish.",
    price: 805.0,
    currency: "AED",
    image: "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2Fc2f5ee03e6da48eb9353b11f7bc7da48?format=webp&width=1200",
    thumbnail: "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2Fc2f5ee03e6da48eb9353b11f7bc7da48?format=webp&width=800",
    gallery: [
      "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2Fc2f5ee03e6da48eb9353b11f7bc7da48?format=webp&width=1200",
      "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2F9382199df584402087537bef94280808?format=webp&width=1200",
      "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2Faaa7802432b14c2bb78ec506a8aab37b?format=webp&width=1200",
    ],
    colors: ["Black", "Gold"],
    sizes: ["S", "M", "L", "XL"],
    tags: ["occasion", "gold", "luxe"],
    inStock: true,
    quantity: 20,
  },
];

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.customer.deleteMany({});

  // Seed products
  console.log("Creating products...");
  for (const product of sampleProducts) {
    await prisma.product.create({
      data: {
        ...product,
        gallery: product.gallery,
        colors: product.colors,
        sizes: product.sizes,
        tags: product.tags,
      },
    });
  }

  // Seed sample customer
  console.log("Creating sample customer...");
  await prisma.customer.create({
    data: {
      email: "customer@example.com",
      password: "hashed_password_here", // In production, this should be hashed
      firstName: "Sample",
      lastName: "Customer",
      phone: "+971501234567",
      address: "123 Sheikh Zayed Road",
      city: "Dubai",
      country: "UAE",
      zipCode: "00000",
    },
  });

  console.log("Seeding complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
