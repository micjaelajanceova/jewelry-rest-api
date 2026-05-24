import { Request, Response } from 'express';
import Joi, { ValidationResult } from 'joi';
import { jewelryModel } from '../models/jewelryModel';
import { connect, disconnect } from '../repository/database';

function validateJewelryData(data: unknown): ValidationResult {
    const schema = Joi.object({
        name: Joi.string().min(2).max(255).required(),
        material: Joi.string().valid('gold', 'silver', 'steel', 'other').required(),
        description: Joi.string().min(2).max(255).optional().allow(''),
        imageURL: Joi.string().uri().required(),
        price: Joi.number().min(0).required(),
        stock: Joi.number().integer().min(0).required(),
        isOnDiscount: Joi.boolean().required(),
        discount: Joi.number().min(0).max(100).required(),
        isFeatured: Joi.boolean().optional(),
        _createdBy: Joi.string().required()
    });
    return schema.validate(data);
}



// Jewelry API Controller
// Handles CRUD operations for jewelry items

/**
 *  * Creates a new jewelry item
 * @param req 
 * @param res 
 */


export async function createJewelry(req: Request, res: Response): Promise<void> {
  const { error } = validateJewelryData(req.body);

  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }

  try {
    await connect();

    const product = new jewelryModel(req.body);
    const result = await product.save();

    res.status(201).json(result);
  } catch (err: any) {
    console.error("Create jewelry error:", err);
    res.status(500).json({
      message: "Failed to create jewelry item",
      error: err.message
    });
  } finally {
    await disconnect();
  }
}


/**
 * Retrieves all jewelry items from the database.
 * @param req 
 * @param res 
 */

export async function getAllJewelry(_req: Request, res: Response) {

  try {
    await connect();

    const result = await jewelryModel.find({});

    res.status(200).send(result);
  }
  catch (err) {
    res.status(500).send("Failed to retrieve jewelry items. Error: " + err);
  }
  finally {
    await disconnect();
  }
}



/**
* Retrieves a single jewelry item by its ID.
 * @param req 
 * @param res 
 */

export async function getJewelryById(req: Request, res: Response) {

  try {
    await connect();

    const id = req.params.id;
    const result = await jewelryModel.findById({_id: id});

    res.status(200).send(result);
  }
  catch (err) {
    res.status(500).send("Invalid jewelry ID format. Error: " + err);
  }
  finally {
    await disconnect();
  }
}




/**
 * Updates a jewelry item by its ID.
 * @param req 
 * @param res 
 */
export async function updateJewelryById(req: Request, res: Response) {

  const id = req.params.id;


  try {
    
    await connect();

    const result = await jewelryModel.findByIdAndUpdate(id, req.body, { new: true });

    if (!result) {
      res.status(404).send("Jewelry item not found with the provided ID.");
      return;
    }
    else {
      res.status(200).send('Jewelry item updated successfully.');
    }
  }

  catch (err) {
    res.status(500).send("Invalid jewelry ID or update data. Error: " + err);
  }
  
  finally {
    await disconnect();
  }
}



/**
 * Deletes a specific jewelry item by its unique ID.
 * @param req 
 * @param res 
 */
export async function deleteJewelrytById(req: Request, res: Response) {

  const id = req.params.id;

  try {
    await connect();

    const result = await jewelryModel.findByIdAndDelete(id);

    if (!result) {
      res.status(404).send('Jewelry item not found.');
    }
    else {
      res.status(200).send('Jewelry item successfully deleted.');
    }
  }

  catch (err) {
    res.status(500).send("Invalid jewelry ID format. Error: " + err);
  }

  finally {
    await disconnect();
  }
}
