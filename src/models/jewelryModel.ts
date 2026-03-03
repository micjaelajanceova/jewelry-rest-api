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


type UpdateQuery<T> = {
    [key: string]: any;
} & {
    __v?: number;
    $set?: Partial<T> & { __v?: number };
    $setOnInsert?: Partial<T> & { __v?: number };
    $inc?: { __v?: number };
};

jewelrySchema.pre('findOneAndUpdate', function <T extends Document>(this: any) {
    const update = this.getUpdate() as UpdateQuery<T>;
    if (update.__v != null) {
        delete update.__v;
    }
    const keys: Array<'$set' | '$setOnInsert'> = ['$set', '$setOnInsert'];
    for (const key of keys) {
        if (update[key] != null && update[key]!.__v != null) {
            delete update[key]!.__v;
            if (Object.keys(update[key]!).length === 0) {
                delete update[key];
            }
        }
    }
    update.$inc = update.$inc || {};
    update.$inc.__v = 1;
});

export const jewelryModel = model<JewelryItem>('JewelryItem', jewelrySchema);