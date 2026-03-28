import { test, expect } from "@playwright/test";

export default function productTestCollection() {

  /**
     * 
     */
  test("Workflow - register, login, create product and verify", async ({ request }) => {

    test.setTimeout(30_000); // Increase test timeout due to MongoDB Atlas being slow at times.

    //------------------------------------------------------------------------------
    // Create test objects
    //------------------------------------------------------------------------------
    const userReg = {
      name: "Michaela Janceova",
      email: "michaela.janceova@gmail.com",
      password: "12345678"
    }

    const userLogin = {
      email: "michaela.janceova@gmail.com",
      password: "12345678"
    }

    //------------------------------------------------------------------------------
    // Register user
    //------------------------------------------------------------------------------
    let response = await request.post("/api/user/register", { data: userReg });
    let json = await response.json();

    //console.log("Register:" + json);

    //expect(response.ok()).toBeTruthy();
    //expect(result).toHaveLength(0);
    expect(response.status()).toBe(201);


    //------------------------------------------------------------------------------
    // Login user
    //------------------------------------------------------------------------------
    response = await request.post("/api/user/login", { data: userLogin });
    json = await response.json();

    console.log("LOGIN RESPONSE:", json);

    const token = json.data.token;
    const userId = json.data.userID || json.data.userId || json.data.id || json.data._id;

    console.log("USER ID:", userId);

    expect(response.status()).toBe(200);


    //------------------------------------------------------------------------------
    // Create product
    //------------------------------------------------------------------------------
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

    response = await request.post("/api/jewelry/", {
      data: expectedProduct,
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    const createJson = await response.json();
    console.log("CREATE RESPONSE:", createJson);

    expect(response.status()).toBe(201);

    //------------------------------------------------------------------------------
    // Verify we have one product in the test repository
    //------------------------------------------------------------------------------
    response = await request.get("/api/jewelry/");
    json = await response.json();
    const receivedProduct = json[0];

    //console.log(json) // output receivedProduct
    // verify product data
    expect(receivedProduct.name).toEqual(expectedProduct.name);
    expect(receivedProduct.description).toEqual(expectedProduct.description);
    expect(receivedProduct.material).toEqual(expectedProduct.material);
    expect(receivedProduct.price).toEqual(expectedProduct.price);
    expect(receivedProduct.stock).toEqual(expectedProduct.stock);
    expect(receivedProduct.isOnDiscount).toEqual(expectedProduct.isOnDiscount);
    expect(receivedProduct.discount).toEqual(expectedProduct.discount);
    expect(receivedProduct.isFeatured).toEqual(expectedProduct.isFeatured);

    expect(json).toHaveLength(1);

  });
}