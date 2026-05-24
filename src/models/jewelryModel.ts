import {Schema, model} from 'mongoose';
import {JewelryItem} from '../interfaces/jewelryItem';

const jewelrySchema = new Schema<JewelryItem>({
    name: {type: String, required: true, min: 6, max: 255},
    material: {type: String, required: true, enum: ['gold', 'silver', 'steel', 'other']},
    description: {type: String, required: false, min: 6, max: 255},
    imageURL: {type: String, required: true},
    price: {type: Number, required: true},
    stock: {type: Number, required: true},
    isOnDiscount: {type: Boolean, required: true, default: false},
    discount: {type: Number, required: true, default: 0},
    isFeatured: {type: Boolean, required: false},
    _createdBy: {type: String, ref: 'User' , required: true}
});


type UpdateDoc = Record<string, unknown> & {
    __v?: number;
    $set?: Partial<JewelryItem> & { __v?: number };
    $setOnInsert?: Partial<JewelryItem> & { __v?: number };
    $inc?: { __v?: number };
};

jewelrySchema.pre('findOneAndUpdate', function(this: { getUpdate(): unknown }) {
    const update = this.getUpdate() as UpdateDoc;
    if (update.__v != null) {
        delete update.__v;
    }
    const keys: ('$set' | '$setOnInsert')[] = ['$set', '$setOnInsert'];
    for (const key of keys) {
        const section = update[key] as ({ __v?: number } & Record<string, unknown>) | undefined;
        if (section != null && section.__v != null) {
            delete section.__v;
            if (Object.keys(section).length === 0) {
                delete update[key];
            }
        }
    }
    update.$inc = update.$inc ?? {};
    update.$inc.__v = 1;
});

export const jewelryModel = model<JewelryItem>('JewelryItem', jewelrySchema);