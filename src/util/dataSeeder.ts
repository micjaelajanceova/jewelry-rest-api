import bcrypt from "bcrypt";
import dotenvFlow from "dotenv-flow";
import { faker } from "@faker-js/faker";

// Project imports (adjust names if yours differ)
import { jewelryModel } from "../models/jewelryModel";
import { UserModel } from "../models/userModel";
import { connect, disconnect } from "../repository/database";

dotenvFlow.config();

/**
 * Entry point: seeds the database with fake users + jewelry items
 */
async function seedDatabase() {
  try {
    await connect();

    await clearCollections();
    const { user1, user2 } = await createUsers();
    await createJewelryItems(user1._id.toString(), user2._id.toString(), 20);

    console.log("Seeding completed successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  } finally {
    await disconnect();
  }
}

/**
 * Deletes existing data (fresh start)
 */
async function clearCollections() {
  await jewelryModel.deleteMany({});
  await UserModel.deleteMany({});
  console.log("Cleared collections: jewelry + users");
}

/**
 * Creates a couple of users with the same known password (hashed)
 */
async function createUsers() {
  const passwordHash = await bcrypt.hash("12345678", 10);

  const user1 = await new UserModel({
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password: passwordHash,
    registeredAt: new Date(),
  }).save();

  const user2 = await new UserModel({
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password: passwordHash,
    registeredAt: new Date(),
  }).save();

  console.log("Created users:", user1.email, "and", user2.email);
  return { user1, user2 };
}

/**
 * Creates N jewelry items and assigns _createdBy to either user1 or user2
 */
async function createJewelryItems(userId1: string, userId2: string, amount: number) {
  const ringImages = [
    "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=500&q=80",
  ];

  const materials = ["gold", "silver", "steel", "other"] as const;

  for (let i = 0; i < amount; i++) {
    const createdBy = i % 2 === 0 ? userId1 : userId2;

    const isOnDiscount = faker.datatype.boolean();
    const discount = isOnDiscount ? faker.number.int({ min: 5, max: 40 }) : 0;

    await new jewelryModel({
      name: faker.commerce.productName() + "Ring",
      material: faker.helpers.arrayElement(materials),
      description: faker.commerce.productDescription(),
      imageURL: faker.helpers.arrayElement(ringImages),
      price: Number(faker.commerce.price({ min: 30, max: 400 })),
      stock: faker.number.int({ min: 0, max: 25 }),
      collection: faker.helpers.arrayElement(["Spring 2026", "Urban Line 2026", "Classic Essentials"]),
      isOnDiscount,
      discount,
      isFeatured: faker.datatype.boolean(),
      _createdBy: createdBy,
    }).save();
  }

  console.log(`Created ${amount} jewelry items`);
}

// run it
seedDatabase();