import Image from '../models/user-image.model';
import fs from 'fs/promises';
import User from '../models/user.model';
import IImage from '../interfaces/user-image.interface';

class ImageService {
    // async save_image(filename: string, filepath: string, user_id: IImage) {
    //     try {
    //         const base64 = await this.convertToBase64(filepath);
    //         const user = await User.findById({ _id: user_id });
    //         console.log(user?._id);
    //         await Image.create({ filename, base64, user });
    //         await this.deleteFile(filepath);
    //     } catch (error: any | unknown) {
    //         console.log(`Error Saving Image ${error.message}`);
    //     }
    // }
    async save_image(filename: string, filepath: string, user_id: string) {
        try {
            // Ensure user_id is a string
            if (Buffer.isBuffer(user_id)) {
                user_id = user_id.toString('hex'); // or 'utf-8' depending on how the Buffer was created
            }

            const base64 = await this.convertToBase64(filepath);
            const user = await User.findById(user_id);

            if (!user) {
                throw new Error('User not found');
            }

            console.log(user.id);
            await Image.create({ filename, base64, user_id: user._id });
            await this.deleteFile(filepath);
        } catch (error: any | unknown) {
            console.log(`Error Saving Image: ${error.message}`);
        }
    }

    private async convertToBase64(filepath: string) {
        try {
            const file = await fs.readFile(filepath);
            return file.toString('base64');
        } catch (error: unknown | any) {
            console.error('Error converting to Base64:', error.message);
        }
    }

    private async deleteFile(filepath: string) {
        try {
            await fs.unlink(filepath);
        } catch (error: unknown | any) {
            console.error('Error deleting file:', error.message);
        }
    }
}

export default new ImageService();
