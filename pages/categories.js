import Layout from "@/components/Layout";
import { category } from "@/models/category";
import axios from "axios";
import { useEffect, useState } from "react";
import EditProductPage from "./products/edit/[...id]";
import { withSwal } from 'react-sweetalert2';


function Categories({swal}) {
    const [editedCategory, setEditedCategory] = useState(null);
    const [name,setName] = useState('');
    const [categories,setCategories] = useState([]);
    const [Properties, setProperties] = useState([]);
    const [parentCategory,setParentCategory] = useState('');

    useEffect(()=> {
        fetchCategories();
    },[]);
    function fetchCategories(){
        axios.get('/api/categories').then(result =>{
            setCategories(result.data);
        });
    }
    
    async function saveCategory(ev){
        ev.preventDefault();
        const data = {name, parentCategory}

        if(editedCategory){
            data._id = editedCategory._id;
            await axios.put('/api/categories', data);
            setEditedCategory(null);
         }
        else{
            await axios.post('/api/categories', data);
         }
        
       
       setName('');
       fetchCategories();
    }

    function editCategory(category){
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
    }

    function deleteCategory(category){
        swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete ${category.name}?`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, Delete!',
            confirmButtonColor: '#d55',
            reverseButtons: true,
            
        }).then(async result => {
           if(result.isConfirmed){
            const {_id} = category;
            await axios.delete('/api/categories?_id=',+_id);
            fetchCategories();
           }
        });
    
     
  
    }

    function addProperty(){
        setProperties(prev => {
            return [...prev, {name:'',value:''}];
        });
    }
    function handlePropertyNameChange(index,property, newName){
        setProperties(prev => {
            const Properties = [...prev];
            Properties[index.name = newName;
            return Properties;
        
        });
    }

    function handlePropertyValuesChange(index,property, newValues){
        setProperties(prev => {
            const Properties = [...prev];
            Properties[index].values = newValues;
            return Properties;
        
        });
    }
    return (
        <Layout>
            <h1>Categories</h1>
            <label>
                {editedCategory 
                    ? `Edit category ${editedCategory.name} `
                    : 'Create new category'}
             </label>
            <form onSubmit={saveCategory} >
            <div className="flex gap-1">

            <input 
            
            type="text" 
            placeholder="Category name" 
            onChange={ev => setName(ev.target.value)}
            value={name}/>

            <select 
                    onChange={ev=> setParentCategory(ev.target.value)}
                    value={parentCategory}
            >
                <option value={0}>
                    No parent category
                </option>
                {categories.length > 0 && categories.map(
                        category => (
                            <option value={category._id}>{category.name} </option>
                        )
                    )}
            </select>

            </div>
            <div className="mb-2">
                <lebal className="block">
                    Properties
                </lebal>
                <button  
                 onClick={addProperty}
                 type="button" 
                 className="btn-default text-sm mb-2">
                    Add new Properties
                </button>
                {Properties.length > 0 && Properties.map((property, index) => (
                    <div className="flex gap-1">
                        <input type="text"
                               value={property.name} 
                               onChange={ev => handlePropertyNameChange(index,property, ev.target)}
                               placeholder="property name (example: color"/>
                        <input type="text"
                               onChange={ev =>
                                handlePropertyValuesChange(index,property,ev.target.value)        
                               }
                               value={property.values} placeholder="value, comma separated"/>
                    </div>
                ))}
            </div>

         
            <button type="submit" className="btn-primary py-1">Save</button>
            </form>
            <table className="basic mt-4">
                <thead>
                    <tr>
                        <td> Category name</td>
                        <td> Parent category</td>
                    </tr>
                </thead>
                <tbody>
                    {categories.length > 0 && categories.map(
                        category => (
                            <tr>
                                <td>{category.name}</td>
                                <td>{category?.parent?.name}</td>
                                <td>
                                    <button
                                     onClick={()=> editCategory(category)} 
                                     className="btn-primary mr-1"
                                     >
                                        Edit
                                     </button>

                                    <button 
                                    onClick={()=>deleteCategory(category)}
                                    className="btn-primary">Delete</button>
                                </td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>
           
        </Layout>
    );
}


export default withSwal(({ swal }, ref) => {
    return <Categories swal={swal} />;
  });
  