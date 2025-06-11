
import ServiceForm from "@/components/ServiceForm";
import { useAuth } from "@/hooks/useAuth";

const NewServicePage = () => {
  const { profile } = useAuth();
  
  return (
    <div className="container-custom py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Cadastrar Novo Serviço</h1>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8">
          <p className="mb-6 text-gray-600">
            {profile?.name ? `Olá, ${profile.name}! ` : ''}
            Preencha o formulário abaixo para cadastrar seu serviço. Após o envio, ele passará por uma análise
            e em breve estará disponível para todos os moradores do condomínio.
          </p>
          <ServiceForm />
        </div>
      </div>
    </div>
  );
};

export default NewServicePage;
