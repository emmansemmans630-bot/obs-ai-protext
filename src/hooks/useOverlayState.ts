import { useState, useEffect, useCallback } from 'react';

export type OverlayLayout = 'lower-third' | 'full-screen';
export type TransitionType = 'fade' | 'slide' | 'zoom' | 'none';

export interface OverlayState {
  isVisible: boolean;
  content: {
    type: 'scripture' | 'song' | 'caption';
    title?: string;
    text: string;
    reference?: string;
  } | null;
  settings: {
    layout: OverlayLayout;
    primaryColor: string;
    secondaryColor: string;
    textColor: string;
    fontSize: number;
    fontFamily: string;
    transition: TransitionType;
    backgroundImage?: string;
    opacity: number;
  };
}

const DEFAULT_STATE: OverlayState = {
  isVisible: false,
  content: null,
  settings: {
    layout: 'lower-third',
    primaryColor: '#003366', // Blue
    secondaryColor: '#006633', // Green
    textColor: '#ffffff',
    fontSize: 24,
    fontFamily: 'Inter',
    transition: 'fade',
    opacity: 0.9,
  },
};

const CHANNEL_NAME = 'obs-overlay-sync';

export function useOverlayState(isDashboard: boolean = false) {
  const [state, setState] = useState<OverlayState>(() => {
    const saved = localStorage.getItem('obs-overlay-state');
    return saved ? JSON.parse(saved) : DEFAULT_STATE;
  });

  const broadcast = useCallback((newState: OverlayState) => {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.postMessage(newState);
    channel.close();
  }, []);

  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    
    const handleMessage = (event: MessageEvent<OverlayState>) => {
      setState(event.data);
    };

    channel.addEventListener('message', handleMessage);
    
    return () => {
      channel.removeEventListener('message', handleMessage);
      channel.close();
    };
  }, []);

  const updateState = useCallback((updater: (prev: OverlayState) => OverlayState) => {
    setState((prev) => {
      const newState = updater(prev);
      localStorage.setItem('obs-overlay-state', JSON.stringify(newState));
      broadcast(newState);
      return newState;
    });
  }, [broadcast]);

  return { state, updateState };
}
