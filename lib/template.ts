import mongoose from "mongoose";

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  structure: {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    formList: {
      type: Array,
      required: true,
      trim: true,
      default: [],
    },
  },
});

const Templates =
  mongoose.models.Templates || mongoose.model("Templates", templateSchema);

export default Templates;
