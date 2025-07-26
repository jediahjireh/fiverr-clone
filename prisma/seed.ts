import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function cleanDatabase() {
  // delete all data in dependency order to avoid conflicts
  await db.message.deleteMany({});
  await db.conversation.deleteMany({});
  await db.review.deleteMany({});
  await db.order.deleteMany({});
  await db.gig.deleteMany({});
  await db.session.deleteMany({});
  await db.account.deleteMany({});
  await db.user.deleteMany({});
}

async function seedDatabase() {
  // clean existing data first
  await cleanDatabase();

  // create two users with hashed passwords
  const hashedPassword = await bcrypt.hash("Password123", 10);
  const users = [];

  // create 20 sellers and 20 buyers
  for (let i = 0; i < 40; i++) {
    const isSeller = i < 20;
    const user = await db.user.create({
      data: {
        username: `${isSeller ? "seller" : "buyer"}${i + 1}`,
        email: `${isSeller ? "seller" : "buyer"}${i + 1}@example.com`,
        password: hashedPassword,
        isSeller,
        country: "South Africa",
        phone: "+27123456789",
        description: isSeller
          ? "Freelancer offering quality services"
          : "Looking for gigs",
      },
    });
    users.push(user);
  }

  // create 20 gigs (one per seller)
  const gigs = await Promise.all(
    users.slice(0, 20).map((seller, i) =>
      db.gig.create({
        data: {
          userId: seller.id,
          title: `Gig ${i + 1} Title`,
          description: `Detailed gig ${i + 1} description for testing.`,
          shortTitle: `Gig ${i + 1}`,
          shortDesc: `Short gig ${i + 1} desc.`,
          category: "Design",
          price: 100 + i * 5,
          cover: "https://dummyimage.com/600x400",
          images: [
            "https://dummyimage.com/400x300",
            "https://dummyimage.com/500x350",
          ],
          deliveryTime: 3,
          revisionNumber: 2,
          features: ["Feature A", "Feature B", "Feature C"],
        },
      }),
    ),
  );

  // create 20 orders, reviews conversations and messages
  for (let i = 0; i < 20; i++) {
    const seller = users[i];
    const buyer = users[20 + (i % 20)];
    const gig = gigs[i];

    await db.order.create({
      data: {
        gigId: gig.id,
        buyerId: buyer.id,
        sellerId: seller.id,
        title: gig.title,
        price: gig.price,
        image: gig.cover,
        paymentIntent: `pi_${i + 1}`,
        isCompleted: i % 2 === 0,
      },
    });

    await db.review.create({
      data: {
        gigId: gig.id,
        userId: buyer.id,
        star: 4 + (i % 2),
        desc: `Review ${i + 1}: Great service!`,
      },
    });

    const convo = await db.conversation.create({
      data: {
        sellerId: seller.id,
        buyerId: buyer.id,
        readBySeller: i % 2 === 0,
        readByBuyer: i % 2 !== 0,
        lastMessage: `Hello seller${i + 1}, I'd like to discuss the project.`,
      },
    });

    await db.message.create({
      data: {
        conversationId: convo.id,
        userId: buyer.id,
        desc: `Message ${i + 1} from buyer.`,
      },
    });
  }

  console.log("✅ Seed complete with 20 of each entity");
}

seedDatabase()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
