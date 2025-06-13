
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface PropertyFormErrorHandlerProps {
  error: any;
  onRetry?: () => void;
}

const PropertyFormErrorHandler = ({ error, onRetry }: PropertyFormErrorHandlerProps) => {
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (error) {
      console.error('Erro no cadastro de propriedade:', error);
      
      // Tratar diferentes tipos de erro
      if (error.code === 'PGRST301') {
        setErrorMessage("Erro de permissão. Verifique se você está logado corretamente.");
      } else if (error.code === 'PGRST116') {
        setErrorMessage("Dados não encontrados. Verifique suas informações de perfil.");
      } else if (error.message?.includes('unit_id')) {
        setErrorMessage("Erro na identificação do usuário. Tente fazer login novamente.");
      } else if (error.message?.includes('whatsapp')) {
        setErrorMessage("Formato do WhatsApp inválido. Use apenas números.");
      } else if (error.message?.includes('price')) {
        setErrorMessage("Formato do preço inválido. Use apenas números e vírgula para decimais.");
      } else if (error.message?.includes('validation')) {
        setErrorMessage("Dados inválidos. Verifique todos os campos obrigatórios.");
      } else {
        setErrorMessage(`Erro no cadastro: ${error.message || 'Erro desconhecido'}`);
      }
    }
  }, [error]);

  if (!error) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        {errorMessage}
        {onRetry && (
          <button 
            onClick={onRetry}
            className="ml-2 underline hover:no-underline"
          >
            Tentar novamente
          </button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default PropertyFormErrorHandler;
