import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Mic, MicOff, BrainCircuit, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface AIAssistantProps {
  onTranscript: (text: string) => void;
  onCommand: (command: string, params: any) => void;
}

const LANGUAGES = [
  { code: 'en-US', name: 'English' },
  { code: 'fr-FR', name: 'French' },
  { code: 'de-DE', name: 'German' },
  { code: 'es-ES', name: 'Spanish' },
  { code: 'it-IT', name: 'Italian' },
  { code: 'pt-PT', name: 'Portuguese' },
  { code: 'ar-SA', name: 'Arabic' },
  { code: 'sw-KE', name: 'Swahili' },
  { code: 'yo-NG', name: 'Yoruba' },
  { code: 'zu-ZA', name: 'Zulu' },
  { code: 'am-ET', name: 'Amharic' },
  { code: 'ha-NG', name: 'Hausa' },
  { code: 'ig-NG', name: 'Igbo' },
  { code: 'af-ZA', name: 'Afrikaans' },
];

export function AIAssistant({ onTranscript, onCommand }: AIAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [lastTranscript, setLastTranscript] = useState('');
  const [selectedLang, setSelectedLang] = useState('en-US');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = selectedLang;

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const transcript = finalTranscript || interimTranscript;
        if (transcript.trim()) {
          setLastTranscript(transcript);
          onTranscript(transcript);

          const lowerTranscript = transcript.toLowerCase();
          if (lowerTranscript.includes('show scripture') || lowerTranscript.includes('display scripture')) {
            const match = lowerTranscript.match(/(?:show|display) scripture\s+(.+)/i);
            if (match && match[1]) {
              onCommand('SHOW_SCRIPTURE', { reference: match[1].trim() });
            }
          }
          
          if (lowerTranscript.includes('hide overlay') || lowerTranscript.includes('clear screen')) {
            onCommand('HIDE_OVERLAY', {});
          }
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        if (event.error !== 'no-speech') {
          setIsListening(false);
          toast.error(`AI Assistant Error: ${event.error}`);
        }
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            console.error('Failed to restart recognition', e);
          }
        }
      };
    }
    
    return () => {
      recognitionRef.current?.stop();
    };
  }, [onTranscript, onCommand, isListening, selectedLang]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        if (recognitionRef.current) {
          recognitionRef.current.start();
          setIsListening(true);
          toast.success('AI Assistant is now listening...');
        } else {
          toast.error('Web Speech API is not supported in this browser.');
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [isListening]);

  return (
    <div className="flex flex-col gap-4 p-4 bg-primary/5 rounded-xl border border-primary/20 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">AI Assistant</h3>
            <p className="text-xs text-muted-foreground">Voice control & live captions</p>
          </div>
        </div>
        <Button
          variant={isListening ? "destructive" : "default"}
          size="sm"
          onClick={toggleListening}
          className="gap-2"
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          {isListening ? 'Stop AI' : 'Start AI'}
        </Button>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold uppercase text-muted-foreground">Recognition Language</label>
        <select 
          className="bg-background border rounded px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-primary"
          value={selectedLang}
          onChange={(e) => {
            const newLang = e.target.value;
            setSelectedLang(newLang);
            if (isListening) {
              recognitionRef.current?.stop();
            }
          }}
        >
          {LANGUAGES.map(lang => (
            <option key={lang.code} value={lang.code}>{lang.name}</option>
          ))}
        </select>
      </div>

      <div className="min-h-[60px] p-3 bg-background/50 rounded-lg border border-dashed border-primary/30 flex items-center justify-center text-center">
        {isListening ? (
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm italic text-muted-foreground animate-pulse">
              {lastTranscript || 'Listening...'}
            </span>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
              <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
            </div>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">Click "Start AI" to begin voice control</span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="text-[10px] gap-1 px-2 py-0">
          <Sparkles className="w-3 h-3" /> "Show Scripture John 3:16"
        </Badge>
        <Badge variant="outline" className="text-[10px] gap-1 px-2 py-0">
          <Sparkles className="w-3 h-3" /> "Clear Screen"
        </Badge>
      </div>
    </div>
  );
}
