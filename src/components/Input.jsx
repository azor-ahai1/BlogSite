import React, { useId } from "react";

function Input({ label, type = "text", className = "", ...props }, ref) {
    const id = useId();

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={id}
                    className="block mb-2 text-sm font-medium text-gray-700"
                >
                    {label}
                </label>
            )}
            <input
                type={type}
                id={id}
                ref={ref}
                className={`px-4 py-2 rounded-lg bg-white text-gray-900 outline-none border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 w-full ${className}`}
                {...props}
            />
        </div>
    );
}

export default React.forwardRef(Input);



// Another method to use React.forwardRef
// 
// const Input = React.forwardRef(
//     function Input({label, type="text", className="", ...props}, ref){
//         const id = useId();
//         return (
//             <div className="w-full">
//                 {label && <label htmlFor={id}>
//                     {label}
//                 </label>}
//                 <input type={type} className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`} ref={ref} {...props} id={id} />
//             </div>
//         )
//     }
// )
// 
// export default Input 


