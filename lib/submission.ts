import mongoose, { Schema } from 'mongoose';

const submissionSchema = new Schema({
    formId: {
        type: String,
        required: true,
    },
    userId: {
        type: String || undefined,
        required: false,
    },
    formData: {
        type: Array,
        required: true,
    },
});

const Submissions =
    mongoose.models.Submissions ||
    mongoose.model('Submissions', submissionSchema);

export default Submissions;
