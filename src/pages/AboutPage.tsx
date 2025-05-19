
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-light-blue to-blue-50 py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Sobre o Evidence Resort
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Uma comunidade exclusiva conectando moradores e prestadores de serviços 
              para facilitar o dia a dia dos residentes.
            </p>
          </div>
        </div>
      </section>

      {/* About Condominium */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Nossa Comunidade</h2>
              <p className="text-gray-700 mb-4">
                O Evidence Resort é um condomínio exclusivo que conta com 5 blocos, numerados de 1 a 5, 
                compostos por casas residenciais de alto padrão.
              </p>
              <p className="text-gray-700 mb-6">
                Nossa plataforma foi desenvolvida exclusivamente para os moradores do Evidence Resort, 
                com o objetivo de facilitar a conexão entre residentes e prestadores de serviços 
                que moram em nossa comunidade.
              </p>
              <Link 
                to="/services" 
                className="inline-flex items-center text-brand-blue hover:text-blue-700"
              >
                Explorar serviços disponíveis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&q=80&w=700" 
                alt="Imagem ilustrativa do condomínio Evidence Resort" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-12 text-center">Como funciona nossa plataforma</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-brand-light-blue rounded-full flex items-center justify-center text-brand-blue mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Encontre serviços</h3>
              <p className="text-gray-700">
                Navegue por categorias ou busque serviços oferecidos por moradores do condomínio.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-brand-light-blue rounded-full flex items-center justify-center text-brand-blue mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Entre em contato</h3>
              <p className="text-gray-700">
                Contate diretamente pelo WhatsApp os prestadores de serviço que moram no condomínio.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-brand-light-blue rounded-full flex items-center justify-center text-brand-blue mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Ofereça seus serviços</h3>
              <p className="text-gray-700">
                Se você é morador e quer oferecer seu serviço, cadastre-se facilmente na plataforma.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Condominium Details */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-8 text-center">Estrutura do Evidence Resort</h2>
          <div className="grid md:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((block) => (
              <div key={block} className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-gray-100 text-center">
                <h3 className="text-xl font-semibold mb-2">Bloco {block}</h3>
                <p className="text-gray-700">Casas residenciais de alto padrão</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom max-w-4xl">
          <div className="bg-gradient-to-r from-brand-blue to-blue-500 rounded-2xl shadow-lg p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4 text-white">Faça parte da nossa comunidade</h2>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Se você é morador do Evidence Resort e deseja oferecer seus serviços ou encontrar 
              profissionais confiáveis dentro do condomínio, nossa plataforma é o lugar ideal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/services" className="inline-block px-8 py-3 bg-white text-brand-blue font-medium rounded-lg hover:bg-gray-100 transition-colors">
                Explorar Serviços
              </Link>
              <Link to="/services/new" className="inline-block px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                Cadastrar Serviço
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
