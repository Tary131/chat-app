import React from 'react';

type ImagePreviewProps = {
    src: string;
};

const ImagePreview: React.FC<ImagePreviewProps> = ({ src }) => (
    <div className="flex flex-col items-center">
        <div className="bg-gray-200 p-2  shadow-lg mb-2">
            <img src={src} alt="Image Preview" className="w-16 h-16 object-cover " />
        </div>
    </div>
);

export default ImagePreview;
