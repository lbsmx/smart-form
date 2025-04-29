import FieldType from '@/app/form/[id]/components/form-item/field-types';
import mongoose, { Document, Schema } from 'mongoose';

// Define the structure of the form document
interface FormDocument extends Document {
    title: string;
    formList: FieldType[];
}

// Create a Mongoose schema for the form collection
const formSchema: Schema<FormDocument> = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        formList: {
            type: [Object],
            required: true,
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

// Create a Mongoose model using the schema
const Forms =
    mongoose.models.Forms || mongoose.model<FormDocument>('Forms', formSchema);

export default Forms;
