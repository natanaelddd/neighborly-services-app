
export interface PropertyFormData {
  title: string;
  description: string;
  type: string;
  price: string;
  bedrooms: string;
  garageCovered: boolean;
  isRenovated: boolean;
  whatsapp: string;
}

export const initialFormData: PropertyFormData = {
  title: "",
  description: "",
  type: "venda",
  price: "",
  bedrooms: "3",
  garageCovered: false,
  isRenovated: false,
  whatsapp: ""
};
