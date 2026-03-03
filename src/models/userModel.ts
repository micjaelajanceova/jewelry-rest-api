import {Schema, model} from 'mongoose';
import {User} from '../interfaces/user';

const userSchema = new Schema<User>({
    name: {type: String, required: true, min: 6, max: 255},
    email: {type: String, required: true, min: 6, max: 255, unique: true},
    password: {type: String, required: true, min: 6, max: 255},
    registeredAt: {type: Date,required: true, default: Date.now}
});

export const UserModel = model<User>('User', userSchema);