
const AboutPage = () => {
  return (
    <div className="container-custom py-10">
      <h1 className="text-3xl font-bold mb-6">Sobre a Vitrine de Serviços</h1>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8 mb-8">
        <h2 className="text-xl font-semibold mb-4">Nossa Missão</h2>
        <p className="text-gray-700 mb-6">
          A Vitrine de Serviços foi criada para conectar moradores de condomínios que oferecem serviços profissionais 
          com aqueles que precisam desses serviços. Nossa missão é fortalecer a economia colaborativa dentro do ambiente 
          condominial, valorizar os talentos e habilidades dos próprios moradores e facilitar o acesso a serviços de confiança.
        </p>
        
        <h2 className="text-xl font-semibold mb-4">Como Funciona</h2>
        <div className="space-y-4 mb-6">
          <div className="flex">
            <div className="bg-brand-light-blue text-brand-blue rounded-full w-8 h-8 flex items-center justify-center font-semibold mr-3 flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="font-medium text-lg">Cadastro de Serviços</h3>
              <p className="text-gray-600">
                Moradores cadastram seus serviços profissionais através da plataforma, informando detalhes sobre o serviço 
                oferecido e dados para contato.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="bg-brand-light-blue text-brand-blue rounded-full w-8 h-8 flex items-center justify-center font-semibold mr-3 flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="font-medium text-lg">Aprovação Administrativa</h3>
              <p className="text-gray-600">
                A administração do condomínio avalia os serviços cadastrados para garantir a qualidade e adequação das 
                ofertas na plataforma.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="bg-brand-light-blue text-brand-blue rounded-full w-8 h-8 flex items-center justify-center font-semibold mr-3 flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="font-medium text-lg">Divulgação na Plataforma</h3>
              <p className="text-gray-600">
                Após aprovados, os serviços ficam disponíveis na plataforma para todos os moradores visualizarem, 
                organizados por categorias.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="bg-brand-light-blue text-brand-blue rounded-full w-8 h-8 flex items-center justify-center font-semibold mr-3 flex-shrink-0">
              4
            </div>
            <div>
              <h3 className="font-medium text-lg">Contato Direto</h3>
              <p className="text-gray-600">
                Os interessados podem entrar em contato diretamente com os prestadores de serviço via WhatsApp para 
                negociar valores e detalhes.
              </p>
            </div>
          </div>
        </div>
        
        <h2 className="text-xl font-semibold mb-4">Benefícios</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            <span className="font-medium">Confiança</span>: Serviços oferecidos por moradores do próprio condomínio
          </li>
          <li>
            <span className="font-medium">Conveniência</span>: Encontre serviços sem sair do seu condomínio
          </li>
          <li>
            <span className="font-medium">Comunidade</span>: Fortalecimento das relações entre vizinhos
          </li>
          <li>
            <span className="font-medium">Economia</span>: Oportunidades de renda para moradores prestadores de serviços
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AboutPage;
