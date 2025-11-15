import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, ImagePlus } from "lucide-react";
import { Card } from "@/components/ui/card";

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
      // For now, we'll just create object URLs for local preview
      // In production, this would upload to Cloudinary or your server
      
      if (type === "main") {
        const url = URL.createObjectURL(files[0]);
        onImageChange(url);
      } else if (type === "thumbnail") {
        const url = URL.createObjectURL(files[0]);
        onThumbnailChange(url);
      } else if (type === "gallery") {
        const urls = Array.from(files).map(file => URL.createObjectURL(file));
        onGalleryChange([...gallery, ...urls]);
      }
    } catch (err) {
      setError("Failed to process image. Please try again.");
      console.error("Image processing error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    onGalleryChange(gallery.filter((_, i) => i !== index));
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
          Main Product Image *
        </Label>
        {image ? (
          <div className="relative inline-block mb-3">
            <img
              src={image}
              alt="main"
              className="h-40 w-40 object-cover rounded border border-border"
            />
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
        <div className="flex gap-2">
          <Input
            ref={mainInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files, "main")}
            disabled={disabled || uploading}
            className="cursor-pointer"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => mainInputRef.current?.click()}
            disabled={disabled || uploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            Browse
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          JPG, PNG, GIF (Max 5MB)
        </p>
      </Card>

      {/* Thumbnail */}
      <Card className="p-4">
        <Label className="text-base font-semibold mb-3 block">
          Thumbnail Image *
        </Label>
        {thumbnail ? (
          <div className="relative inline-block mb-3">
            <img
              src={thumbnail}
              alt="thumbnail"
              className="h-24 w-24 object-cover rounded border border-border"
            />
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
        <div className="flex gap-2">
          <Input
            ref={thumbInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files, "thumbnail")}
            disabled={disabled || uploading}
            className="cursor-pointer"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => thumbInputRef.current?.click()}
            disabled={disabled || uploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            Browse
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Small preview image (Max 2MB)
        </p>
      </Card>

      {/* Gallery */}
      <Card className="p-4">
        <Label className="text-base font-semibold mb-3 block">
          Gallery Images
        </Label>
        {gallery.length > 0 && (
          <div className="grid grid-cols-4 gap-3 mb-3">
            {gallery.map((url, idx) => (
              <div key={idx} className="relative">
                <img
                  src={url}
                  alt={`gallery-${idx}`}
                  className="h-24 w-24 object-cover rounded border border-border"
                />
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
        <div className="flex gap-2">
          <Input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileSelect(e.target.files, "gallery")}
            disabled={disabled || uploading}
            className="cursor-pointer"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => galleryInputRef.current?.click()}
            disabled={disabled || uploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            Browse
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Additional product photos (Max 10 images)
        </p>
        {gallery.length > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            {gallery.length} image{gallery.length !== 1 ? "s" : ""} added
          </p>
        )}
      </Card>

      <p className="text-xs text-muted-foreground">
        💡 <strong>Tip:</strong> Use clear, well-lit product photos with
        consistent backgrounds for best results.
      </p>
    </div>
  );
}
