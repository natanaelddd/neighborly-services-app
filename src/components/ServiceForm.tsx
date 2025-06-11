
import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories } from '@/data/mockData';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/hooks/useAuth";

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Título deve ter pelo menos 5 caracteres.",
  }).max(100, {
    message: "Título deve ter no máximo 100 caracteres.",
  }),
  description: z.string().min(20, {
    message: "Descrição deve ter pelo menos 20 caracteres.",
  }).max(500, {
    message: "Descrição deve ter no máximo 500 caracteres.",
  }),
  categoryId: z.string().min(1, {
    message: "Selecione uma categoria.",
  }),
  whatsapp: z.string().min(10, {
    message: "Número de WhatsApp inválido.",
  }),
  block: z.string().refine(val => {
    const num = parseInt(val);
    return !isNaN(num) && num >= 1 && num <= 5;
  }, { message: "Informe um bloco válido entre 1 e 5." }),
  unit: z.string().min(1, {
    message: "Informe a casa.",
  }),
  logoUrl: z.string().optional(),
});

const ServiceForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const { profile } = useAuth();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      whatsapp: profile?.whatsapp || "",
      block: profile?.block || "",
      unit: profile?.house_number || "",
      logoUrl: "",
    },
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real application, you would upload this to your storage service
      // For now, we'll just create a local URL for preview
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
      form.setValue("logoUrl", url);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    // Simulating envio para API
    setTimeout(() => {
      console.log(values);
      
      // Simulate sending WhatsApp message
      const whatsappMessage = `Olá! Seu serviço "${values.title}" foi cadastrado com sucesso no site Vitrine Evidence. Em breve ele passará por aprovação. Obrigado!`;
      console.log("WhatsApp message:", whatsappMessage);
      console.log("Would send to:", values.whatsapp);
      
      toast.success("Serviço cadastrado com sucesso! Aguardando aprovação. Uma notificação foi enviada para seu WhatsApp.");
      setIsSubmitting(false);
      navigate("/");
    }, 1000);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título do Serviço</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: Limpeza Profissional de Casas" />
              </FormControl>
              <FormDescription>
                Um título claro e objetivo para seu serviço.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Descreva seu serviço em detalhes..." 
                  className="min-h-[120px]" 
                />
              </FormControl>
              <FormDescription>
                Descreva seu serviço, experiência e diferenciais.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div>
          <FormLabel className="block mb-2">Logo ou Imagem do Serviço</FormLabel>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <Input 
                type="file" 
                accept="image/*"
                onChange={handleLogoChange}
                className="cursor-pointer"
              />
              <FormDescription>
                Adicione uma logo ou imagem que represente seu serviço.
              </FormDescription>
            </div>
            {logoPreview && (
              <div className="w-24 h-24 rounded-md overflow-hidden border border-gray-200">
                <img 
                  src={logoPreview} 
                  alt="Logo preview" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="(16) 99999-9999" />
                </FormControl>
                <FormDescription>
                  Número para os clientes entrarem em contato.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="block"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bloco</FormLabel>
                <FormControl>
                  <Input {...field} type="number" min="1" max="5" placeholder="Ex: 1" />
                </FormControl>
                <FormDescription>
                  Número do bloco (1-5)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Casa</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: 101" />
                </FormControl>
                <FormDescription>
                  Número da sua casa
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
          {isSubmitting ? "Cadastrando..." : "Cadastrar Serviço"}
        </Button>
      </form>
    </Form>
  );
};

export default ServiceForm;
