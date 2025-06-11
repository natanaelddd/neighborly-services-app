
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Mensagem enviada com sucesso!");
      setName("");
      setEmail("");
      setMessage("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="container-custom py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Entre em Contato</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Nome
                </label>
                <Input
                  id="name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome completo"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  Mensagem
                </label>
                <Textarea 
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Sua mensagem aqui..."
                  className="min-h-[150px]"
                  required
                />
              </div>
              
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
              </Button>
            </form>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Fale com o Desenvolvedor</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Site</p>
                <a 
                  href="https://natanel.com.br" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  natanel.com.br
                </a>
              </div>
              
              <div>
                <p className="text-sm font-medium">WhatsApp</p>
                <a 
                  href="https://wa.me/5516992701617" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  (16) 99270-1617
                </a>
              </div>
              
              <div>
                <p className="text-sm font-medium">Endereço</p>
                <p className="text-gray-600">
                  Evidence Resort<br />
                  Ribeirão Preto - SP
                </p>
              </div>
              
              <div className="pt-4">
                <h3 className="text-lg font-medium mb-2">Horário de Funcionamento</h3>
                <p className="text-gray-600">
                  Segunda a Sexta: 9h às 18h<br />
                  Sábado: 9h às 12h
                </p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Importante:</strong> Este site é independente e não tem qualquer vinculação com a administração do Evidence Resort. É uma iniciativa particular para conectar moradores e facilitar a divulgação dos trabalhos e serviços oferecidos pelos condôminos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
