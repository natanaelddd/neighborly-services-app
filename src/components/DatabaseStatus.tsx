
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const DatabaseStatus = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [details, setDetails] = useState<string>('');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Test basic connection
        const { data, error } = await supabase
          .from('categories')
          .select('count')
          .limit(1);

        if (error) {
          setStatus('error');
          setDetails(`Erro de conexão: ${error.message}`);
          console.error('Database connection error:', error);
        } else {
          setStatus('connected');
          setDetails('Conectado ao banco de dados');
          console.log('Database connection successful');
        }
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
    <div className="fixed bottom-4 right-4 bg-green-100 border border-green-300 rounded-lg p-3 text-sm">
      ✅ {details}
    </div>
  );
};

export default DatabaseStatus;
