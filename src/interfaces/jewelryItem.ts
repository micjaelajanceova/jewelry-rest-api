import {User} from './user';

export interface JewelryItem extends Document {
    name: string;
    material: "gold" | "silver" | "steel" | "other";
    description: string;
    imageURL: string;
    price: number;
    stock: number;
    collection: string;
    isOnDiscount: boolean;
    discount: number;
    isFeatured: boolean;
    _createdBy: User['id'];
}