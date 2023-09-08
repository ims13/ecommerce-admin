const mongoose = require("mongoose");
import {model, models, Schema} from "mongoose";


const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref:'Category' }, // Corrected type usage
    properties: [{type:Object}]
});

export const Category = models?.Category || model('Category', CategorySchema);