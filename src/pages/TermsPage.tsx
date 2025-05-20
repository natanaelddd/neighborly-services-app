
const TermsPage = () => {
  return (
    <div className="container-custom py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Termos de Uso</h1>
        
        <div className="prose prose-blue max-w-none">
          <p>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
          
          <h2>1. Aceitação dos Termos</h2>
          <p>
            Ao acessar e utilizar o Vitrine Evidence, você concorda com estes Termos de Uso. 
            Se você não concordar com qualquer parte destes termos, por favor, não utilize nosso serviço.
          </p>
          
          <h2>2. Descrição do Serviço</h2>
          <p>
            O Vitrine Evidence é uma plataforma exclusiva para moradores do condomínio Evidence Resort, 
            destinada a conectar moradores com prestadores de serviços que também residem no condomínio.
          </p>
          
          <h2>3. Elegibilidade</h2>
          <p>
            Para cadastrar um serviço na plataforma, você deve ser morador do condomínio Evidence Resort. 
            A administração reserva-se o direito de verificar esta informação.
          </p>
          
          <h2>4. Cadastro de Serviços</h2>
          <p>
            Ao cadastrar um serviço, você declara que todas as informações fornecidas são verdadeiras e precisas. 
            Serviços cadastrados passarão por aprovação antes de serem publicados.
          </p>
          
          <h2>5. Responsabilidades</h2>
          <p>
            O Vitrine Evidence atua apenas como plataforma de conexão e não se responsabiliza pela qualidade 
            dos serviços prestados, negociações ou transações realizadas entre os usuários.
          </p>
          
          <h2>6. Conteúdo Proibido</h2>
          <p>
            É proibido o cadastro de serviços ilegais, que violem direitos de terceiros ou que contenham 
            conteúdo ofensivo, discriminatório ou inadequado.
          </p>
          
          <h2>7. Modificações</h2>
          <p>
            Reservamo-nos o direito de modificar estes termos a qualquer momento. 
            As alterações entrarão em vigor imediatamente após sua publicação.
          </p>
          
          <h2>8. Encerramento de Conta</h2>
          <p>
            Reservamo-nos o direito de suspender ou encerrar o acesso de qualquer usuário que viole estes termos.
          </p>
          
          <h2>9. Contato</h2>
          <p>
            Para questões relacionadas a estes termos, entre em contato através da página de Contato.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
