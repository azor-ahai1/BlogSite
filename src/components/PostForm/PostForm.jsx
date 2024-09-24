import React, {useCallback} from "react";
import { useForm } from "react-hook-form";
import appwriteService from '../../appwrite/config'
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Input, Select, RTE} from '../index'

function PostForm({post}){
    console.log(post);
    const { register, handleSubmit, watch, setValue, control, getValues} = useForm({
        defaultValues: {
            title: post?.title || '',
            slug: post?.$id || '',
            content: post?.content || '',
            status: post?.status || 'active',
        },
    });

    const navigate = useNavigate();
    const userData = useSelector(state => state.auth.userData);

    const submit = async(data) => {
        console.log(data);
        if(post){
            const file = data.image[0] ? appwriteService.uploadFile(data.image[0]) : null ;
            console.log(post)
            if(file){
                appwriteService.deleteFile(post.featuredImage);
                console.log("Yes1")
            }

            const dbPost = await appwriteService.updatePost(
                post.$id, {
                    ...data, featuredImage: file? file.$id : undefined
                }
            );
            console.log(dbPost);

            if(dbPost){
                navigate(`/post/${dbPost.$id}`);
            }
        } 
        else {
            const file = await appwriteService.uploadFile(data.image[0]);
            console.log("no")
            if(file){
                const fileId = file.$id;
                data.featuredImage = fileId;
                const dbPost = await appwriteService.createPost({
                    ...data, userId: userData.$id
                });

                console.log("Yes3")

                if(dbPost){
                    navigate(`/post/${dbPost.$id}`)
                    console.log("Yes4")
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
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input label="Title :" placeholder="Title" className="mb-4" {...register("title", { required: true })} />
                <Input label="Slug :"  placeholder="Slug"  className="mb-4" {...register("slug", { required: true })} onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2">
                <Input label="Featured Image :" type="file" className="mb-4" accept="image/png, image/jpg, image/jpeg, image/gif" {...register("image", { required: !post })} />
                {post && (
                    <div className="w-full mb-4">
                        <img src={appwriteService.getFilePreview(post.featuredImage)} alt={post.title} className="rounded-lg" />
                    </div>
                )}
                <Select options={["active", "inactive"]} label="Status" className="mb-4" {...register("status", { required: true })} />
                <Button type="submit" value="submit" bgColor={post ? "bg-green-500" : "bg-red-300"} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    )
}

export default PostForm