import { useEffect, useRef } from 'react';
import type { Language } from '../types';

interface UseVoiceCommandsProps {
  enabled: boolean;
  onCommand: () => void;
  language: Language;
}

// FIX: Define a minimal interface for the SpeechRecognition instance to provide type safety
// and resolve the name collision between the variable and the desired type.
interface SpeechRecognitionInstance {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: (event: any) => void;
    onerror: (event: any) => void;
    onend: (() => void) | null;
    start: () => void;
    stop: () => void;
}

// FIX: Cast window to `any` to access non-standard SpeechRecognition properties without TypeScript errors. This resolves the error on line 11.
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export const useVoiceCommands = ({ enabled, onCommand, language }: UseVoiceCommandsProps) => {
  // FIX: Use the custom SpeechRecognitionInstance interface for the ref's type. This resolves the error on line 14.
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    if (!enabled || !SpeechRecognition) {
      if(recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      return;
    }
    
    if (recognitionRef.current) {
        // If language changes, restart with new language
        if (recognitionRef.current.lang !== language) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        } else {
            return; // Already running with correct settings
        }
    }

    const recognition: SpeechRecognitionInstance = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = language;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      console.log('Heard:', transcript);
      if (transcript.includes('help') || transcript.includes('मदद')) {
        console.log('Help command detected!');
        onCommand();
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      // Restart recognition on certain errors
      if (event.error === 'no-speech' || event.error === 'network') {
        setTimeout(() => recognitionRef.current?.start(), 1000);
      }
    };
    
    recognition.onend = () => {
        // If it was enabled and stopped unexpectedly, restart it.
        if(enabled && recognitionRef.current) {
            try {
                recognition.start();
            } catch(e) {
                console.error("Could not restart recognition", e)
            }
        }
    }

    try {
        recognition.start();
    } catch(e) {
        console.error("Could not start recognition initially", e)
    }

    return () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, language]);
};