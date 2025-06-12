
// Mock data for demonstration purposes
export const mockCategories = [
  { id: 1, name: 'Limpeza', icon: '🧹', display_order: 1, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 2, name: 'Jardinagem', icon: '🌱', display_order: 2, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 3, name: 'Manutenção', icon: '🔧', display_order: 3, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 4, name: 'Pet Care', icon: '🐕', display_order: 4, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 5, name: 'Beleza', icon: '💄', display_order: 5, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 6, name: 'Culinária', icon: '👨‍🍳', display_order: 6, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 7, name: 'Tecnologia', icon: '💻', display_order: 7, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 8, name: 'Educação', icon: '📚', display_order: 8, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 9, name: 'Saúde', icon: '⚕️', display_order: 9, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 10, name: 'Transporte', icon: '🚗', display_order: 10, created_at: '2024-01-01', updated_at: '2024-01-01' }
];

export const mockProfiles = [
  { id: 'mock-1', name: 'Maria Silva', email: 'maria@evidence.com', block: 'A', house_number: '10', whatsapp: '+55 11 99999-1111', created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 'mock-2', name: 'João Santos', email: 'joao@evidence.com', block: 'B', house_number: '15', whatsapp: '+55 11 99999-2222', created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 'mock-3', name: 'Ana Costa', email: 'ana@evidence.com', block: 'C', house_number: '20', whatsapp: '+55 11 99999-3333', created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 'mock-4', name: 'Pedro Lima', email: 'pedro@evidence.com', block: 'A', house_number: '05', whatsapp: '+55 11 99999-4444', created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 'mock-5', name: 'Carla Oliveira', email: 'carla@evidence.com', block: 'B', house_number: '08', whatsapp: '+55 11 99999-5555', created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 'mock-6', name: 'Roberto Alves', email: 'roberto@evidence.com', block: 'C', house_number: '12', whatsapp: '+55 11 99999-6666', created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 'mock-7', name: 'Fernanda Souza', email: 'fernanda@evidence.com', block: 'A', house_number: '18', whatsapp: '+55 11 99999-7777', created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 'mock-8', name: 'Carlos Pereira', email: 'carlos@evidence.com', block: 'B', house_number: '22', whatsapp: '+55 11 99999-8888', created_at: '2024-01-01', updated_at: '2024-01-01' }
];

export const mockServices = [
  {
    id: 1,
    unit_id: 'mock-1',
    category_id: 1,
    title: 'Limpeza Residencial Completa',
    description: 'Serviço de limpeza completa para sua casa. Incluindo todos os cômodos, janelas e áreas externas. Produtos de qualidade e equipe experiente.',
    whatsapp: '+55 11 99999-1111',
    status: 'approved',
    photo_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-16T10:00:00Z',
    profiles: mockProfiles[0],
    categories: mockCategories[0]
  },
  {
    id: 2,
    unit_id: 'mock-2',
    category_id: 2,
    title: 'Jardinagem e Paisagismo',
    description: 'Cuidado completo do seu jardim. Poda, plantio, adubação e manutenção de gramados. Transformo seu espaço verde num verdadeiro paraíso.',
    whatsapp: '+55 11 99999-2222',
    status: 'approved',
    photo_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
    created_at: '2024-01-14T10:00:00Z',
    updated_at: '2024-01-16T10:00:00Z',
    profiles: mockProfiles[1],
    categories: mockCategories[1]
  },
  {
    id: 3,
    unit_id: 'mock-3',
    category_id: 3,
    title: 'Manutenção Elétrica e Hidráulica',
    description: 'Eletricista e encanador com 15 anos de experiência. Instalações, reparos emergenciais e manutenção preventiva. Atendimento rápido e confiável.',
    whatsapp: '+55 11 99999-3333',
    status: 'approved',
    photo_url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400',
    created_at: '2024-01-13T10:00:00Z',
    updated_at: '2024-01-16T10:00:00Z',
    profiles: mockProfiles[2],
    categories: mockCategories[2]
  },
  {
    id: 4,
    unit_id: 'mock-4',
    category_id: 4,
    title: 'Cuidador de Pets',
    description: 'Cuidado carinhoso para seus pets enquanto você viaja. Passeios, alimentação, medicação e muito carinho. Seu pet em boas mãos!',
    whatsapp: '+55 11 99999-4444',
    status: 'approved',
    photo_url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
    created_at: '2024-01-12T10:00:00Z',
    updated_at: '2024-01-16T10:00:00Z',
    profiles: mockProfiles[3],
    categories: mockCategories[3]
  },
  {
    id: 5,
    unit_id: 'mock-5',
    category_id: 5,
    title: 'Manicure e Pedicure',
    description: 'Serviços de beleza no conforto da sua casa. Manicure, pedicure, esmaltação em gel e cuidados com cutículas. Atendimento personalizado.',
    whatsapp: '+55 11 99999-5555',
    status: 'approved',
    photo_url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400',
    created_at: '2024-01-11T10:00:00Z',
    updated_at: '2024-01-16T10:00:00Z',
    profiles: mockProfiles[4],
    categories: mockCategories[4]
  },
  {
    id: 6,
    unit_id: 'mock-6',
    category_id: 6,
    title: 'Chef Particular',
    description: 'Cozinheiro profissional para eventos especiais, jantares românticos ou refeições semanais. Cardápio personalizado e ingredientes frescos.',
    whatsapp: '+55 11 99999-6666',
    status: 'approved',
    photo_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-16T10:00:00Z',
    profiles: mockProfiles[5],
    categories: mockCategories[5]
  },
  {
    id: 7,
    unit_id: 'mock-7',
    category_id: 7,
    title: 'Suporte Técnico em Informática',
    description: 'Técnico em informática especializado em reparos, instalação de programas e configuração de redes. Atendimento domiciliar rápido e eficiente.',
    whatsapp: '+55 11 99999-7777',
    status: 'pending',
    photo_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
    created_at: '2024-01-09T10:00:00Z',
    updated_at: '2024-01-09T10:00:00Z',
    profiles: mockProfiles[6],
    categories: mockCategories[6]
  },
  {
    id: 8,
    unit_id: 'mock-8',
    category_id: 8,
    title: 'Aulas Particulares de Inglês',
    description: 'Professora de inglês com certificação internacional. Aulas personalizadas para todos os níveis, preparação para exames e conversação.',
    whatsapp: '+55 11 99999-8888',
    status: 'pending',
    photo_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400',
    created_at: '2024-01-08T10:00:00Z',
    updated_at: '2024-01-08T10:00:00Z',
    profiles: mockProfiles[7],
    categories: mockCategories[7]
  },
  {
    id: 9,
    unit_id: 'mock-1',
    category_id: 9,
    title: 'Fisioterapia Domiciliar',
    description: 'Fisioterapeuta com especialização em ortopedia. Atendimento domiciliar para reabilitação, RPG e pilates terapêutico.',
    whatsapp: '+55 11 99999-1111',
    status: 'rejected',
    photo_url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
    created_at: '2024-01-07T10:00:00Z',
    updated_at: '2024-01-07T12:00:00Z',
    profiles: mockProfiles[0],
    categories: mockCategories[8]
  },
  {
    id: 10,
    unit_id: 'mock-2',
    category_id: 10,
    title: 'Motorista Particular',
    description: 'Motorista experiente e confiável para viagens, aeroporto, consultas médicas e passeios. Veículo próprio limpo e confortável.',
    whatsapp: '+55 11 99999-2222',
    status: 'approved',
    photo_url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400',
    created_at: '2024-01-06T10:00:00Z',
    updated_at: '2024-01-16T10:00:00Z',
    profiles: mockProfiles[1],
    categories: mockCategories[9]
  }
];

export const mockProperties = [
  {
    id: 1,
    unit_id: 'mock-3',
    title: 'Casa Moderna - Bloco A',
    description: 'Linda casa de 3 quartos sendo 1 suíte, sala ampla com pé direito alto, cozinha planejada e área gourmet completa. Acabamento de primeira qualidade com porcelanato em todos os ambientes.',
    type: 'venda' as const,
    price: 'R$ 520.000',
    bedrooms: 3,
    garage_covered: true,
    is_renovated: true,
    whatsapp: '+55 11 99999-3333',
    status: 'approved',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-16T10:00:00Z',
    rejection_reason: null,
    profiles: mockProfiles[2],
    property_photos: [
      { photo_url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800', is_primary: true },
      { photo_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800', is_primary: false },
      { photo_url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800', is_primary: false }
    ]
  },
  {
    id: 2,
    unit_id: 'mock-4',
    title: 'Oportunidade de Locação',
    description: 'Casa mobiliada de 2 quartos, ideal para casais. Inclui todos os móveis, eletrodomésticos e utensílios. Pronta para morar, apenas trazer as roupas!',
    type: 'aluguel' as const,
    price: 'R$ 2.800/mês',
    bedrooms: 2,
    garage_covered: true,
    is_renovated: false,
    whatsapp: '+55 11 99999-4444',
    status: 'approved',
    created_at: '2024-01-14T10:00:00Z',
    updated_at: '2024-01-16T10:00:00Z',
    rejection_reason: null,
    profiles: mockProfiles[3],
    property_photos: [
      { photo_url: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800', is_primary: true },
      { photo_url: 'https://images.unsplash.com/photo-1567496898669-ee935f5317be?w=800', is_primary: false }
    ]
  },
  {
    id: 3,
    unit_id: 'mock-5',
    title: 'Casa com Vista Privilegiada',
    description: 'Casa de 4 quartos com vista para área verde do condomínio. Sala de estar e jantar integradas, cozinha gourmet e churrasqueira. Jardim privativo.',
    type: 'venda' as const,
    price: 'R$ 650.000',
    bedrooms: 4,
    garage_covered: true,
    is_renovated: true,
    whatsapp: '+55 11 99999-5555',
    status: 'pending',
    created_at: '2024-01-13T10:00:00Z',
    updated_at: '2024-01-13T10:00:00Z',
    rejection_reason: null,
    profiles: mockProfiles[4],
    property_photos: [
      { photo_url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800', is_primary: true },
      { photo_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', is_primary: false },
      { photo_url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800', is_primary: false }
    ]
  },
  {
    id: 4,
    unit_id: 'mock-6',
    title: 'Casa Econômica para Locação',
    description: 'Casa simples de 2 quartos, ideal para quem busca economia. Bem localizada no condomínio, próxima à área de lazer e portaria.',
    type: 'aluguel' as const,
    price: 'R$ 2.200/mês',
    bedrooms: 2,
    garage_covered: false,
    is_renovated: false,
    whatsapp: '+55 11 99999-6666',
    status: 'approved',
    created_at: '2024-01-12T10:00:00Z',
    updated_at: '2024-01-16T10:00:00Z',
    rejection_reason: null,
    profiles: mockProfiles[5],
    property_photos: [
      { photo_url: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800', is_primary: true },
      { photo_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', is_primary: false }
    ]
  },
  {
    id: 5,
    unit_id: 'mock-7',
    title: 'Casa de Luxo - Bloco C',
    description: 'Casa premium de 4 quartos sendo 2 suítes, closet, sala de TV, escritório, cozinha gourmet com ilha. Garagem para 2 carros e área de lazer privativa.',
    type: 'venda' as const,
    price: 'R$ 850.000',
    bedrooms: 4,
    garage_covered: true,
    is_renovated: true,
    whatsapp: '+55 11 99999-7777',
    status: 'rejected',
    created_at: '2024-01-11T10:00:00Z',
    updated_at: '2024-01-11T12:00:00Z',
    rejection_reason: 'Fotos insuficientes para avaliação',
    profiles: mockProfiles[6],
    property_photos: [
      { photo_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', is_primary: true },
      { photo_url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800', is_primary: false },
      { photo_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', is_primary: false }
    ]
  },
  {
    id: 6,
    unit_id: 'mock-8',
    title: 'Casa Familiar Completa',
    description: 'Casa perfeita para famílias grandes. 3 quartos amplos, 2 banheiros, sala de estar, copa/cozinha e área de serviço. Quintal gramado para crianças brincarem.',
    type: 'aluguel' as const,
    price: 'R$ 3.200/mês',
    bedrooms: 3,
    garage_covered: true,
    is_renovated: false,
    whatsapp: '+55 11 99999-8888',
    status: 'pending',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z',
    rejection_reason: null,
    profiles: mockProfiles[7],
    property_photos: [
      { photo_url: 'https://images.unsplash.com/photo-1558618666-fbd29c5cd9d4?w=800', is_primary: true },
      { photo_url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', is_primary: false }
    ]
  }
];
