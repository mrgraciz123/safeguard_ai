
import { useEffect, useRef } from 'react';

interface UseSoundDetectorProps {
  enabled: boolean;
  onSoundDetected: () => void;
}

const SOUND_THRESHOLD = 50; // Average volume threshold
const SILENCE_THRESHOLD = 5; // To reset detection
const DETECTION_DURATION_MS = 1000; // Must be loud for this long

export const useSoundDetector = ({ enabled, onSoundDetected }: UseSoundDetectorProps) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>(0);
  const loudSinceRef = useRef<number | null>(null);
  const isDetectingRef = useRef(false);

  useEffect(() => {
    const setupAudio = async () => {
      if (!enabled || isDetectingRef.current) return;
      isDetectingRef.current = true;
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const detect = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          
          let sum = 0;
          for (const amplitude of dataArray) {
            sum += amplitude;
          }
          const average = sum / dataArray.length;

          if (average > SOUND_THRESHOLD) {
            if (loudSinceRef.current === null) {
              loudSinceRef.current = Date.now();
            } else if (Date.now() - loudSinceRef.current > DETECTION_DURATION_MS) {
              console.log('Loud sound detected!');
              onSoundDetected();
              loudSinceRef.current = null; // Reset after detection
            }
          } else if (average < SILENCE_THRESHOLD) {
            loudSinceRef.current = null; // Reset if it becomes quiet
          }

          animationFrameRef.current = requestAnimationFrame(detect);
        };
        detect();

      } catch (err) {
        console.error('Error accessing microphone for sound detection:', err);
      }
    };

    const cleanupAudio = () => {
        cancelAnimationFrame(animationFrameRef.current);
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        analyserRef.current = null;
        loudSinceRef.current = null;
        isDetectingRef.current = false;
    };

    if (enabled) {
      setupAudio();
    } else {
      cleanupAudio();
    }

    return () => {
      cleanupAudio();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);
};
