import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Upload, RefreshCw, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FORMATS = ['image/jpeg', 'image/png'];

interface ImageUploaderProps {
  onImagesSelected: (images: File[]) => void;
  maxImages?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImagesSelected, 
  maxImages = 2 
}) => {
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  // Reference to video element for camera capture
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  
  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
      return false;
    }
    
    // Check file format
    if (!ALLOWED_FORMATS.includes(file.type)) {
      setError('Invalid file format. Only JPEG and PNG are supported.');
      return false;
    }
    
    setError(null);
    return true;
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!validateFile(file)) return;
    
    // Create a copy of current images
    const newImages = [...images];
    
    // If a slot is active, replace that image
    if (activeSlot !== null && activeSlot < maxImages) {
      const fileUrl = URL.createObjectURL(file);
      newImages[activeSlot] = { file, preview: fileUrl };
    } 
    // Otherwise, add to the end if we haven't reached max
    else if (images.length < maxImages) {
      const fileUrl = URL.createObjectURL(file);
      newImages.push({ file, preview: fileUrl });
    } else {
      toast({
        title: "Maximum images reached",
        description: `You can only upload up to ${maxImages} images.`,
        variant: "destructive"
      });
      return;
    }
    
    setImages(newImages);
    onImagesSelected(newImages.map(img => img.file));
    setActiveSlot(null);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const activateCamera = async (slotIndex: number) => {
    try {
      setActiveSlot(slotIndex);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast({
        title: "Camera Error",
        description: "Could not access your camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };
  
  const captureImage = () => {
    if (!videoRef.current || activeSlot === null) return;
    
    // Create canvas to capture the image
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Draw video frame to canvas
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          // Create a file from the blob
          const file = new File([blob], `captured-image-${Date.now()}.jpg`, { type: 'image/jpeg' });
          const preview = URL.createObjectURL(blob);
          
          // Update images array
          const newImages = [...images];
          newImages[activeSlot] = { file, preview };
          setImages(newImages);
          onImagesSelected(newImages.map(img => img.file));
          
          // Stop the camera
          stopCamera();
        }
      }, 'image/jpeg', 0.9);
    }
  };
  
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setIsCameraActive(false);
    setActiveSlot(null);
  };
  
  const removeImage = (index: number) => {
    const newImages = [...images];
    
    // Release object URL to prevent memory leaks
    URL.revokeObjectURL(newImages[index].preview);
    
    // Remove the image
    newImages.splice(index, index + 1);
    setImages(newImages);
    onImagesSelected(newImages.map(img => img.file));
  };
  
  const triggerFileInput = (slotIndex: number) => {
    setActiveSlot(slotIndex);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Clean up object URLs when component unmounts
  React.useEffect(() => {
    return () => {
      images.forEach(image => URL.revokeObjectURL(image.preview));
    };
  }, []);
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Upload Images</h3>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {isCameraActive ? (
        <div className="relative">
          <video 
            ref={videoRef} 
            className="w-full h-64 object-cover rounded-lg border-2 border-dashed border-primary/50"
          />
          <div className="flex justify-center gap-2 mt-2">
            <Button onClick={captureImage} variant="default">
              <Camera className="mr-2 h-4 w-4" />
              Capture
            </Button>
            <Button onClick={stopCamera} variant="outline">
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: maxImages }).map((_, index) => {
            const image = images[index];
            
            return (
              <div 
                key={index}
                className={`relative aspect-square rounded-lg border-2 border-dashed ${
                  image ? 'border-primary' : 'border-primary/50'
                } flex flex-col items-center justify-center p-2 transition-all hover:border-primary`}
              >
                {image ? (
                  // Image preview
                  <div className="relative w-full h-full">
                    <img 
                      src={image.preview} 
                      alt={`Selected image ${index + 1}`} 
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/50 rounded-lg transition-opacity">
                      <div className="flex gap-2">
                        <Button onClick={() => triggerFileInput(index)} size="sm" variant="secondary">
                          <RefreshCw className="h-4 w-4" />
                          Replace
                        </Button>
                        <Button onClick={() => removeImage(index)} size="sm" variant="destructive">
                          <X className="h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Empty slot
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">Image {index + 1}</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button onClick={() => triggerFileInput(index)} size="sm" variant="outline">
                        <Upload className="h-4 w-4 mr-1" />
                        Upload
                      </Button>
                      <Button onClick={() => activateCamera(index)} size="sm" variant="outline">
                        <Camera className="h-4 w-4 mr-1" />
                        Camera
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png"
        className="hidden"
      />
    </div>
  );
};

export default ImageUploader;
