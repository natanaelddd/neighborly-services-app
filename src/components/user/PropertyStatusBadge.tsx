
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface PropertyStatusBadgeProps {
  status: string;
}

const PropertyStatusBadge = ({ status }: PropertyStatusBadgeProps) => {
  switch (status) {
    case 'approved':
      return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Aprovada</Badge>;
    case 'rejected':
      return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejeitada</Badge>;
    default:
      return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>;
  }
};

export default PropertyStatusBadge;
