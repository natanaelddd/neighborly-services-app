
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface IconSelectorProps {
  selectedIcon: string;
  onIconSelect: (icon: string) => void;
}

const IconSelector = ({ selectedIcon, onIconSelect }: IconSelectorProps) => {
  const [customIcon, setCustomIcon] = useState("");

  const serviceIcons = [
    "🧹", "🔧", "🌱", "👶", "🍽️", "🚗", "💻", "📚", 
    "🏥", "📦", "🎨", "🎵", "💄", "🏃", "🧘", "🐕"
  ];

  const homeIcons = [
    "🏠", "🔨", "🛠️", "🔌", "🚿", "🧽", "🪟", "🪴",
    "🔧", "⚙️", "🧰", "🛡️", "🔐", "💡", "🚪", "🪑"
  ];

  const professionalIcons = [
    "👩‍⚕️", "👨‍💼", "👩‍🍳", "👨‍🔬", "👩‍💻", "👨‍🎨", "👩‍🏫", "👨‍⚖️",
    "👩‍✈️", "👨‍🔧", "👩‍🌾", "👨‍🍳", "👩‍💼", "👨‍⚕️", "👩‍🔧", "👨‍🎓"
  ];

  const recreationIcons = [
    "🎯", "📸", "🎪", "🎭", "🎨", "🎲", "🎮", "🎸",
    "🏊", "🚴", "⚽", "🏀", "🎾", "🏓", "🎳", "🎪"
  ];

  const businessIcons = [
    "💼", "📊", "💰", "📈", "🏪", "🛒", "💳", "🏦",
    "📱", "💻", "🖥️", "⌨️", "🖨️", "📠", "📞", "📧"
  ];

  const transportIcons = [
    "🚗", "🚙", "🚕", "🚌", "🚎", "🏎️", "🚓", "🚑",
    "🚒", "🚐", "🛻", "🚚", "🚛", "🚜", "🏍️", "🛵"
  ];

  const handleCustomIconSubmit = () => {
    if (customIcon.trim()) {
      onIconSelect(customIcon.trim());
      setCustomIcon("");
    }
  };

  const IconGrid = ({ icons }: { icons: string[] }) => (
    <div className="grid grid-cols-8 gap-2">
      {icons.map((icon, index) => (
        <Button
          key={index}
          variant={selectedIcon === icon ? "default" : "outline"}
          size="sm"
          className="h-10 w-10 p-0 text-lg hover:scale-110 transition-transform"
          onClick={() => onIconSelect(icon)}
        >
          {icon}
        </Button>
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Selecionar Ícone</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="services" className="w-full">
          <TabsList className="grid w-full grid-cols-3 text-xs">
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="home">Casa</TabsTrigger>
            <TabsTrigger value="business">Negócios</TabsTrigger>
          </TabsList>
          
          <TabsContent value="services" className="space-y-4">
            <div>
              <Label className="text-xs">Serviços Gerais:</Label>
              <div className="mt-2">
                <IconGrid icons={serviceIcons} />
              </div>
            </div>
            
            <div>
              <Label className="text-xs">Profissionais:</Label>
              <div className="mt-2">
                <IconGrid icons={professionalIcons} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="home" className="space-y-4">
            <div>
              <Label className="text-xs">Casa e Manutenção:</Label>
              <div className="mt-2">
                <IconGrid icons={homeIcons} />
              </div>
            </div>
            
            <div>
              <Label className="text-xs">Lazer e Recreação:</Label>
              <div className="mt-2">
                <IconGrid icons={recreationIcons} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="business" className="space-y-4">
            <div>
              <Label className="text-xs">Negócios:</Label>
              <div className="mt-2">
                <IconGrid icons={businessIcons} />
              </div>
            </div>
            
            <div>
              <Label className="text-xs">Transporte:</Label>
              <div className="mt-2">
                <IconGrid icons={transportIcons} />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Ícone personalizado */}
        <div>
          <Label htmlFor="custom-icon" className="text-xs">Ou digite um emoji personalizado:</Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="custom-icon"
              value={customIcon}
              onChange={(e) => setCustomIcon(e.target.value)}
              placeholder="Ex: 🎯"
              className="h-8"
            />
            <Button 
              size="sm" 
              onClick={handleCustomIconSubmit}
              className="h-8"
            >
              Usar
            </Button>
          </div>
        </div>

        {/* Ícone selecionado */}
        {selectedIcon && (
          <div className="text-center p-3 bg-muted rounded border-2 border-primary/20">
            <span className="text-3xl">{selectedIcon}</span>
            <p className="text-xs text-muted-foreground mt-1">Ícone selecionado</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IconSelector;
