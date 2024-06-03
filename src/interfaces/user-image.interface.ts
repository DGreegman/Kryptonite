import { Document, Types } from 'mongoose';

interface IImage extends Document {
    filename: string;
    base64: string;
    user_id: Types.ObjectId;
}

export default IImage;
