import { test, expect, APIRequestContext } from "@playwright/test";

export default function productTestCollection() {

  /**
   * Helper: registers a fresh user and returns { token, userId }
   */
  async function loginAsNewUser(request: APIRequestContext, suffix: string) {
    const email = `test.user.${suffix}@example.com`;
    await request.post("/api/user/register", {
      data: { name: "Test User", email, password: "password123" }
    });
    const res = await request.post("/api/user/login", {
      data: { email, password: "password123" }
    });
    const json = await res.json();
    return { token: json.data.token, userId: json.data.userID };
  }

  // ─── Workflow: register → login → create → verify ────────────────────────
  test("Workflow - register, login, create product and verify", async ({ request }) => {
    test.setTimeout(30_000);

    const { token, userId } = await loginAsNewUser(request, "workflow");

    const expectedProduct = {
      name: "Diamond Ring",
      material: "gold",
      description: "A beautiful diamond ring",
      imageURL: "https://picsum.photos/500/500",
      price: 100.96,
      stock: 15,
      isOnDiscount: true,
      discount: 25,
      isFeatured: false,
      _createdBy: userId
    };

    const createRes = await request.post("/api/jewelry/", {
      data: expectedProduct,
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(createRes.status()).toBe(201);

    const listRes = await request.get("/api/jewelry/");
    const list = await listRes.json();
    const item = list[0];

    expect(list).toHaveLength(1);
    expect(item.name).toEqual(expectedProduct.name);
    expect(item.description).toEqual(expectedProduct.description);
    expect(item.material).toEqual(expectedProduct.material);
    expect(item.price).toEqual(expectedProduct.price);
    expect(item.stock).toEqual(expectedProduct.stock);
    expect(item.isOnDiscount).toEqual(expectedProduct.isOnDiscount);
    expect(item.discount).toEqual(expectedProduct.discount);
    expect(item.isFeatured).toEqual(expectedProduct.isFeatured);
  });

  // ─── Get by ID ────────────────────────────────────────────────────────────
  test("Get jewelry item by ID", async ({ request }) => {
    test.setTimeout(30_000);

    const { token, userId } = await loginAsNewUser(request, "getbyid");

    const createRes = await request.post("/api/jewelry/", {
      data: {
        name: "Silver Necklace",
        material: "silver",
        imageURL: "https://picsum.photos/500/500",
        price: 49.99,
        stock: 5,
        isOnDiscount: false,
        discount: 0,
        _createdBy: userId
      },
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(createRes.status()).toBe(201);
    const created = await createRes.json();

    const getRes = await request.get(`/api/jewelry/${created._id}`);
    expect(getRes.status()).toBe(200);
    const item = await getRes.json();
    expect(item.name).toEqual("Silver Necklace");
    expect(item._id).toEqual(created._id);
  });

  // ─── Update ───────────────────────────────────────────────────────────────
  test("Update jewelry item by ID", async ({ request }) => {
    test.setTimeout(30_000);

    const { token, userId } = await loginAsNewUser(request, "update");

    const createRes = await request.post("/api/jewelry/", {
      data: {
        name: "Gold Bracelet",
        material: "gold",
        imageURL: "https://picsum.photos/500/500",
        price: 199.0,
        stock: 10,
        isOnDiscount: false,
        discount: 0,
        _createdBy: userId
      },
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(createRes.status()).toBe(201);
    const created = await createRes.json();

    const updateRes = await request.put(`/api/jewelry/${created._id}`, {
      data: { price: 149.0, isOnDiscount: true, discount: 25 },
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(updateRes.status()).toBe(200);

    const getRes = await request.get(`/api/jewelry/${created._id}`);
    const updated = await getRes.json();
    expect(updated.price).toEqual(149.0);
    expect(updated.isOnDiscount).toEqual(true);
    expect(updated.discount).toEqual(25);
  });

  // ─── Delete ───────────────────────────────────────────────────────────────
  test("Delete jewelry item by ID", async ({ request }) => {
    test.setTimeout(30_000);

    const { token, userId } = await loginAsNewUser(request, "delete");

    const createRes = await request.post("/api/jewelry/", {
      data: {
        name: "Steel Ring",
        material: "steel",
        imageURL: "https://picsum.photos/500/500",
        price: 29.99,
        stock: 20,
        isOnDiscount: false,
        discount: 0,
        _createdBy: userId
      },
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(createRes.status()).toBe(201);
    const created = await createRes.json();

    const deleteRes = await request.delete(`/api/jewelry/${created._id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(deleteRes.status()).toBe(200);

    const listRes = await request.get("/api/jewelry/");
    const list = await listRes.json();
    expect(list).toHaveLength(0);
  });

  // ─── Validation: reject invalid data (Joi) ────────────────────────────────
  test("Create jewelry with invalid data is rejected (Joi validation)", async ({ request }) => {
    test.setTimeout(30_000);

    const { token, userId } = await loginAsNewUser(request, "validation");

    // Invalid: material is not one of the allowed enum values
    const badRes = await request.post("/api/jewelry/", {
      data: {
        name: "Fake Item",
        material: "plastic",
        imageURL: "https://picsum.photos/500/500",
        price: 10,
        stock: 1,
        isOnDiscount: false,
        discount: 0,
        _createdBy: userId
      },
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(badRes.status()).toBe(400);

    // Invalid: missing required field (price)
    const missingRes = await request.post("/api/jewelry/", {
      data: {
        name: "No Price Item",
        material: "gold",
        imageURL: "https://picsum.photos/500/500",
        stock: 1,
        isOnDiscount: false,
        discount: 0,
        _createdBy: userId
      },
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(missingRes.status()).toBe(400);
  });
}
