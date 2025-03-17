
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
import { 
  FileText, 
  Save, 
  CopyCheck, 
  Sparkles, 
  Trash2, 
  Clock 
} from "lucide-react";

interface GeneratorOptions {
  quantity: number;
  useModifiers: boolean;
  useSynonyms: boolean;
  useQuestionsFormat: boolean;
}

interface SavedKeyphraseSet {
  id: string;
  name: string;
  seed: string;
  keyphrases: string[];
  timestamp: number;
}

const KeyphraseGenerator: React.FC = () => {
  const { toast } = useToast();
  const [seed, setSeed] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [keyphrases, setKeyphrases] = useState<string[]>([]);
  const [savedSets, setSavedSets] = useState<SavedKeyphraseSet[]>(() => {
    const saved = localStorage.getItem('savedKeyPhraseSets');
    return saved ? JSON.parse(saved) : [];
  });
  const [setName, setSetName] = useState<string>('');
  const [options, setOptions] = useState<GeneratorOptions>({
    quantity: 10,
    useModifiers: true,
    useSynonyms: true,
    useQuestionsFormat: false
  });

  // Save to localStorage whenever savedSets changes
  useEffect(() => {
    localStorage.setItem('savedKeyPhraseSets', JSON.stringify(savedSets));
  }, [savedSets]);

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
    }, 1000);
  };

  const handleSaveSet = () => {
    if (!keyphrases.length) {
      toast({
        title: "No keyphrases to save",
        description: "Generate keyphrases before saving a set.",
        variant: "destructive",
      });
      return;
    }

    const name = setName.trim() || `Set for "${seed.substring(0, 20)}${seed.length > 20 ? '...' : ''}"`;
    
    const newSet: SavedKeyphraseSet = {
      id: Date.now().toString(),
      name,
      seed,
      keyphrases,
      timestamp: Date.now()
    };
    
    setSavedSets(prev => [newSet, ...prev]);
    setSetName('');
    
    toast({
      title: "Set saved",
      description: `Saved "${name}" for future reference.`,
    });
  };

  const handleLoadSet = (set: SavedKeyphraseSet) => {
    setSeed(set.seed);
    setKeyphrases(set.keyphrases);
    
    toast({
      title: "Set loaded",
      description: `Loaded "${set.name}" successfully.`,
    });
  };

  const handleDeleteSet = (id: string) => {
    setSavedSets(prev => prev.filter(set => set.id !== id));
    
    toast({
      title: "Set deleted",
      description: "The keyphrase set was removed.",
    });
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

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="container py-6 space-y-6">
      <Card className="border-t-4 border-t-primary">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Keyphrase Generator</CardTitle>
          <CardDescription>
            Generate optimized keyphrases for SEO, advertising, or content marketing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
              <TabsTrigger value="saved">Saved Sets ({savedSets.length})</TabsTrigger>
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
                  disabled={isGenerating || !seed.trim()}
                >
                  {isGenerating ? 'Generating...' : 'Generate Keyphrases'}
                  <Sparkles className="ml-1 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleClearAll}
                  disabled={isGenerating || (!seed.trim() && keyphrases.length === 0)}
                >
                  Clear All
                  <Trash2 className="ml-1 h-4 w-4" />
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
            <TabsContent value="saved" className="space-y-4 mt-4">
              {savedSets.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <FileText className="mx-auto h-12 w-12 mb-2 opacity-50" />
                  <p>No saved keyphrase sets yet</p>
                  <p className="text-sm mt-1">Generate and save keyphrases to access them later</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedSets.map((set) => (
                    <Card key={set.id} className="overflow-hidden">
                      <div className="p-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{set.name}</h3>
                          <p className="text-sm text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDate(set.timestamp)}
                            <span className="mx-1">•</span>
                            {set.keyphrases.length} keyphrases
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleLoadSet(set)}
                          >
                            Load
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteSet(set.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
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
            <div className="flex gap-2">
              <Button 
                onClick={handleCopyAll} 
                variant="outline"
                className="h-9"
              >
                Copy All
                <CopyCheck className="ml-1 h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Set name (optional)"
                  value={setName}
                  onChange={(e) => setSetName(e.target.value)}
                  className="h-9 max-w-[150px]"
                />
                <Button 
                  onClick={handleSaveSet} 
                  variant="secondary"
                  className="h-9"
                >
                  Save Set
                  <Save className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
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
