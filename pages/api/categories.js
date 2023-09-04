import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import mongoose from "mongoose";

export default async function handle(req, res){

    const {method} = req;
    await mongooseConnect();

    if (method === 'GET'){
        res.json(await Category.find().populate('parent'));
    }

    if(method === 'POST'){
        const {name, parentCategory} = req.body;

        // Make sure to pass a valid parent category ID if available
        let parentCategoryId = null;
        if (parentCategory) {
            parentCategoryId = new mongoose.Types.ObjectId(parentCategory); // Assuming you imported mongoose at the top
        }

        const categoryDoc = await Category.create({
            name,
            parent:parentCategory});
        res.json(categoryDoc);
    }

}