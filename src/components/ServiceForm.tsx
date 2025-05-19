
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
  block: z.string().min(1, {
    message: "Informe o bloco.",
  }),
  unit: z.string().min(1, {
    message: "Informe o apartamento.",
  }),
});

const ServiceForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      whatsapp: "",
      block: "",
      unit: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    // Simulando envio para API
    setTimeout(() => {
      console.log(values);
      toast.success("Serviço cadastrado com sucesso! Aguardando aprovação.");
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
                <Input {...field} placeholder="Ex: Limpeza Profissional de Apartamentos" />
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
                  <Input {...field} placeholder="(11) 99999-9999" />
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
                  <Input {...field} placeholder="Ex: A" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apartamento</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: 101" />
                </FormControl>
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
