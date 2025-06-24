
import { useDemoMode } from '@/hooks/useDemoMode';

interface FeaturedServicesHeaderProps {
  error: string | null;
}

const FeaturedServicesHeader = ({ error }: FeaturedServicesHeaderProps) => {
  const { isDemoMode } = useDemoMode();

  return (
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-2xl font-semibold">Serviços em Destaque</h2>
      {isDemoMode && (
        <div className="text-sm text-muted-foreground">Modo Demo Ativo</div>
      )}
      {error && (
        <div className="text-sm text-red-500">⚠️ {error}</div>
      )}
    </div>
  );
};

export default FeaturedServicesHeader;
