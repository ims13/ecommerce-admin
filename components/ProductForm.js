import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ProductForm({
     title:existingTitle,
     description:existingDescription,
     price:existingPrice,
     _id,
     images,
    }) {

    const [title,setTitle] = useState(existingTitle || '');
    const [description,setDescription] = useState(existingDescription || '');
    const [price,setPrice] = useState(existingPrice || '');
    const [goToProducts,setGoToProducts] = useState(false);
    const router = useRouter();

    async function saveProduct(ev){
        ev.preventDefault();
        const data = {title, description,price};
        if (_id) {
            //update
            await axios.put('/api/products', {...data,_id});
          } else {
            //create
            await axios.post('/api/products', data);
          }
          setGoToProducts(true);
        }
    if(goToProducts){
        router.push('/products'); // Use router.push() directly
        return null; // Return null since you're redirecting
    }

    function uploadImages(){

    }
    return (
        
            <form onSubmit={saveProduct}>
            <label>Product Name</label>
            <input type="text" 
            placeholder="product name"
            value={title}
            onChange={ev => setTitle(ev.target.value)}
            />

            <label>
                Photos
            </label>
            <div className="mb-2">
                <label className="w-24 h-24 flex items-center justify-center
                 text-sm gap-1 text-gray-500 rounded-lg bg-gray-200
                ">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
                </svg>
                <div>
                Upload
                </div>
                   <input type="file" onChange={uploadImages} className="hidden"/>
                </label>
                {!images?.length && (
                    <div>No photos in this product</div>
                )}
            </div>

            <label>Description</label>
            <textarea 
            placeholder="description" 
            value={description}
            onChange={ev => setDescription(ev.target.value)}
            />

            <label>Price (in USD)</label>

            <input type="number" placeholder="price"
            value={price}
            onChange={ev => setPrice(ev.target.value)}/>
            <button 
            type="submit" 
            className="btn-primary"
            >Save</button>
            </form>
    
    )
}