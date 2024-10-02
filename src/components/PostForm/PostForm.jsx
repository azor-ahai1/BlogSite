import React, {useCallback, useState} from "react";
import { useForm } from "react-hook-form";
import appwriteService from '../../appwrite/config'
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Input, Select, RTE} from '../index'
import authService from "../../appwrite/auth";


function PostForm({post}){
    // console.log(post);

    const dateTime = new Date();
    const { register, handleSubmit, watch, setValue, control, getValues} = useForm({
        defaultValues: {
            title: post?.title || '',
            slug: post?.$id || '',
            content: post?.content || '',
            status: post?.status || 'active',
            dateCreated: `${dateTime.getDate()}-${dateTime.getMonth() + 1}-${dateTime.getFullYear()}`,
            timeCreated: `${dateTime.toLocaleTimeString().toUpperCase()}`,
            username: post?.username || `${authService.getCurrentUser.username}`,
        },
    });

    const navigate = useNavigate();
    const userData = useSelector(state => state.auth.userData);
    // console.log("UserData: ", userData); 

    const submit = async(data) => {
        if (!userData) {
            console.error("User data is not available");
            return;
        }
        // console.log(data);

        let file = null;
        if (data.image && data.image[0]) {
            file = await appwriteService.uploadFile(data.image[0]); 
        }
        if(post){
            // console.log(post)
            if(file){
                await appwriteService.deleteFile(post.featuredImage);
                console.log("Yes1")
            }

            const dbPost = await appwriteService.updatePost(
                post.$id, {
                    ...data, featuredImage: file ? file.$id : post.featuredImage, 
                }
            );
            // console.log(dbPost);

            if(dbPost){
                navigate(`/post/${dbPost.$id}`);
            }
        } 
        else {
            // const file = await appwriteService.uploadFile(data.image[0]);
            // console.log("no")
            if(file){
                const fileId = file.$id;
                data.featuredImage = fileId;
                const dbPost = await appwriteService.createPost({
                    ...data, userId: userData.$id,
                });

                // console.log("Yes3")

                if(dbPost){
                    navigate(`/post/${dbPost.$id}`)
                    // console.log("Yes4")
                }
            }
        }
    }

    const slugTransform = useCallback((value) => {
        if(value && typeof value === 'string') {
            // return value.trim().toLowerCase().replace(/^[a-zA-Z\d\s]+/g, '-').replace(/\s/g, '-');
            return value.trim().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        }
        return '';
    }, [])

    React.useEffect(() => {
        const subsription = watch((value, {name}) => {
            if(name === 'title'){
                const slug = setValue('slug', slugTransform(value.title, {shouldValidate: true}));
            }
        })

        return () => {
            subsription.unsubscribe();
        }
    }, [watch, slugTransform, setValue])



    return(
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap p-6 bg-gray-400 rounded-lg shadow-lg">
            <div className="w-full md:w-2/3 px-4 mb-6">
                <Input label="Title :" placeholder="Title" className="mb-4" {...register("title", { required: true })} inputClass="p-2 border rounded-lg w-full"/>
                <Input label="Slug :"  placeholder="Slug"  className="mb-4" {...register("slug", { required: true })} inputClass="p-2 border rounded-lg w-full" onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }} 
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} className="border rounded-lg p-4 bg-white mb-6"/>
            </div>
            <div className="w-full md:w-1/3 px-4 mb-6">
                <Input label="Featured Image :" type="file" className="mb-4" accept="image/png, image/jpg, image/jpeg, image/gif" {...register("image", { required: !post })} inputClass="p-2 border rounded-lg w-full" />
                {/* {imagePreview && (
                    <div className="w-full mb-4">
                        <img src={imagePreview} alt="Image Preview" className="rounded-lg object-cover" />
                    </div>
                )} */}
                {post && (
                    <div className="w-full mb-4">
                        <img src={appwriteService.getFilePreview(post.featuredImage)} alt={post.title} className="rounded-lg object-cover shadow-md" />
                    </div>
                )}
                <Select options={["active", "inactive"]} label="Status" className="mb-4" {...register("status", { required: true })} selectClass="p-2 border rounded-lg w-full bg-white"/>
                <Button type="submit" value="submit" bgColor={post ? "bg-green-500" : "bg-red-300"} className="w-full py-2 text-white font-semibold rounded-lg hover:scale-105 transition-transform duration-200">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    )
}

export default PostForm



// for image preview - Not Working
    // const [imagePreview, setImagePreview] = useState(post?.featuredImage ? appwriteService.getFilePreview(post.featuredImage) : null);
    // const handleImageChange = (e) => {
    //     const file = e.target.files[0];
    //     console.log("Selected file:", file); 
    //     if (file) {
    //         const imageURL = URL.createObjectURL(file);
    //         setImagePreview(imageURL);
    //     }
    // };
    // React.useEffect(() => {
    //     return () => {
    //         if (imagePreview) {
    //             URL.revokeObjectURL(imagePreview);
    //         }
    //     };
    // }, [imagePreview]);
