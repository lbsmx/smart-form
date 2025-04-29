import mongoose, { Schema, Document } from 'mongoose';

interface FieldDocument extends Document {
    belong: string;
    label: string;
    type: string;
    required: boolean;
    options: object;
}

const fieldSchema: Schema<FieldDocument> = new mongoose.Schema({
    belong: {
        type: String,
        required: true,
    },
    label: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    required: {
        type: Boolean,
        default: true,
    },
    options: {
        type: Object,
        default: {},
    },
});

const Fields = mongoose.models.Fields || mongoose.model('Fields', fieldSchema);

export default Fields;
