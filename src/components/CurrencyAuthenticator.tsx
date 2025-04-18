import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Camera, 
  Upload, 
  AlertTriangle, 
  CheckCircle, 
  Loader2, 
  Download, 
  Info, 
  Shield, 
  Eye, 
  ZoomIn, 
  IndianRupee, 
  Search,
  ArrowRight,
  Ban,
  FileCog
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { preprocessImage, analyzeCurrencyNote } from '@/utils/currencyAuthentication';
import { useLanguage } from '@/providers/LanguageProvider';
import { useEffect } from 'react';
import * as Tesseract from 'tesseract.js';

const validateCurrencyImage = async (imageData: string): Promise<{ 
  isValid: boolean; 
  confidence: number; 
  reason?: string;
  isPartial?: boolean;
  detectedFeatures: string[];
}> => {
  return new Promise(async (resolve) => {
    const img = new Image();
    
    img.onload = async () => {
      const aspectRatio = img.width / img.height;
      const validAspectRatio = aspectRatio > 1.8 && aspectRatio < 2.5;
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        let confidence = 0;
        
        if (validAspectRatio) {
          confidence += 0.2;
        }
        
        try {
          const result = await Tesseract.recognize(
            imageData,
            'eng+hin',
            { 
              logger: m => console.log(m),
            }
          );
          
          console.log("OCR Result:", result.data.text);
          
          const text = result.data.text.toLowerCase();
          const detectedFeatures = [];
          
          if (text.includes('500') || text.includes('₹500') || text.includes('rs 500') || text.includes('rs.500')) {
            confidence += 0.2;
            detectedFeatures.push('denomination');
          }
          
          if (text.includes('rbi') || text.includes('reserve bank')) {
            confidence += 0.15;
            detectedFeatures.push('rbi text');
          }
          
          if (text.includes('भारत') || text.includes('india') || text.includes('bharat')) {
            confidence += 0.15;
            detectedFeatures.push('country name');
          }
          
          if (text.includes('governor') || text.includes('promise to pay')) {
            confidence += 0.15;
            detectedFeatures.push('promise text');
          }
          
          const serialNumberRegex = /[a-zA-Z]{2,3}\s*\d{6,10}/g;
          if (serialNumberRegex.test(text)) {
            confidence += 0.15;
            detectedFeatures.push('serial number');
          }
          
          const isPartial = confidence >= 0.3 && confidence < 0.6;
          
          if (confidence >= 0.5 || detectedFeatures.length >= 2) {
            resolve({ 
              isValid: true, 
              confidence, 
              detectedFeatures,
              isPartial: isPartial
            });
          } else {
            resolve({ 
              isValid: false, 
              confidence,
              reason: 'insufficientFeatures', 
              detectedFeatures,
              isPartial: isPartial
            });
          }
          
        } catch (error) {
          console.error("OCR error:", error);
          if (validAspectRatio) {
            resolve({ 
              isValid: true, 
              confidence: 0.4,
              detectedFeatures: ['aspect ratio'],
              reason: 'ocrFailed'
            });
          } else {
            resolve({ 
              isValid: false, 
              confidence: 0.2,
              detectedFeatures: [],
              reason: 'invalidDimensions' 
            });
          }
        }
      } else {
        resolve({ 
          isValid: false, 
          confidence: 0,
          detectedFeatures: [],
          reason: 'canvasError' 
        });
      }
    };
    
    img.onerror = () => {
      resolve({ 
        isValid: false, 
        confidence: 0,
        detectedFeatures: [],
        reason: 'imageLoadError' 
      });
    };
    
    img.src = imageData;
  });
};

const CurrencyAuthenticator = () => {
  const [image, setImage] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [invalidImageAlert, setInvalidImageAlert] = useState<{ 
    show: boolean; 
    reason?: string; 
    isPartial?: boolean;
    confidence?: number;
    detectedFeatures?: string[];
  }>({ show: false });
  const [proceedAnyway, setProceedAnyway] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<{ [key: string]: React.RefObject<HTMLDivElement> }>({});
  const { t } = useLanguage();

  useEffect(() => {
    console.log('CurrencyAuthenticator loaded with language function:', !!t);
    
    sectionRefs.current = {
      uploadSection: React.createRef(),
      resultsSection: React.createRef(),
      educationalGuide: React.createRef(),
      frontNote: React.createRef(),
      backNote: React.createRef(),
      featuresSection: React.createRef(),
    };
    
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => new Set(prev).add(entry.target.id));
        }
      });
    };
    
    const observerOptions = {
      threshold: 0.2
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    Object.values(sectionRefs.current).forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });
    
    return () => observer.disconnect();
  }, [t]);

  useEffect(() => {
    if (resultsRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
            }
          });
        },
        { threshold: 0.1 }
      );
      
      observer.observe(resultsRef.current);
      
      return () => {
        observer.disconnect();
      };
    }
  }, [result]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setCapturedImage(null);
        setInvalidImageAlert({ show: false });
        setResult(null);
        setProceedAnyway(false);
      };
      reader.readAsDataURL(file);
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
        title: t('cameraError'),
        description: t('cameraPermissionError'),
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
        setInvalidImageAlert({ show: false });
        setResult(null);
        stopCamera();
      }
    }
  };

  const resetCamera = () => {
    setCapturedImage(null);
    setInvalidImageAlert({ show: false });
    startCamera();
  };

  const analyzeImage = async () => {
    const imageToAnalyze = image || capturedImage;
    if (!imageToAnalyze) {
      toast({
        title: t('noImage'),
        description: t('uploadImageFirst'),
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setResult(null);
    setInvalidImageAlert({ show: false });

    try {
      if (!proceedAnyway) {
        console.log("Validating image with OCR...");
        const validationResult = await validateCurrencyImage(imageToAnalyze);
        console.log("Validation result:", validationResult);
        
        if (!validationResult.isValid) {
          setIsProcessing(false);
          setInvalidImageAlert({ 
            show: true, 
            reason: validationResult.reason,
            isPartial: validationResult.isPartial,
            confidence: validationResult.confidence,
            detectedFeatures: validationResult.detectedFeatures
          });
          
          toast({
            title: validationResult.isPartial ? t('partialCurrencyNote') : t('invalidImage'),
            description: validationResult.isPartial 
              ? t('partialCurrencyDescription') 
              : t('notCurrencyNote'),
            variant: "warning",
          });
          
          return;
        }
      }
      
      const btn = document.querySelector('.analyze-btn');
      if (btn) {
        btn.classList.add('animate-pulse');
      }
      
      const processedImageData = await preprocessImage(imageToAnalyze);
      
      const analysisResult = await analyzeCurrencyNote(processedImageData);
      
      setResult(analysisResult);
      
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          resultsRef.current.classList.add('highlight-result');
          
          setTimeout(() => {
            if (resultsRef.current) {
              resultsRef.current.classList.remove('highlight-result');
            }
          }, 1500);
        }
      }, 300);

      toast({
        title: t('analysisComplete'),
        description: t('currencyAnalysisCompleted'),
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: t('analysisFailed'),
        description: t('tryAgain'),
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      const btn = document.querySelector('.analyze-btn');
      if (btn) {
        btn.classList.remove('animate-pulse');
      }
    }
  };

  const downloadReport = () => {
    if (!result) return;

    const reportContent = `
      <html>
        <head>
          <title>${t('reportTitle')}</title>
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
          <h1>${t('reportTitle')}</h1>
          <p>${t('generatedOn')}: ${new Date().toLocaleString()}</p>
          <div>
            <img src="${image || capturedImage}" alt="${t('currencyNote')}" />
          </div>
          <div class="result ${result.authentic ? 'genuine' : (result.confidence < 0.7 ? 'suspicious' : 'counterfeit')}">
            ${t('result')}: ${result.authentic ? t('genuine') : (result.confidence < 0.7 ? t('suspicious') : t('counterfeit'))}
          </div>
          <div>
            <p><strong>${t('confidence')}:</strong> ${Math.round(result.confidence * 100)}%</p>
          </div>
          <div class="features">
            <h2>${t('securityFeatureAnalysis')}</h2>
            ${Object.entries(result.features).map(([key, value]: [string, any]) => `
              <div class="feature">
                <strong>${key.replace(/([A-Z])/g, ' $1').trim()}:</strong> 
                ${typeof value === 'boolean' 
                  ? (value ? '✓ ' + t('present') : '✗ ' + t('notDetected')) 
                  : typeof value === 'number' 
                    ? `${Math.round(value * 100)}% ${t('match')}` 
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
    <div className="container py-8 max-w-5xl mx-auto">
      <div className="space-y-8">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight flex items-center">
            <span className="rupee-pulse inline-block mr-2"><IndianRupee className="h-8 w-8 text-primary" /></span>
            {t('500CurrencyAuthentication')}
          </h1>
          <p className="text-xl text-muted-foreground">{t('uploadCaptureDescription')}</p>
          
          <div className="mt-6">
            <Button 
              className="auth-button group"
              size="lg"
              onClick={() => document.getElementById('uploadSection')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t('startAuthentication')}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>

        <div 
          id="uploadSection" 
          ref={sectionRefs.current.uploadSection} 
          className={`fade-in-section ${visibleSections.has('uploadSection') ? 'is-visible' : ''}`}
        >
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload" className="btn-3d">
                <Upload className="mr-2 h-4 w-4" />
                {t('uploadImage')}
              </TabsTrigger>
              <TabsTrigger value="camera" onClick={startCamera} className="btn-3d">
                <Camera className="mr-2 h-4 w-4" />
                {t('useCamera')}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-4">
              <Card className="border-2 border-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="mr-2 h-5 w-5 text-primary" />
                    {t('upload500NoteImage')}
                  </CardTitle>
                  <CardDescription>
                    {t('chooseImage')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {invalidImageAlert.show && (
                    <Alert variant="warning" className="mb-4">
                      {invalidImageAlert.isPartial ? (
                        <AlertTriangle className="h-4 w-4" />
                      ) : (
                        <Ban className="h-4 w-4" />
                      )}
                      <AlertTitle>
                        {invalidImageAlert.isPartial 
                          ? t('partialCurrencyNote') 
                          : t('invalidImage')
                        }
                      </AlertTitle>
                      <AlertDescription className="space-y-2">
                        <p>
                          {invalidImageAlert.isPartial 
                            ? t('partialCurrencyDescription')
                            : t('notCurrencyNote')
                          }
                        </p>
                        
                        {invalidImageAlert.detectedFeatures && invalidImageAlert.detectedFeatures.length > 0 && (
                          <div className="text-sm mt-2">
                            <p><strong>{t('detectedFeatures')}:</strong> {invalidImageAlert.detectedFeatures.join(', ')}</p>
                          </div>
                        )}
                        
                        <div className="mt-3">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mr-2"
                            onClick={() => {
                              fileInputRef.current?.click();
                            }}
                          >
                            {t('tryDifferentImage')}
                          </Button>
                          
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => {
                              setProceedAnyway(true);
                              setInvalidImageAlert({ show: false });
                            }}
                          >
                            <FileCog className="mr-1 h-4 w-4" />
                            {t('proceedAnyway')}
                          </Button>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {proceedAnyway && (
                    <Alert variant="warning" className="mb-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>{t('proceedingAnyway')}</AlertTitle>
                      <AlertDescription>
                        {t('proceedingAnywayDescription')}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div 
                    className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleFileUpload} 
                    />
                    <div className="glassmorphism p-4 rounded-full mb-4">
                      <Upload className="h-10 w-10 text-primary" />
                    </div>
                    <p className="text-center text-muted-foreground mb-2">{t('dragAndDrop')}</p>
                    <p className="text-xs text-muted-foreground">{t('supportedFormats')}</p>
                  </div>
                  {image && (
                    <div className="mt-4">
                      <p className="mb-2 text-sm font-medium">{t('preview')}:</p>
                      <div className="border rounded-lg overflow-hidden currency-note">
                        <img src={image} alt="Currency note preview" className="w-full object-contain max-h-[300px]" />
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={analyzeImage}
                    disabled={!image || isProcessing} 
                    className="w-full analyze-btn auth-button"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('analyzing')}...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        {t('analyzeImage')}
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="camera" className="space-y-4">
              <Card className="border-2 border-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Camera className="mr-2 h-5 w-5 text-primary" />
                    {t('capture500NoteImage')}
                  </CardTitle>
                  <CardDescription>
                    {t('positionNote')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {invalidImageAlert.show && (
                    <Alert variant="warning" className="mb-4">
                      {invalidImageAlert.isPartial ? (
                        <AlertTriangle className="h-4 w-4" />
                      ) : (
                        <Ban className="h-4 w-4" />
                      )}
                      <AlertTitle>
                        {invalidImageAlert.isPartial 
                          ? t('partialCurrencyNote') 
                          : t('invalidImage')
                        }
                      </AlertTitle>
                      <AlertDescription className="space-y-2">
                        <p>
                          {invalidImageAlert.isPartial 
                            ? t('partialCurrencyDescription')
                            : t('notCurrencyNote')
                          }
                        </p>
                        
                        {invalidImageAlert.detectedFeatures && invalidImageAlert.detectedFeatures.length > 0 && (
                          <div className="text-sm mt-2">
                            <p><strong>{t('detectedFeatures')}:</strong> {invalidImageAlert.detectedFeatures.join(', ')}</p>
                          </div>
                        )}
                        
                        <div className="mt-3">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mr-2"
                            onClick={() => {
                              resetCamera();
                            }}
                          >
                            {t('retakePhoto')}
                          </Button>
                          
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => {
                              setProceedAnyway(true);
                              setInvalidImageAlert({ show: false });
                            }}
                          >
                            <FileCog className="mr-1 h-4 w-4" />
                            {t('proceedAnyway')}
                          </Button>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {proceedAnyway && (
                    <Alert variant="warning" className="mb-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>{t('proceedingAnyway')}</AlertTitle>
                      <AlertDescription>
                        {t('proceedingAnywayDescription')}
                      </AlertDescription>
                    </Alert>
                  )}
                  
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
                    <div className="border rounded-lg overflow-hidden currency-note">
                      <img src={capturedImage} alt="Captured image" className="w-full object-contain max-h-[300px]" />
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                  {!capturedImage ? (
                    <Button 
                      onClick={captureImage} 
                      className="w-full auth-button"
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      {t('captureImage')}
                    </Button>
                  ) : (
                    <div className="flex flex-col w-full gap-2">
                      <Button 
                        onClick={resetCamera} 
                        variant="outline" 
                        className="w-full btn-3d"
                      >
                        {t('retakePhoto')}
                      </Button>
                      <Button 
                        onClick={analyzeImage}
                        disabled={isProcessing} 
                        className="w-full analyze-btn auth-button"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t('analyzing')}...
                          </>
                        ) : (
                          <>
                            <Search className="mr-2 h-4 w-4" />
                            {t('analyzeImage')}
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {result && (
          <div 
            id="resultsSection" 
            ref={resultsRef}
            className="fade-in-section mt-12 mb-8 result-container"
          >
            <Card className="border-2 border-primary/20 shadow-lg animate-result">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-primary" />
                  Authentication Results
                </CardTitle>
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
                ) : result.confidence >= 0.65 ? (
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
                      <li key={index} className="flex items-center justify-between p-3 rounded-md bg-muted/50 feature-card">
                        <span className="font-medium flex items-center">
                          <span className="number-marker">{index + 1}</span>
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span>
                          {typeof value === 'boolean' ? (
                            value ? (
                              <span className="text-green-600 dark:text-green-400 font-medium flex items-center">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Present
                              </span>
                            ) : (
                              <span className="text-red-600 dark:text-red-400 font-medium flex items-center">
                                <AlertTriangle className="h-4 w-4 mr-1" />
                                Not Detected
                              </span>
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

                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Analysis Confidence</h3>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="mb-2"><strong>Overall confidence:</strong> {Math.round(result.confidence * 100)}%</p>
                    
                    <div className="mb-2">
                      <strong>Strongest features:</strong>
                      <ul className="list-disc pl-5 mt-1">
                        {result.confidenceMetrics?.strongestFeatures?.map((feature: string, idx: number) => (
                          <li key={idx} className="text-sm">
                            {feature.replace(/([A-Z])/g, ' $1').trim()}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <strong>Weakest features:</strong>
                      <ul className="list-disc pl-5 mt-1">
                        {result.confidenceMetrics?.weakestFeatures?.map((feature: string, idx: number) => (
                          <li key={idx} className="text-sm">
                            {feature.replace(/([A-Z])/g, ' $1').trim()}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button 
                  onClick={downloadReport}
                  className="w-full btn-3d"
                  variant="outline"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>

                <Button 
                  className="w-full auth-button"
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
          </div>
        )}

        <div 
          id="educationalGuide" 
          ref={sectionRefs.current.educationalGuide}
          className={`fade-in-section ${visibleSections.has('educationalGuide') ? 'is-visible' : ''}`}
        >
          <Card className="border-2 border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle>
                <div className="flex items-center">
                  <Info className="mr-2 h-5 w-5 text-primary" />
                  Educational Guide: Identifying Security Features
                </div>
              </CardTitle>
              <CardDescription>
                Learn about the security features of the ₹500 note with our detailed visual guide
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  id="frontNote"
                  ref={sectionRefs.current.frontNote}
                  className={`fade-in-section currency-note-container ${visibleSections.has('frontNote') ? 'is-visible' : ''}`}
                >
                  <h3 className="font-medium mb-3 text-lg">Front Side</h3>
                  <div className="relative currency-note bg-white rounded-lg p-2 overflow-hidden">
                    <img 
                      src="/lovable-uploads/f98af26a-0b5f-4544-aa40-68539a2b6540.png" 
                      alt="₹500 Note Front" 
                      className="w-full h-auto"
                    />
                    
                    <div className="security-point absolute top-[13%] left-[14%]">
                      <div className="absolute -top-7 -left-2 flex items-center justify-center bg-primary text-white text-xs font-bold rounded-full w-5 h-5">
                        13
                      </div>
                    </div>
                    
                    <div className="security-point absolute top-[13%] left-[25%]">
                      <div className="absolute -top-7 -left-2 flex items-center justify-center bg-primary text-white text-xs font-bold rounded-full w-5 h-5">
                        14
                      </div>
                    </div>
                    
                    <div className="security-point absolute top-[13%] left-[38%]">
                      <div className="absolute -top-7 -left-2 flex items-center justify-center bg-primary text-white text-xs font-bold rounded-full w-5 h-5">
                        15
                      </div>
                    </div>
                    
                    <div className="security-point absolute top-[13%] left-[55%]">
                      <div className="absolute -top-7 -left-2 flex items-center justify-center bg-primary text-white text-xs font-bold rounded-full w-5 h-5">
                        16
                      </div>
                    </div>
                    
                    <div className="security-point absolute top-[13%] left-[76%]">
                      <div className="absolute -top-7 -left-2 flex items-center justify-center bg-primary text-white text-xs font-bold rounded-full w-5 h-5">
                        17
                      </div>
                    </div>
                  </div>
                </div>
                
                <div 
                  id="backNote"
                  ref={sectionRefs.current.backNote}
                  className={`fade-in-section currency-note-container ${visibleSections.has('backNote') ? 'is-visible' : ''}`}
                >
                  <h3 className="font-medium mb-3 text-lg">Back Side</h3>
                  <div className="relative currency-note bg-white rounded-lg p-2 overflow-hidden">
                    <img 
                      src="/lovable-uploads/cf002fd5-66f3-4df5-8a13-852506dd9bed.png" 
                      alt="₹500 Note Back" 
                      className="w-full h-auto"
                    />
                    
                    <div className="security-point absolute top-[75%] left-[10%]">
                      <div className="absolute -top-7 -left-2 flex items-center justify-center bg-primary text-white text-xs font-bold rounded-full w-5 h-5">
                        1
                      </div>
                    </div>
                    
                    <div className="security-point absolute top-[75%] left-[18%]">
                      <div className="absolute -top-7 -left-2 flex items-center justify-center bg-primary text-white text-xs font-bold rounded-full w-5 h-5">
                        2
                      </div>
                    </div>
                    
                    <div className="security-point absolute top-[75%] left-[26%]">
                      <div className="absolute -top-7 -left-2 flex items-center justify-center bg-primary text-white text-xs font-bold rounded-full w-5 h-5">
                        3
                      </div>
                    </div>
                    
                    <div className="security-point absolute top-[60%] left-[38%]">
                      <div className="absolute -top-7 -left-2 flex items-center justify-center bg-primary text-white text-xs font-bold rounded-full w-5 h-5">
                        4
                      </div>
                    </div>
                    
                    <div className="security-point absolute top-[60%] left-[48%]">
                      <div className="absolute -top-7 -left-2 flex items-center justify-center bg-primary text-white text-xs font-bold rounded-full w-5 h-5">
                        5
                      </div>
                    </div>
                    
                    <div className="security-point absolute top-[60%] left-[58%]">
                      <div className="absolute -top-7 -left-2 flex items-center justify-center bg-primary text-white text-xs font-bold rounded-full w-5 h-5">
                        6
                      </div>
                    </div>
                    
                    <div className="security-point absolute top-[60%] left-[68%]">
                      <div className="absolute -top-7 -left-2 flex items-center justify-center bg-primary text-white text-xs font-bold rounded-full w-5 h-5">
                        7
                      </div>
                    </div>
                    
                    <div className="security-point absolute top-[60%] left-[78%]">
                      <div className="absolute -top-7 -left-2 flex items-center justify-center bg-primary text-white text-xs font-bold rounded-full w-5 h-5">
                        8
                      </div>
                    </div>
                    
                    <div className="security-point absolute top-[75%] left-[88%]">
                      <div className="absolute -top-7 -left-2 flex items-center justify-center bg-primary text-white text-xs font-bold rounded-full w-5 h-5">
                        9
                      </div>
                    </div>
                    
                    <div className="security-point absolute top-[85%] left-[88%]">
                      <div className="absolute -top-7 -left-2 flex items-center justify-center bg-primary text-white text-xs font-bold rounded-full w-5 h-5">
                        10
                      </div>
                    </div>
                    
                    <div className="security-point absolute top-[95%] left-[88%]">
                      <div className="absolute -top-7 -left-2 flex items-center justify-center bg-primary text-white text-xs font-bold rounded-full w-5 h-5">
                        11
                      </div>
                    </div>
                    
                    <div className="security-point absolute top-[95%] left-[95%]">
                      <div className="absolute -top-7 -left-2 flex items-center justify-center bg-primary text-white text-xs font-bold rounded-full w-5 h-5">
                        12
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div 
                id="featuresSection"
                ref={sectionRefs.current.featuresSection}
                className={`fade-in-section ${visibleSections.has('featuresSection') ? 'is-visible' : ''}`}
              >
                <h3 className="text-xl font-medium mb-4">Security Feature Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="feature-card p-4 rounded-lg bg-muted/30 border">
                    <h4 className="font-bold mb-2 flex items-center">
                      <span className="number-marker">1</span>
                      See-through Register
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      The small floral design in the center, visible when the note is held up to light. The designs on both sides form a perfect pattern.
                    </p>
                  </div>
                  
                  <div className="feature-card p-4 rounded-lg bg-muted/30 border">
                    <h4 className="font-bold mb-2 flex items-center">
                      <span className="number-marker">2</span>
                      Portrait Watermark
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Mahatma Gandhi portrait watermark with multi-tonal shades. Hold the note against light to see this feature clearly.
                    </p>
                  </div>
                  
                  <div className="feature-card p-4 rounded-lg bg-muted/30 border">
                    <h4 className="font-bold mb-2 flex items-center">
                      <span className="number-marker">3</span>
                      Micro Lettering
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      'RBI' and '500' visible under a magnifying glass. These micro-letters appear between the vertical band and Mahatma Gandhi portrait.
                    </p>
                  </div>
                  
                  <div className="feature-card p-4 rounded-lg bg-muted/30 border">
                    <h4 className="font-bold mb-2 flex items-center">
                      <span className="number-marker">4</span>
                      Security Thread
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      A windowed security thread with inscriptions 'भारत' and 'RBI' that changes from green to blue when tilted.
                    </p>
                  </div>
                  
                  <div className="feature-card p-4 rounded-lg bg-muted/30 border">
                    <h4 className="font-bold mb-2 flex items-center">
                      <span className="number-marker">5</span>
                      RBI Seal
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      The RBI seal on the left side, printed in intaglio (raised printing) that can be felt by touch.
                    </p>
                  </div>
                  
                  <div className="feature-card p-4 rounded-lg bg-muted/30 border">
                    <h4 className="font-bold mb-2 flex items-center">
                      <span className="number-marker">6</span>
                      Guarantee Clause
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Text stating "I promise to pay the bearer the sum of five hundred rupees" with the Governor's signature.
                    </p>
                  </div>
                  
                  <div className="feature-card p-4 rounded-lg bg-muted/30 border">
                    <h4 className="font-bold mb-2 flex items-center">
                      <span className="number-marker">7</span>
                      Optically Variable Ink
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      The numeral ₹500 on the bottom right changes from green to blue when the note is tilted.
                    </p>
                  </div>
                  
                  <div className="feature-card p-4 rounded-lg bg-muted/30 border">
                    <h4 className="font-bold mb-2 flex items-center">
                      <span className="number-marker">8</span>
                      Latent Image
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Numeral '500' hidden within the vertical band, visible when the note is held at a 45° angle at eye level.
                    </p>
                  </div>
                  
                  <div className="feature-card p-4 rounded-lg bg-muted/30 border">
                    <h4 className="font-bold mb-2 flex items-center">
                      <span className="number-marker">9</span>
                      Ascending Size Numbers
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      The size of numerals in the number panel increases from left to right.
                    </p>
                  </div>
                  
                  <div className="feature-card p-4 rounded-lg bg-muted/30 border">
                    <h4 className="font-bold mb-2 flex items-center">
                      <span className="number-marker">10</span>
                      Devanagari '५००'
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      The denomination in Devanagari script on the note.
                    </p>
                  </div>
                  
                  <div className="feature-card p-4 rounded-lg bg-muted/30 border">
                    <h4 className="font-bold mb-2 flex items-center">
                      <span className="number-marker">11</span>
                      Identification Mark
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      A circle with ₹500 in raised print on the right side, designed to help visually impaired people identify the denomination.
                    </p>
                  </div>
                  
                  <div className="feature-card p-4 rounded-lg bg-muted/30 border">
                    <h4 className="font-bold mb-2 flex items-center">
                      <span className="number-marker">12</span>
                      Year of Printing
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      The year of printing on the reverse of the note.
                    </p>
                  </div>
                  
                  <div className="feature-card p-4 rounded-lg bg-muted/30 border">
                    <h4 className="font-bold mb-2 flex items-center">
                      <span className="number-marker">13</span>
                      Language Panel
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      The denomination of the note written in 15 languages on the reverse.
                    </p>
                  </div>
                  
                  <div className="feature-card p-4 rounded-lg bg-muted/30 border">
                    <h4 className="font-bold mb-2 flex items-center">
                      <span className="number-marker">14</span>
                      Governor's Signature
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Signature of the RBI Governor printed with intaglio effect.
                    </p>
                  </div>
                  
                  <div className="feature-card p-4 rounded-lg bg-muted/30 border">
                    <h4 className="font-bold mb-2 flex items-center">
                      <span className="number-marker">15</span>
                      Watermark Window
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      The blank space for the watermark of Mahatma Gandhi portrait and electrotype mark.
                    </p>
                  </div>
                  
                  <div className="feature-card p-4 rounded-lg bg-muted/30 border">
                    <h4 className="font-bold mb-2 flex items-center">
                      <span className="number-marker">16</span>
                      Red Fort Image
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Depicts the Red Fort with the Indian flag, symbolizing national heritage.
                    </p>
                  </div>
                  
                  <div className="feature-card p-4 rounded-lg bg-muted/30 border">
                    <h4 className="font-bold mb-2 flex items-center">
                      <span className="number-marker">17</span>
                      Ashoka Pillar Emblem
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      The national emblem of India printed on the right side.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted p-6 rounded-lg mt-4">
                <h3 className="font-medium mb-3 flex items-center">
                  <Eye className="mr-2 h-5 w-5 text-primary" />
                  How to Verify a ₹500 Note
                </h3>
                <ol className="space-y-3 list-decimal pl-5">
                  <li className="text-sm"><strong>Visual Inspection:</strong> Examine the overall print quality. Authentic notes have sharp, clear printing without smudges or blurred edges.</li>
                  <li className="text-sm"><strong>Feel the Note:</strong> Authentic notes have a distinct texture due to intaglio printing. Counterfeit notes often feel smoother or different.</li>
                  <li className="text-sm"><strong>Check in Light:</strong> Hold the note against light to check for the watermark, security thread, and see-through register.</li>
                  <li className="text-sm"><strong>Tilt the Note:</strong> Observe color changes in the security features, particularly the color-shifting ink on the ₹500 numeral.</li>
                  <li className="text-sm"><strong>Magnify:</strong> Use a magnifying glass to check for microlettering and fine details that are difficult to replicate in counterfeits.</li>
                  <li className="text-sm"><strong>UV Light Test:</strong> Under UV light, specific portions of genuine notes will glow while counterfeits typically show different patterns.</li>
                </ol>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-center">
              <Button 
                className="auth-button"
                onClick={() => document.getElementById('uploadSection')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Start Authentication Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CurrencyAuthenticator;
