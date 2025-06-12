
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface WhatsAppInputProps {
  value: string;
  onChange: (value: string) => void;
}

const WhatsAppInput = ({ value, onChange }: WhatsAppInputProps) => {
  const formatWhatsApp = (inputValue: string) => {
    // Remove tudo que não é número
    const numbers = inputValue.replace(/\D/g, '');
    
    // Limita a 11 dígitos (DDD + número)
    const limited = numbers.slice(0, 11);
    
    // Aplica máscara
    if (limited.length <= 2) {
      return limited;
    } else if (limited.length <= 7) {
      return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
    } else {
      return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWhatsApp(e.target.value);
    onChange(formatted);
  };

  return (
    <div>
      <Label htmlFor="whatsapp" className="text-sm font-medium">WhatsApp *</Label>
      <Input
        id="whatsapp"
        value={value}
        onChange={handleChange}
        placeholder="(16) 99999-9999"
        required
        className="mt-1"
      />
      <p className="text-xs text-gray-500 mt-1">Digite apenas o DDD e número</p>
    </div>
  );
};

export default WhatsAppInput;
