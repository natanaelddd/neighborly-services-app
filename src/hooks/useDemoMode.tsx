
import { useState, useEffect } from 'react';
import { mockServices, mockCategories, mockProperties } from '@/data/mockData';

export const useDemoMode = () => {
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // Verificar se está em modo demo (localStorage ou query param)
    const checkDemoMode = () => {
      const localStorageDemo = localStorage.getItem('demoMode') === 'true';
      const urlSearchParams = new URLSearchParams(window.location.search);
      const queryParamDemo = urlSearchParams.get('demo') === 'true';
      
      return localStorageDemo || queryParamDemo;
    };

    const demoMode = checkDemoMode();
    setIsDemoMode(demoMode);

    // Se tiver query param demo=true, salvar no localStorage
    const urlSearchParams = new URLSearchParams(window.location.search);
    if (urlSearchParams.get('demo') === 'true') {
      localStorage.setItem('demoMode', 'true');
    }
  }, []);

  const enableDemoMode = () => {
    localStorage.setItem('demoMode', 'true');
    setIsDemoMode(true);
    console.log('Modo demo ativado');
  };

  const disableDemoMode = () => {
    localStorage.removeItem('demoMode');
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
