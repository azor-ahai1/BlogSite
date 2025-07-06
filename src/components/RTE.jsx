import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Controller } from "react-hook-form";

function RTE({ name, control, label, defaultValue = "" }) {
    return (
        <div className="w-full">
            {label && (
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}

            <Controller
                name={name || "content"}
                control={control}
                render={({ field: { onChange } }) => (
                    <Editor
                        apiKey="fpf9l429q8pmk6tepwrofgy9j4nhkfdccesyzbqh8l4boawh"
                        initialValue={defaultValue}
                        init={{
                            height: 400,
                            menubar: true,
                            plugins: [
                                "image", "advlist", "autolink", "lists", "link",
                                "charmap", "preview", "anchor", "searchreplace",
                                "visualblocks", "code", "fullscreen", "insertdatetime",
                                "media", "table", "help", "wordcount",
                            ],
                            toolbar:
                                "undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | image media link | fullscreen code help",
                            content_style:
                                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                        }}
                        onEditorChange={onChange}
                    />
                )}
            />
        </div>
    );
}

export default RTE;
