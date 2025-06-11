
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface IconSelectorProps {
  selectedIcon: string;
  onIconSelect: (icon: string) => void;
}

const IconSelector = ({ selectedIcon, onIconSelect }: IconSelectorProps) => {
  const [customIcon, setCustomIcon] = useState("");

  const predefinedIcons = [
    "🧹", "🔧", "🌱", "👶", "🍽️", "🚗", "💻", "📚", 
    "🏥", "📦", "🎨", "🎵", "💄", "🏃", "🧘", "🐕",
    "✂️", "🔌", "📱", "🛠️", "🏠", "🚿", "🧽", "🪟",
    "🎯", "📸", "🎪", "🎭", "🎨", "🎲", "🎮", "🎸"
  ];

  const handleCustomIconSubmit = () => {
    if (customIcon.trim()) {
      onIconSelect(customIcon.trim());
      setCustomIcon("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Selecionar Ícone</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Ícones predefinidos */}
        <div>
          <Label className="text-xs">Ícones disponíveis:</Label>
          <div className="grid grid-cols-8 gap-2 mt-2">
            {predefinedIcons.map((icon, index) => (
              <Button
                key={index}
                variant={selectedIcon === icon ? "default" : "outline"}
                size="sm"
                className="h-8 w-8 p-0 text-lg"
                onClick={() => onIconSelect(icon)}
              >
                {icon}
              </Button>
            ))}
          </div>
        </div>

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
          <div className="text-center p-2 bg-muted rounded">
            <span className="text-2xl">{selectedIcon}</span>
            <p className="text-xs text-muted-foreground mt-1">Ícone selecionado</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IconSelector;
