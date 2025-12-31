import { useState, useRef } from "react";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Upload, X, ImagePlus } from "lucide-react";
import { Card } from "@/ui/card";

interface ImageUploaderProps {
  image: string;
  thumbnail: string;
  gallery: string[];
  onImageChange: (url: string) => void;
  onThumbnailChange: (url: string) => void;
  onGalleryChange: (urls: string[]) => void;
  disabled?: boolean;
}

export default function ImageUploader({
  image,
  thumbnail,
  gallery,
  onImageChange,
  onThumbnailChange,
  onGalleryChange,
  disabled = false,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const mainInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    files: FileList | null,
    type: "main" | "thumbnail" | "gallery"
  ) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("Authentication required. Please log in again.");
        setUploading(false);
        return;
      }

      // Process each file
      const uploadedUrls = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        const isVideo = file.type.startsWith('video/');
        const isImage = file.type.startsWith('image/');
        
        if (!isVideo && !isImage) {
          throw new Error(`Invalid file type: ${file.name}`);
        }
        
        // Create FormData for multipart upload
        const formData = new FormData();
        formData.append("file", file);
        
        // Convert "main" to "product" for server API
        const uploadType = type === "main" ? "product" : type;

        // Upload to server - send type as query parameter
        const uploadResponse = await fetch(`/api/admin/upload?type=${uploadType}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok || !uploadData.success) {
          throw new Error(uploadData.error || "Upload failed");
        }

        uploadedUrls.push(uploadData.data.url);
      }

      // Update component state with uploaded URLs
      if (type === "main") {
        onImageChange(uploadedUrls[0]);
      } else if (type === "thumbnail") {
        onThumbnailChange(uploadedUrls[0]);
      } else if (type === "gallery") {
        const currentGallery = gallery || [];
        onGalleryChange([...currentGallery, ...uploadedUrls]);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to upload image. Please try again."
      );
      console.error("Image upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    const currentGallery = gallery || [];
    onGalleryChange(currentGallery.filter((_, i) => i !== index));
  };

  const handleClearMain = () => {
    onImageChange("");
    if (mainInputRef.current) mainInputRef.current.value = "";
  };

  const handleClearThumbnail = () => {
    onThumbnailChange("");
    if (thumbInputRef.current) thumbInputRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Main Image */}
      <Card className="p-4">
        <Label className="text-base font-semibold mb-3 block">
          Main Product Media *
        </Label>
        {image ? (
          <div className="relative inline-block mb-3">
            {image.match(/\.(mp4|webm|mov)$/i) ? (
              <video
                src={image}
                className="h-40 w-40 object-cover rounded border border-border"
                controls
                muted
                loop
              />
            ) : (
              <img
                src={image}
                alt="main"
                className="h-40 w-40 object-cover rounded border border-border"
              />
            )}
            <button
              type="button"
              onClick={handleClearMain}
              className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 hover:bg-destructive/80"
              disabled={disabled || uploading}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="h-40 w-40 bg-muted rounded border-2 border-dashed border-border flex items-center justify-center mb-3">
            <ImagePlus className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            ref={mainInputRef}
            type="file"
            accept="image/*,video/mp4,video/webm,video/quicktime"
            onChange={(e) => handleFileSelect(e.target.files, "main")}
            disabled={disabled || uploading}
            className="cursor-pointer flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => mainInputRef.current?.click()}
            disabled={disabled || uploading}
            className="sm:w-auto w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            Browse
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Images: JPG, PNG, GIF (Max 5MB) | Videos: MP4, WebM, MOV (Max 10MB)
        </p>
      </Card>

      {/* Thumbnail */}
      <Card className="p-4">
        <Label className="text-base font-semibold mb-3 block">
          Thumbnail Media *
        </Label>
        {thumbnail ? (
          <div className="relative inline-block mb-3">
            {thumbnail.match(/\.(mp4|webm|mov)$/i) ? (
              <video
                src={thumbnail}
                className="h-24 w-24 object-cover rounded border border-border"
                controls
                muted
                loop
              />
            ) : (
              <img
                src={thumbnail}
                alt="thumbnail"
                className="h-24 w-24 object-cover rounded border border-border"
              />
            )}
            <button
              type="button"
              onClick={handleClearThumbnail}
              className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 hover:bg-destructive/80"
              disabled={disabled || uploading}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="h-24 w-24 bg-muted rounded border-2 border-dashed border-border flex items-center justify-center mb-3">
            <ImagePlus className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            ref={thumbInputRef}
            type="file"
            accept="image/*,video/mp4,video/webm,video/quicktime"
            onChange={(e) => handleFileSelect(e.target.files, "thumbnail")}
            disabled={disabled || uploading}
            className="cursor-pointer flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => thumbInputRef.current?.click()}
            disabled={disabled || uploading}
            className="sm:w-auto w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            Browse
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Small preview (Max 2MB image or 10MB video)
        </p>
      </Card>

      {/* Gallery */}
      <Card className="p-4">
        <Label className="text-base font-semibold mb-3 block">
          Gallery Media
        </Label>
        {(gallery || []).length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-3">
            {(gallery || []).map((url, idx) => (
              <div key={idx} className="relative">
                {url.match(/\.(mp4|webm|mov)$/i) ? (
                  <video
                    src={url}
                    className="h-24 w-24 object-cover rounded border border-border"
                    controls
                    muted
                    loop
                  />
                ) : (
                  <img
                    src={url}
                    alt={`gallery-${idx}`}
                    className="h-24 w-24 object-cover rounded border border-border"
                  />
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveGalleryImage(idx)}
                  className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 hover:bg-destructive/80"
                  disabled={disabled || uploading}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            ref={galleryInputRef}
            type="file"
            accept="image/*,video/mp4,video/webm,video/quicktime"
            multiple
            onChange={(e) => handleFileSelect(e.target.files, "gallery")}
            disabled={disabled || uploading}
            className="cursor-pointer flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => galleryInputRef.current?.click()}
            disabled={disabled || uploading}
            className="sm:w-auto w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            Browse
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Additional photos/videos (Max 10 items, images up to 5MB, videos up to 10MB)
        </p>
        {(gallery || []).length > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            {(gallery || []).length} item{(gallery || []).length !== 1 ? "s" : ""} added
          </p>
        )}
      </Card>

      <p className="text-xs text-muted-foreground">
        💡 <strong>Tip:</strong> Use clear, well-lit photos with consistent backgrounds. 
        Short videos (under 10 seconds) work great for showing fabric movement and detail.
      </p>
    </div>
  );
}
