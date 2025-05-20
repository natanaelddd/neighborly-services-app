
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface FeaturedAd {
  title: string;
  description: string;
  imageUrl: string;
}

interface FeaturedAdEditorProps {
  featuredAd: FeaturedAd;
  onSave: (ad: FeaturedAd) => void;
}

const FeaturedAdEditor = ({ featuredAd, onSave }: FeaturedAdEditorProps) => {
  const [adData, setAdData] = useState<FeaturedAd>(featuredAd);

  const handleSaveFeaturedAd = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(adData);
    toast.success("Anúncio em destaque atualizado com sucesso!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Anúncio em Destaque</CardTitle>
        <CardDescription>
          Personalize o anúncio em destaque na página inicial
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSaveFeaturedAd} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="ad-title">Título do Anúncio</Label>
                <Input
                  id="ad-title"
                  value={adData.title}
                  onChange={(e) => setAdData({...adData, title: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="ad-description">Descrição</Label>
                <Textarea
                  id="ad-description"
                  value={adData.description}
                  onChange={(e) => setAdData({...adData, description: e.target.value})}
                  rows={5}
                />
              </div>
              <div>
                <Label htmlFor="ad-image">URL da Imagem</Label>
                <Input
                  id="ad-image"
                  value={adData.imageUrl}
                  onChange={(e) => setAdData({...adData, imageUrl: e.target.value})}
                  placeholder="/path/to/image.jpg"
                />
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">Pré-visualização</h3>
              <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-3">
                <img 
                  src={adData.imageUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <h4 className="font-bold">{adData.title}</h4>
              <p className="text-sm text-muted-foreground">
                {adData.description.length > 100
                  ? `${adData.description.substring(0, 100)}...`
                  : adData.description}
              </p>
            </div>
          </div>
          
          <Button type="submit">Salvar Alterações</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FeaturedAdEditor;
