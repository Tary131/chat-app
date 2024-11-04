import React, { useState, useRef } from 'react';
import { uploadImageToStorage } from '@/services/storageService'; // Import the upload function
import ImagePreview from '@/components/custom/ImagePreview.tsx';
import { AiOutlineUpload } from 'react-icons/ai';
import { Button } from "@/components/ui/button.tsx";

type ImageUploaderProps = {
    setImageUrl: (url: string | null) => void;
    setLoading: (loading: boolean) => void;
};

const ImageUploader: React.FC<ImageUploaderProps> = ({ setImageUrl, setLoading }) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setImagePreview(URL.createObjectURL(file));
            setLoading(true);

            try {
                const url = await uploadImageToStorage(file);
                if (url) {
                    setImageUrl(url);
                } else {

                    console.error("Image upload failed");
                }
            } catch (error) {
                console.error('Error during image upload:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="flex items-center">
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
            />
            <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center p-2 text-white hover:bg-black"
                aria-label="Upload Image"
            >
                <AiOutlineUpload size={24}/>
            </Button>
            {imagePreview && <ImagePreview src={imagePreview}/>}
        </div>
    );
};

export default ImageUploader;
