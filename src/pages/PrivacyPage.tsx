
const PrivacyPage = () => {
  return (
    <div className="container-custom py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Política de Privacidade</h1>
        
        <div className="prose prose-blue max-w-none">
          <p>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
          
          <h2>1. Informações Coletadas</h2>
          <p>
            Coletamos informações pessoais como nome, endereço, número do bloco e casa, e-mail e número de telefone
            para possibilitar o funcionamento da plataforma.
          </p>
          
          <h2>2. Uso das Informações</h2>
          <p>
            As informações coletadas são utilizadas para:
          </p>
          <ul>
            <li>Cadastrar e exibir os serviços na plataforma</li>
            <li>Permitir o contato entre moradores e prestadores de serviço</li>
            <li>Verificar se o prestador reside no condomínio</li>
            <li>Enviar comunicados importantes sobre a plataforma</li>
          </ul>
          
          <h2>3. Compartilhamento de Informações</h2>
          <p>
            Compartilhamos publicamente apenas as informações necessárias para identificação do serviço e contato 
            com o prestador. Dados sensíveis não são compartilhados.
          </p>
          
          <h2>4. Segurança</h2>
          <p>
            Implementamos medidas de segurança para proteger suas informações pessoais, mas nenhum sistema é 
            completamente seguro. Não podemos garantir a segurança absoluta dos seus dados.
          </p>
          
          <h2>5. Cookies</h2>
          <p>
            Utilizamos cookies para melhorar a experiência do usuário e análise de uso da plataforma.
          </p>
          
          <h2>6. Seus Direitos</h2>
          <p>
            Você tem o direito de acessar, corrigir ou excluir seus dados pessoais a qualquer momento.
            Para exercer estes direitos, entre em contato através da página de Contato.
          </p>
          
          <h2>7. Alterações na Política</h2>
          <p>
            Podemos atualizar esta política periodicamente. A versão mais recente sempre estará disponível nesta página.
          </p>
          
          <h2>8. Contato</h2>
          <p>
            Para questões relacionadas à privacidade, entre em contato através da página de Contato.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
