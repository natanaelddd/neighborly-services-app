
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const DatabaseStatus = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [details, setDetails] = useState<string>('');
  const [authStatus, setAuthStatus] = useState<string>('');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Verificar conexão básica
        const { data, error } = await supabase
          .from('categories')
          .select('count')
          .limit(1);

        if (error) {
          setStatus('error');
          setDetails(`Erro de conexão: ${error.message}`);
          console.error('Database connection error:', error);
          return;
        }

        // Verificar autenticação
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setAuthStatus(`Logado como: ${user.email}`);
          
          // Verificar se é admin
          const { data: isAdminResult } = await supabase.rpc('is_admin');
          if (isAdminResult) {
            setAuthStatus(prev => prev + ' (Admin)');
          }
        } else {
          setAuthStatus('Não logado');
        }

        setStatus('connected');
        setDetails('Conectado ao banco de dados');
        console.log('Database connection successful');

      } catch (error) {
        setStatus('error');
        setDetails(`Erro inesperado: ${error}`);
        console.error('Unexpected database error:', error);
      }
    };

    checkConnection();
  }, []);

  if (status === 'checking') {
    return (
      <div className="fixed bottom-4 right-4 bg-blue-100 border border-blue-300 rounded-lg p-3 text-sm">
        🔍 Verificando conexão com banco...
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="fixed bottom-4 right-4 bg-red-100 border border-red-300 rounded-lg p-3 text-sm max-w-xs">
        ❌ {details}
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-green-100 border border-green-300 rounded-lg p-3 text-sm max-w-xs">
      <div>✅ {details}</div>
      {authStatus && <div className="text-xs mt-1">👤 {authStatus}</div>}
    </div>
  );
};

export default DatabaseStatus;
