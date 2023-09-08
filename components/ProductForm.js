import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";

import {ReactSortable} from "react-sortablejs";


export default function ProductForm({
     title:existingTitle,
     description:existingDescription,
     price:existingPrice,
     _id,
     images:existingImages,
     category: assignedCategory,
    }) {

    const [title,setTitle] = useState(existingTitle || '');
    const [description,setDescription] = useState(existingDescription || '');
    const [category, setCategory] = useState(assignedCategory || '');

    const [price,setPrice] = useState(existingPrice || '');
    const [images,setImages] = useState(existingImages || '');
    const [isUploading,setIsUploading] = useState(false);
    const [goToProducts,setGoToProducts] = useState(false);
    const [categories,setCategories] = useState([]);
    const router = useRouter();
    useEffect(()=>{
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        })
    })

    async function saveProduct(ev){
        ev.preventDefault();
        const data = {title, description,price,images,category};
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

    async function uploadImages(ev){
        const files = ev.target?.files;
        if(files?.length > 0){
            setIsUploading(true);
            const data = new FormData();
            for (const file of files){
                data.append('file', file);
            }
            
            try {
                const res = await axios.post('/api/upload', data);
                setImages(oldImages => {
                  return [...oldImages, ...res.data.links];
                });
                setIsUploading(false);
              } catch (error) {
                console.error('Axios error:', error);
              }
              
            };
    }
    function updateImagesOrder(images){
        setImages(images);
    }

    const propertiesToFill = [];
    if (categories.length > 0 && category){
        const selCatInfo = categories.find(({_id}) => _id === category);
        propertiesToFill.push(...selCatInfo.properties);
        while(selCatInfo?.parent?._id){
            const parentCat = categories.find(({_id}) => _id === category);
            propertiesToFill.push(parentCat)
        }
    }

    return (
            <form onSubmit={saveProduct}>
            <label>Product Name</label>
            <input type="text" 
            placeholder="product name"
            value={title}
            onChange={ev => setTitle(ev.target.value)}
            />
            <label>Category</label>
            <select value={category}
                    onChange={ev => setCategory(ev.target.value)}>
                <option value=""> Uncategorized</option>
                {
                    categories.length > 0 && categories.map(c =>{
                        <option key={c._id} value={c._id}> {c.name} </option>
                    })
                }
            </select>
            {categories.length > 0 && (
                <div>
                    {propertiesToFill.length > 0 && propertiesToFill.map(p =>(
                        <div>{p.name}</div>
                    ))}
                </div>
            )
            }
            <label>
                Photos
            </label>
            <div className="mb-2 flex flex-wrap gap-1">
                <ReactSortable
                list={images}
                className="flex flex-wrap gap-1"
                setList={updateImagesOrder}
                >

                {!!images?.length && images.map(link => (
                    <div key={link} className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200">
                        <img src={link} alt="" className="rounded-lg"/>
                    </div>
                ))}

              </ReactSortable>
                {isUploading &&(
                    <div className="h-24 flex items-center">
                        <Spinner />
                    </div>
                    )
                }
                <label className="w-24 h-24 cursor-pointer flex items-center justify-center
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