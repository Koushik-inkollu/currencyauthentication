
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { KeyphraseList } from "@/components/KeyphraseList";
import { generateKeyphrases } from "@/utils/keyphraseGenerator";

interface GeneratorOptions {
  quantity: number;
  useModifiers: boolean;
  useSynonyms: boolean;
  useQuestionsFormat: boolean;
}

const KeyphraseGenerator: React.FC = () => {
  const { toast } = useToast();
  const [seed, setSeed] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [keyphrases, setKeyphrases] = useState<string[]>([]);
  const [options, setOptions] = useState<GeneratorOptions>({
    quantity: 10,
    useModifiers: true,
    useSynonyms: true,
    useQuestionsFormat: false
  });

  const handleGenerate = () => {
    if (!seed.trim()) {
      toast({
        title: "Input required",
        description: "Please enter a topic or keywords to generate keyphrases.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const generatedPhrases = generateKeyphrases(seed, options);
      setKeyphrases(generatedPhrases);
      setIsGenerating(false);
      
      toast({
        title: "Keyphrases generated",
        description: `Successfully generated ${generatedPhrases.length} keyphrases.`,
      });
    }, 1500);
  };

  const handleCopyAll = () => {
    if (keyphrases.length === 0) return;
    
    navigator.clipboard.writeText(keyphrases.join('\n'))
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: `${keyphrases.length} keyphrases copied to clipboard.`,
        });
      })
      .catch(() => {
        toast({
          title: "Copy failed",
          description: "Failed to copy keyphrases to clipboard.",
          variant: "destructive",
        });
      });
  };

  const handleOptionChange = (
    option: keyof GeneratorOptions, 
    value: number | boolean
  ) => {
    setOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  const handleClearAll = () => {
    setKeyphrases([]);
    setSeed('');
  };

  return (
    <div className="container py-6 space-y-6">
      <Card className="border-t-4 border-t-brand-500">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Keyphrase Generator</CardTitle>
          <CardDescription>
            Generate optimized keyphrases for SEO, advertising, or content marketing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
            </TabsList>
            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="seed">Enter a topic or keyword</Label>
                <Textarea
                  id="seed"
                  placeholder="Enter a topic, product, or base keywords (e.g. 'digital marketing' or 'fitness equipment')"
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                  className="resize-none min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Number of keyphrases ({options.quantity})</Label>
                <Slider
                  id="quantity"
                  min={5}
                  max={50}
                  step={5}
                  value={[options.quantity]}
                  onValueChange={(values) => handleOptionChange('quantity', values[0])}
                />
              </div>
              <div className="flex justify-between">
                <Button 
                  onClick={handleGenerate} 
                  className="bg-brand-500 hover:bg-brand-600"
                  disabled={isGenerating || !seed.trim()}
                >
                  {isGenerating ? 'Generating...' : 'Generate Keyphrases'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleClearAll}
                  disabled={isGenerating || (!seed.trim() && keyphrases.length === 0)}
                >
                  Clear All
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="advanced" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Use Modifiers</Label>
                    <p className="text-sm text-muted-foreground">
                      Add common prefixes and suffixes
                    </p>
                  </div>
                  <Switch
                    checked={options.useModifiers}
                    onCheckedChange={(checked) => handleOptionChange('useModifiers', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Use Synonyms</Label>
                    <p className="text-sm text-muted-foreground">
                      Include variations using synonyms
                    </p>
                  </div>
                  <Switch
                    checked={options.useSynonyms}
                    onCheckedChange={(checked) => handleOptionChange('useSynonyms', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Question Format</Label>
                    <p className="text-sm text-muted-foreground">
                      Include phrases in question form
                    </p>
                  </div>
                  <Switch
                    checked={options.useQuestionsFormat}
                    onCheckedChange={(checked) => handleOptionChange('useQuestionsFormat', checked)}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {keyphrases.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl font-semibold">Generated Keyphrases</CardTitle>
              <CardDescription>
                {keyphrases.length} keyphrases based on "{seed}"
              </CardDescription>
            </div>
            <Button 
              onClick={handleCopyAll} 
              variant="outline"
              className="h-8"
            >
              Copy All
            </Button>
          </CardHeader>
          <CardContent>
            <KeyphraseList keyphrases={keyphrases} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KeyphraseGenerator;
