import mongoose, { Schema } from 'mongoose';
import IImage from '../interfaces/user-image.interface';

const ImageSchema = new Schema({
    filename: {
        type: String,
        required: true
    },
    base64: {
        type: String,
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Image = mongoose.model<IImage>('Image', ImageSchema);
export default Image;
