import clientPromise from "@/lib/mongodb";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/product";
import mongoose from "mongoose";

export default async function handle(req, res){
    const {method} = req;
    await mongooseConnect();

    if(method === 'GET'){
        if(req.query?.id){
            res.json(await Product.findOne({_id:req.query.id}));
        }else{
            res.json(await Product.find());
        }
        
    }
  
    if (method === 'POST'){
        const {title, description, price, images} = req.body;
        try {
            const productDoc = await Product.create({
                title, description, price, images,category
            });
            res.json(productDoc);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while creating the product.' });
        }
    }

    if(method === 'PUT'){
        const {title, description, price,images, _id} = req.body;
        await Product.updateOne({_id}, {title, description, price, images, category,});
        res.json(true);
    }

    if(method === 'DELETE'){
        if(req.query?.id){
            await Product.deleteOne({_id:req.query?.id});
            res.json(true);
        }
    }
}