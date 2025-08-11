import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import { Button, Image } from "react-bootstrap";
import { PiUploadSimpleDuotone, PiXDuotone } from "react-icons/pi";

interface MediaFile {
    file: File;
    preview: string;
    id: string;
}

interface UploadMultipleProps {
    initialFiles?: string[];
    onFilesChange: (files: File[]) => void;
    maxFiles?: number;
    className?: string;
}

export default function UploadMultiple({
    initialFiles = [],
    onFilesChange,
    maxFiles = 5,
    className = ""
}: UploadMultipleProps) {
    const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Handle initial files
    useEffect(() => {
        const loadInitialFiles = async () => {
            const initialMediaFiles = await Promise.all(
                initialFiles.map(async (url) => ({
                    file: await fetch(url).then(r => r.blob()).then(blob =>
                        new File([blob], url.split('/').pop() || 'file', { type: blob.type })
                    ),
                    preview: url,
                    id: crypto.randomUUID()
                }))
            );
            setMediaFiles(initialMediaFiles);
        };

        if (initialFiles.length > 0) {
            loadInitialFiles();
        }
    }, [initialFiles]);

    // Cleanup previews on unmount
    useEffect(() => {
        return () => {
            mediaFiles.forEach(media => {
                if (media.preview.startsWith('blob:')) {
                    URL.revokeObjectURL(media.preview);
                }
            });
        };
    }, [mediaFiles]);

    const handleFiles = (files: FileList) => {
        const remainingSlots = maxFiles - mediaFiles.length;
        const newFiles = Array.from(files).slice(0, remainingSlots);

        const newMediaFiles = newFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            id: crypto.randomUUID()
        }));

        setMediaFiles(prev => {
            const updated = [...prev, ...newMediaFiles];
            onFilesChange(updated.map(m => m.file));
            return updated;
        });
    };

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
        handleFiles(e.dataTransfer.files);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            handleFiles(e.target.files);
        }
    };

    const handleRemove = (id: string) => {
        setMediaFiles(prev => {
            const mediaToRemove = prev.find(m => m.id === id);
            if (mediaToRemove?.preview.startsWith('blob:')) {
                URL.revokeObjectURL(mediaToRemove.preview);
            }
            const updated = prev.filter(m => m.id !== id);
            onFilesChange(updated.map(m => m.file));
            return updated;
        });
    };

    return (
        <div className={className}>
            <input
                type="file"
                multiple
                accept="image/*"
                className="d-none"
                ref={inputRef}
                onChange={handleFileChange}
            />

            <div
                className={`py-3 px-4 bg-primary-subtle border-primary rounded-3 cursor-pointer`}
                style={{ borderStyle: isDragging ? 'solid' : 'dashed' }}
                onClick={() => inputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="d-flex gap-3">
                    <div className="flex-shrink-0">
                        <PiUploadSimpleDuotone className="fs-1 text-primary" />
                    </div>
                    <div className="flex-grow-1">
                        <div className="fw-bold">Drop files here or click to upload.</div>
                        <div className="small text-muted">
                            Upload up to {maxFiles} files ({mediaFiles.length}/{maxFiles})
                        </div>

                        {mediaFiles.length > 0 && (
                            <div className="mt-4 d-flex flex-wrap gap-3">
                                {mediaFiles.map(media => (
                                    <div
                                        key={media.id}
                                        className="position-relative"
                                    >
                                        <Image
                                            src={media.preview}
                                            alt="Preview"
                                            className="rounded object-fit-cover img-thumbnail shadow-sm"
                                            style={{ width: 75, height: 75 }}
                                        />
                                        <Button
                                            variant="danger-subtle"
                                            size="sm"
                                            className="btn-icon rounded-circle position-absolute top-0 start-100 translate-middle"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemove(media.id);
                                            }}
                                        >
                                            <PiXDuotone />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
