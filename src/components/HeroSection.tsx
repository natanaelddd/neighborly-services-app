
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Plus, Home, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { usePublicMenuItems } from "@/hooks/usePublicMenuItems";

// Mapeamento para nomes default, caso queira customizar labels
const BOTAO_PADRAO = [
  { reference: "Encontrar Serviços", fallbackLabel: "Encontrar Serviços", fallbackPath: "/services" },
  { reference: "Oferecer Serviço", fallbackLabel: "Oferecer Serviço", fallbackPath: "/services/new" },
  { reference: "Cadastrar Casa", fallbackLabel: "Cadastrar Casa", fallbackPath: "/properties/new" }
];

const HeroSection = () => {
  const { menuItems } = usePublicMenuItems();

  // Recupera label e link editáveis vindos do Admin/Supabase
  const getBotao = (padrao: typeof BOTAO_PADRAO[0]) => {
    // Busca no menuItems pelo label padrão, ignorando case, OU pelo path padrão
    let item = menuItems.find(mi =>
      [padrao.reference, padrao.fallbackLabel].some(ref =>
        mi.label?.toLowerCase() === ref.toLowerCase()
      )
    );
    if (!item) item = menuItems.find(mi => mi.path === padrao.fallbackPath);
    return {
      label: item?.label ?? padrao.fallbackLabel,
      path: item?.path ?? padrao.fallbackPath
    };
  };

  const btns = BOTAO_PADRAO.map(getBotao);

  return (
    <section className="relative py-20">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img 
              src="/lovable-uploads/f5e0efa5-edc9-4e24-918f-8172b4020838.png"
              alt="Vista aérea do condomínio Evidence"
              className="w-full h-[400px] lg:h-[500px] object-cover rounded-lg shadow-lg"
            />
          </div>

          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Condo Indico
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8">
                A plataforma que conecta moradores aos melhores serviços e propriedades do seu condomínio
              </p>
            </div>

            {/* Botões dinâmicos */}
            <div className="space-y-4">
              <Link to={btns[0].path}>
                <Button size="lg" className="w-full flex items-center justify-between gap-2 h-16">
                  <div className="flex items-center gap-3">
                    <Search className="w-6 h-6" />
                    <div className="text-left">
                      <div className="font-semibold">{btns[0].label}</div>
                      <div className="text-sm opacity-90">Descubra profissionais qualificados</div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to={btns[1].path}>
                <Button variant="outline" size="lg" className="w-full flex items-center justify-between gap-2 h-16">
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6" />
                    <div className="text-left">
                      <div className="font-semibold">{btns[1].label}</div>
                      <div className="text-sm opacity-75">Cadastre seus serviços</div>
                    </div>
                  </div>
                  <Plus className="w-5 h-5" />
                </Button>
              </Link>
              <Link to={btns[2].path}>
                <Button variant="outline" size="lg" className="w-full flex items-center justify-between gap-2 h-16">
                  <div className="flex items-center gap-3">
                    <Home className="w-6 h-6" />
                    <div className="text-left">
                      <div className="font-semibold">{btns[2].label}</div>
                      <div className="text-sm opacity-75">Anuncie sua propriedade</div>
                    </div>
                  </div>
                  <Plus className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
