import { Router, Request, Response } from 'express';
import {
    createJewelry,
    getAllJewelry,
    getJewelryById,
    updateJewelryById,
    deleteJewelrytById
} from './controllers/jewelryController';
import { 
    registerUser,
    loginUser,
    authenticateToken
} from './controllers/authController';

const router: Router = Router();

/**
 * @swagger
 * /:
 *   get:
 *     tags: [System]
 *     summary: Health check
 *     description: Basic route to check if the Jewelry API is running.
 *     responses:
 *       200:
 *         description: Server up and running.
 */
router.get("/", (req: Request, res: Response) => {
    res.status(200).send("Welcome to the Jewelry API");
  });


/**
 * @swagger
 * /user/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a new user
 *     description: Creates a new user account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/User"
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: Email already exists
 */
router.post('/user/register', registerUser);



/**
 * @swagger
 * /user/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Login user
 *     description: Authenticates a user and returns a token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful (token returned)
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Invalid email or password
 */
router.post('/user/login', loginUser);




/**
 * @swagger
 * /jewelry:
 *   post:
 *     tags: [Jewelry]
 *     summary: Create a new jewelry item
 *     description: Creates a new jewelry item. Requires authentication.
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Jewelry"
 *     responses:
 *       201:
 *         description: Jewelry item created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/jewelry', authenticateToken, createJewelry);


/**
 * @swagger
 * /jewelry:
 *   get:
 *     tags: [Jewelry]
 *     summary: Get all jewelry items
 *     description: Retrieves all jewelry items as JSON objects.
 *     responses:
 *       200:
 *         description: A list of jewelry items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Jewelry"
 */
router.get('/jewelry', getAllJewelry);


/**
 * @swagger
 * /jewelry/{id}:
 *   get:
 *     tags: [Jewelry]
 *     summary: Get jewelry item by ID
 *     description: Retrieves a specific jewelry item by its MongoDB id.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Jewelry item as JSON
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Jewelry"
 *       404:
 *         description: Jewelry item not found
 */
router.get('/jewelry/:id', getJewelryById);





/**
 * @swagger
 * /jewelry/{id}:
 *   put:
 *     tags: [Jewelry]
 *     summary: Update jewelry item
 *     description: Updates a specific jewelry item by its MongoDB id. Requires authentication.
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB id
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Jewelry"
 *     responses:
 *       200:
 *         description: Jewelry item updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Jewelry item not found
 */
router.put('/jewelry/:id', authenticateToken, updateJewelryById);




/**
 * @swagger
 * /jewelry/{id}:
 *   delete:
 *     tags: [Jewelry]
 *     summary: Delete jewelry item
 *     description: Deletes a specific jewelry item by its MongoDB id. Requires authentication.
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Jewelry item deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Jewelry item not found
 */
router.delete('/jewelry/:id', authenticateToken, deleteJewelrytById);




export default router;
