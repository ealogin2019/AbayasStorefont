/**
 * Seed homepage content
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedHomepage() {
  console.log("🌱 Seeding homepage content...");

  // Clear existing content
  await prisma.homepageContent.deleteMany();

  // Add hero content
  await prisma.homepageContent.create({
    data: {
      section: "hero",
      title: "DISCOVER THE RED CAPSULE",
      image: "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2F9382199df584402087537bef94280808?format=webp&width=1920",
      order: 0,
      isActive: true,
    },
  });

  // Add banner content
  await prisma.homepageContent.create({
    data: {
      section: "banner",
      title: "DISCOVER NOW",
      image: "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2F9382199df584402087537bef94280808?format=webp&width=1000",
      link: "/shop",
      order: 0,
      isActive: true,
    },
  });

  await prisma.homepageContent.create({
    data: {
      section: "banner",
      title: "WINTER 25 COLLECTION",
      image: "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2F9382199df584402087537bef94280808?format=webp&width=1000",
      link: "/shop",
      order: 1,
      isActive: true,
    },
  });

  console.log("✅ Homepage content seeded successfully!");
}

seedHomepage()
  .catch((error) => {
    console.error("❌ Error seeding homepage content:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });