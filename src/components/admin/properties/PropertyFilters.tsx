
import { Button } from "@/components/ui/button";
import { Property } from "@/types";

interface PropertyFiltersProps {
  filter: 'all' | 'pending' | 'approved' | 'rejected';
  setFilter: (filter: 'all' | 'pending' | 'approved' | 'rejected') => void;
  properties: Property[];
}

const PropertyFilters = ({ filter, setFilter, properties }: PropertyFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <Button
        variant={filter === 'all' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setFilter('all')}
      >
        Todas ({properties.length})
      </Button>
      <Button
        variant={filter === 'pending' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setFilter('pending')}
      >
        Pendentes ({properties.filter(p => p.status === 'pending').length})
      </Button>
      <Button
        variant={filter === 'approved' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setFilter('approved')}
      >
        Aprovadas ({properties.filter(p => p.status === 'approved').length})
      </Button>
      <Button
        variant={filter === 'rejected' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setFilter('rejected')}
      >
        Rejeitadas ({properties.filter(p => p.status === 'rejected').length})
      </Button>
    </div>
  );
};

export default PropertyFilters;
