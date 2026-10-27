import React, { useCallback, useState } from 'react';
import './ImageUploader.css';

const ImageUploader = ({ onImageSelect, isLoading }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                onImageSelect(file);
            }
        }
    }, [onImageSelect]);

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type.startsWith('image/')) {
                onImageSelect(file);
            }
        }
        // Clear the input value so the same file can be selected again
        e.target.value = null;
    };

    return (
        <div
            className={`image-uploader glass-panel ${isDragging ? 'dragging' : ''} ${isLoading ? 'loading' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            <input
                type="file"
                id="fileInput"
                accept="image/*"
                onChange={handleChange}
                disabled={isLoading}
            />
            <label htmlFor="fileInput" className="upload-label">
                <div className="upload-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                    </svg>
                </div>
                <h3>{isDragging ? 'Drop image here' : 'Drag & drop your image'}</h3>
                <p>or click to browse from your computer</p>
            </label>
        </div>
    );
};

export default ImageUploader;
