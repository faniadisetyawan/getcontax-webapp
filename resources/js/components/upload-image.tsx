import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import { Button, Image } from "react-bootstrap";
import { PiPencilDuotone, PiUploadSimpleDuotone, PiXDuotone } from "react-icons/pi";

interface UploadImageProps {
    initialImage?: string | null;
    selectedImage?: File | null;
    onFileChange: (file: File | null) => void;
    width?: number;
    height?: number;
    className?: string;
    placeholderImage?: string;
}

export default function UploadImage({
    initialImage,
    selectedImage,
    onFileChange,
    width = 150,
    height = 150,
    className = "",
    placeholderImage = '/assets/blank-image.svg'
}: UploadImageProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string>(placeholderImage);
    const [isDragging, setIsDragging] = useState(false);

    // Handle initial and selected images
    useEffect(() => {
        if (selectedImage) {
            const url = URL.createObjectURL(selectedImage);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else if (initialImage) {
            setPreviewUrl(initialImage);
        } else {
            setPreviewUrl(placeholderImage);
        }
    }, [selectedImage, initialImage, placeholderImage]);

    const handleFile = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            onFileChange(file);
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    // Add drag and drop handlers
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const handleRemoveImage = () => {
        if (inputRef.current) {
            inputRef.current.value = '';
        }
        onFileChange(null);
    };

    const triggerFileInput = () => {
        inputRef.current?.click();
    }

    return (
        <div
            className={`mb-3 mx-auto position-relative ${className}`}
            style={{ width }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <input
                type="file"
                accept="image/*"
                className="d-none"
                ref={inputRef}
                onChange={handleFileChange}
            />

            <div
                className={`rounded cursor-pointer ${isDragging ? 'border border-2 border-primary' : ''}`}
                onClick={triggerFileInput}
            >
                <Image
                    src={previewUrl}
                    className={`shadow rounded object-fit-cover ${isDragging ? 'opacity-50' : ''
                        }`}
                    style={{ width, height }}
                    alt="Upload preview"
                />

                {isDragging && (
                    <div className="position-absolute top-50 start-50 translate-middle text-center">
                        <PiUploadSimpleDuotone className="fs-1 text-primary" />
                        <div className="small">Drop image here</div>
                    </div>
                )}
            </div>

            <div className="position-absolute top-0 start-100 translate-middle pt-3 pe-3">
                <Button
                    type="button"
                    variant="primary-subtle"
                    size="sm"
                    className="btn-icon rounded-circle shadow"
                    onClick={triggerFileInput}
                >
                    <PiPencilDuotone />
                </Button>
            </div>

            {(selectedImage || initialImage) && (
                <div className="position-absolute top-100 start-100 translate-middle pb-3 pe-3">
                    <Button
                        type="button"
                        variant="danger-subtle"
                        size="sm"
                        className="btn-icon rounded-circle shadow"
                        onClick={handleRemoveImage}
                    >
                        <PiXDuotone />
                    </Button>
                </div>
            )}
        </div>
    )
}
