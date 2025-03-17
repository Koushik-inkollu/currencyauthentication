
import React from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Copy, Check } from 'lucide-react';

interface KeyphraseListProps {
  keyphrases: string[];
}

export const KeyphraseList: React.FC<KeyphraseListProps> = ({ keyphrases }) => {
  const { toast } = useToast();
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);
  
  const handleCopy = (phrase: string, index: number) => {
    navigator.clipboard.writeText(phrase)
      .then(() => {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
        
        toast({
          title: "Copied!",
          description: `"${phrase}" copied to clipboard.`,
          duration: 2000,
        });
      })
      .catch(() => {
        toast({
          title: "Copy failed",
          description: "Failed to copy to clipboard.",
          variant: "destructive",
        });
      });
  };
  
  return (
    <div className="keyphrase-grid">
      {keyphrases.map((phrase, index) => (
        <div 
          key={index}
          className="keyphrase-tag group"
          onClick={() => handleCopy(phrase, index)}
        >
          <span className="mr-1 truncate">{phrase}</span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">
            {copiedIndex === index ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </span>
        </div>
      ))}
    </div>
  );
};
