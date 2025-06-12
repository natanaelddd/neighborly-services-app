
import { useState, useEffect } from 'react';
import { mockServices, mockCategories, mockProperties } from '@/data/mockData';

export const useDemoMode = () => {
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // Verificar se está em modo demo (pode ser controlado por localStorage ou query param)
    const demoMode = localStorage.getItem('demoMode') === 'true' || 
                     window.location.search.includes('demo=true');
    setIsDemoMode(demoMode);
  }, []);

  const enableDemoMode = () => {
    localStorage.setItem('demoMode', 'true');
    setIsDemoMode(true);
  };

  const disableDemoMode = () => {
    localStorage.removeItem('demoMode');
    setIsDemoMode(false);
  };

  return {
    isDemoMode,
    enableDemoMode,
    disableDemoMode,
    mockServices,
    mockCategories,
    mockProperties
  };
};
