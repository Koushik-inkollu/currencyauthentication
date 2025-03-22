
import React, { useState } from 'react';
import CurrencyAuthenticator from './CurrencyAuthenticator';
import ImageUploader from './ImageUploader';
import { Button } from '@/components/ui/button';
import { Shield, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CurrencyAuthWithImages: React.FC = () => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [authStep, setAuthStep] = useState<'upload' | 'verify'>('upload');
  const { toast } = useToast();
  
  const handleImagesSelected = (images: File[]) => {
    setSelectedImages(images);
  };
  
  const handleProceedToVerify = () => {
    if (selectedImages.length === 0) {
      toast({
        title: "No images selected",
        description: "Please upload at least one image to proceed.",
        variant: "destructive"
      });
      return;
    }
    
    setAuthStep('verify');
    toast({
      title: "Images uploaded",
      description: `${selectedImages.length} image(s) ready for verification.`
    });
  };
  
  const handleBackToUpload = () => {
    setAuthStep('upload');
  };
  
  return (
    <div className="space-y-6">
      {authStep === 'upload' ? (
        <>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Upload Currency Images</h2>
            <p className="text-muted-foreground">
              Select up to 2 images at once or take them one after another with your camera.
            </p>
          </div>
          
          <ImageUploader 
            onImagesSelected={handleImagesSelected}
            maxImages={2}
          />
          
          <div className="flex justify-end">
            <Button 
              onClick={handleProceedToVerify}
              className="gap-1"
              disabled={selectedImages.length === 0}
            >
              Proceed to Verification
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Currency Verification</h2>
            <Button variant="outline" onClick={handleBackToUpload}>
              Back to Images
            </Button>
          </div>
          
          <CurrencyAuthenticator />
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            {selectedImages.map((_, index) => (
              <div key={index} className="aspect-square rounded-lg bg-muted flex items-center justify-center">
                <div className="flex flex-col items-center text-center p-4">
                  <Shield className="h-12 w-12 text-primary mb-2" />
                  <p className="font-semibold">Image {index + 1}</p>
                  <p className="text-sm text-muted-foreground">Verification in progress</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CurrencyAuthWithImages;
