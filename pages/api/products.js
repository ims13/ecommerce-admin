import clientPromise from "@/lib/mongodb";
import mongoose from "mongoose";

export default async function handle(req, res){
    const {method} = req;
    await mongooseConnect();
    if (method === 'POST'){
        const {tittle, description, price} = req.body;
        const productDoc = await Product.create({
            tittle, description, price,
        })
        res.json(productDoc);
    }
}