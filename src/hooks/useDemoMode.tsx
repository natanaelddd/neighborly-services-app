
import { useState, useEffect } from 'react';
import { mockServices, mockCategories, mockProperties } from '@/data/mockData';

export const useDemoMode = () => {
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // Verificar se está em modo demo apenas via query param
    const checkDemoMode = () => {
      const urlSearchParams = new URLSearchParams(window.location.search);
      const queryParamDemo = urlSearchParams.get('demo') === 'true';
      
      return queryParamDemo;
    };

    const demoMode = checkDemoMode();
    setIsDemoMode(demoMode);
  }, []);

  const enableDemoMode = () => {
    setIsDemoMode(true);
    console.log('Modo demo ativado');
  };

  const disableDemoMode = () => {
    setIsDemoMode(false);
    console.log('Modo demo desativado');
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
