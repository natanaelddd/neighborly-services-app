
interface ServicesPageHeaderProps {
  isDemoMode: boolean;
}

const ServicesPageHeader = ({ isDemoMode }: ServicesPageHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Serviços Disponíveis</h1>
      {isDemoMode && (
        <div className="text-sm text-muted-foreground">Modo Demo Ativo</div>
      )}
    </div>
  );
};

export default ServicesPageHeader;
