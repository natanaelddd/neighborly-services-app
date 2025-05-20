
import { Button } from "@/components/ui/button";

const ContactPage = () => {
  const handleWhatsAppClick = () => {
    window.open("https://wa.me/5516992701617", "_blank");
  };

  const handleWebsiteClick = () => {
    window.open("https://natanel.com.br", "_blank");
  };

  return (
    <div className="container-custom py-16">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6 text-gradient">Entre em Contato</h1>
        <p className="text-lg text-muted-foreground mb-10">
          Estamos disponíveis para ajudar com qualquer dúvida sobre o Evidence Resort ou sobre os serviços oferecidos na plataforma.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">WhatsApp</h2>
            <p className="text-muted-foreground mb-4">Entre em contato diretamente pelo WhatsApp</p>
            <Button 
              onClick={handleWhatsAppClick} 
              className="w-full bg-green-600 hover:bg-green-700"
            >
              (16) 99270-1617
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Website</h2>
            <p className="text-muted-foreground mb-4">Visite nosso site oficial para mais informações</p>
            <Button 
              onClick={handleWebsiteClick} 
              className="w-full"
            >
              natanel.com.br
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
