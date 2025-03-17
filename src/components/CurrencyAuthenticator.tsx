
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Upload, AlertTriangle, CheckCircle, Loader2, Download, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { preprocessImage, analyzeCurrencyNote } from '@/utils/currencyAuthentication';

const CurrencyAuthenticator = () => {
  const [image, setImage] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setCapturedImage(null);
      };
      reader.readAsDataURL(file);
      setResult(null);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Failed to access camera. Please check permissions.",
        variant: "destructive",
      });
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        setImage(null);
        setResult(null);
        stopCamera();
      }
    }
  };

  const resetCamera = () => {
    setCapturedImage(null);
    startCamera();
  };

  const analyzeImage = async () => {
    const imageToAnalyze = image || capturedImage;
    if (!imageToAnalyze) {
      toast({
        title: "No Image",
        description: "Please upload or capture an image first.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setResult(null);

    try {
      // Preprocess the image
      const processedImageData = await preprocessImage(imageToAnalyze);
      
      // Analyze the currency note
      const analysisResult = await analyzeCurrencyNote(processedImageData);
      
      setResult(analysisResult);

      toast({
        title: "Analysis Complete",
        description: "Currency note analysis has been completed.",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadReport = () => {
    if (!result) return;

    // Create a simple report as text/html
    const reportContent = `
      <html>
        <head>
          <title>₹500 Currency Authentication Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #1a5fb4; }
            .result { font-size: 18px; font-weight: bold; margin: 20px 0; }
            .genuine { color: green; }
            .suspicious { color: orange; }
            .counterfeit { color: red; }
            .features { margin: 20px 0; }
            .feature { margin-bottom: 10px; }
            img { max-width: 100%; max-height: 300px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <h1>₹500 Currency Authentication Report</h1>
          <p>Generated on: ${new Date().toLocaleString()}</p>
          <div>
            <img src="${image || capturedImage}" alt="Currency Note" />
          </div>
          <div class="result ${result.authentic ? 'genuine' : (result.confidence < 0.7 ? 'suspicious' : 'counterfeit')}">
            Result: ${result.authentic ? 'GENUINE' : (result.confidence < 0.7 ? 'SUSPICIOUS' : 'COUNTERFEIT')}
          </div>
          <div>
            <p><strong>Confidence:</strong> ${Math.round(result.confidence * 100)}%</p>
          </div>
          <div class="features">
            <h2>Security Feature Analysis</h2>
            ${Object.entries(result.features).map(([key, value]: [string, any]) => `
              <div class="feature">
                <strong>${key.replace(/([A-Z])/g, ' $1').trim()}:</strong> 
                ${typeof value === 'boolean' 
                  ? (value ? '✓ Present' : '✗ Not Detected') 
                  : typeof value === 'number' 
                    ? `${Math.round(value * 100)}% match` 
                    : value}
              </div>
            `).join('')}
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([reportContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'currency_authentication_report.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">₹500 Currency Authentication</h1>
          <p className="text-muted-foreground">Upload or capture a ₹500 note to verify its authenticity using AI</p>
        </div>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload Image
            </TabsTrigger>
            <TabsTrigger value="camera" onClick={startCamera}>
              <Camera className="mr-2 h-4 w-4" />
              Use Camera
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upload a ₹500 Note Image</CardTitle>
                <CardDescription>
                  Choose a clear, well-lit image of the full ₹500 note for best results
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div 
                  className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileUpload} 
                  />
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Click to select a file or drag and drop</p>
                </div>
                {image && (
                  <div className="mt-4">
                    <p className="mb-2 text-sm font-medium">Preview:</p>
                    <div className="border rounded-lg overflow-hidden">
                      <img src={image} alt="Currency note preview" className="w-full object-contain max-h-[300px]" />
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={analyzeImage}
                  disabled={!image || isProcessing} 
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : "Analyze Image"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="camera" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Capture a ₹500 Note Image</CardTitle>
                <CardDescription>
                  Position the note clearly in the frame and ensure good lighting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!capturedImage ? (
                  <div className="relative border rounded-lg overflow-hidden aspect-video bg-black">
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      className="w-full h-full object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    <img src={capturedImage} alt="Captured image" className="w-full object-contain max-h-[300px]" />
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                {!capturedImage ? (
                  <Button 
                    onClick={captureImage} 
                    className="w-full"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Capture Image
                  </Button>
                ) : (
                  <div className="flex flex-col w-full gap-2">
                    <Button 
                      onClick={resetCamera} 
                      variant="outline" 
                      className="w-full"
                    >
                      Retake Photo
                    </Button>
                    <Button 
                      onClick={analyzeImage}
                      disabled={isProcessing} 
                      className="w-full"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : "Analyze Image"}
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Authentication Results</CardTitle>
              <CardDescription>
                Analysis of the ₹500 note security features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.authentic ? (
                <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/30">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <AlertTitle className="text-green-800 dark:text-green-400">Genuine Currency</AlertTitle>
                  <AlertDescription className="text-green-700 dark:text-green-500">
                    The analyzed note appears to be genuine with {Math.round(result.confidence * 100)}% confidence.
                  </AlertDescription>
                </Alert>
              ) : result.confidence < 0.7 ? (
                <Alert className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-900/30">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <AlertTitle className="text-yellow-800 dark:text-yellow-400">Suspicious Currency</AlertTitle>
                  <AlertDescription className="text-yellow-700 dark:text-yellow-500">
                    Some security features could not be verified. Recommend physical verification.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/30">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <AlertTitle className="text-red-800 dark:text-red-400">Likely Counterfeit</AlertTitle>
                  <AlertDescription className="text-red-700 dark:text-red-500">
                    Several security features are missing or don't match genuine currency patterns.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Security Features</h3>
                <ul className="space-y-2">
                  {Object.entries(result.features).map(([key, value]: [string, any], index) => (
                    <li key={index} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                      <span className="font-medium">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span>
                        {typeof value === 'boolean' ? (
                          value ? (
                            <span className="text-green-600 dark:text-green-400 font-medium">Present</span>
                          ) : (
                            <span className="text-red-600 dark:text-red-400 font-medium">Not Detected</span>
                          )
                        ) : typeof value === 'number' ? (
                          <span className={`font-medium ${value > 0.7 ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                            {Math.round(value * 100)}% match
                          </span>
                        ) : (
                          value
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button 
                onClick={downloadReport}
                className="w-full"
                variant="outline"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>

              <Button 
                className="w-full"
                variant="ghost"
                onClick={() => {
                  setImage(null);
                  setCapturedImage(null);
                  setResult(null);
                }}
              >
                Analyze Another Note
              </Button>
            </CardFooter>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center">
                <Info className="mr-2 h-5 w-5 text-primary" />
                Educational Guide
              </div>
            </CardTitle>
            <CardDescription>
              Learn about the security features of the ₹500 note
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h3 className="font-medium">Key Security Features of ₹500 Notes</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>Security Thread:</strong> Windowed security thread with inscriptions 'भारत' and 'RBI'. Look for the silver thread running vertically on the right side of the note that changes from silver to green when tilted.</li>
                <li><strong>Watermark:</strong> Portrait of Mahatma Gandhi with multi-tonal watermark and electrotype '500' on the right side. Hold the note against light to see this feature clearly.</li>
                <li><strong>Microlettering:</strong> 'RBI' and '500' visible under a magnifying glass. These micro-letters appear between the vertical band and Mahatma Gandhi portrait.</li>
                <li><strong>Color-shifting Ink:</strong> The numeral ₹500 on the bottom right changes from green to blue when tilted. This is one of the hardest features to replicate in counterfeits.</li>
                <li><strong>Portrait and See-through Register:</strong> Mahatma Gandhi portrait and electrotype watermark '500' on the right side. The portrait should have excellent sharpness and clarity.</li>
                <li><strong>Intaglio Printing:</strong> Raised printing of Mahatma Gandhi portrait, RBI seal, Guarantee and Promise clause, Governor's signature. Run your finger over these areas to feel the raised ink.</li>
                <li><strong>Identification Mark:</strong> Circle with ₹500 in raised print on the right side, designed to help visually impaired people identify the denomination.</li>
                <li><strong>Number Panels:</strong> Numbers growing from small to big on the top left and bottom right, with the number '500' in the Devanagari script on the top right side.</li>
                <li><strong>Latent Image:</strong> Denomination numeral '500' appears when the note is held at a 45-degree angle at eye level.</li>
                <li><strong>Fluorescence:</strong> The number panels glow under UV light. Authentic notes have specific parts that fluoresce under UV light.</li>
              </ul>
            </div>
            
            <div className="space-y-3 mt-4">
              <h3 className="font-medium">How to Verify a ₹500 Note</h3>
              <ol className="space-y-2 list-decimal pl-5">
                <li><strong>Visual Inspection:</strong> Examine the overall print quality. Authentic notes have sharp, clear printing without smudges or blurred edges.</li>
                <li><strong>Feel the Note:</strong> Authentic notes have a distinct texture due to intaglio printing. Counterfeit notes often feel smoother or different.</li>
                <li><strong>Check in Light:</strong> Hold the note against light to check for the watermark, security thread, and see-through register.</li>
                <li><strong>Tilt the Note:</strong> Observe color changes in the security features, particularly the color-shifting ink on the ₹500 numeral.</li>
                <li><strong>Magnify:</strong> Use a magnifying glass to check for microlettering and fine details that are difficult to replicate in counterfeits.</li>
                <li><strong>UV Light Test:</strong> Under UV light, specific portions of genuine notes will glow while counterfeits typically show different patterns.</li>
              </ol>
            </div>
            
            <div className="bg-muted p-4 rounded-lg mt-4">
              <h3 className="font-medium mb-2">What to Do If You Suspect a Counterfeit Note</h3>
              <p className="text-sm text-muted-foreground">If you receive a suspicious note, do not return it to the person who gave it to you. Instead:</p>
              <ul className="text-sm list-disc pl-5 mt-2 space-y-1">
                <li>Note details of when and where you received it</li>
                <li>Report it to the local police or a bank branch</li>
                <li>Bank officials are trained to identify counterfeit notes and will provide guidance</li>
                <li>Never attempt to use a note you suspect is counterfeit, as this is illegal</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CurrencyAuthenticator;
