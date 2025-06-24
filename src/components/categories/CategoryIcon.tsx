
import { Home, Settings, Info, Edit, Search, Filter, Plus, User } from "lucide-react";

interface CategoryIconProps {
  iconName?: string;
  size?: number;
}

const CategoryIcon = ({ iconName, size = 20 }: CategoryIconProps) => {
  // Check if it's an emoji
  if (iconName && iconName.length <= 4 && /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(iconName)) {
    return <span className="text-xl">{iconName}</span>;
  }

  // Map icon names to Lucide components
  switch (iconName) {
    case 'home':
      return <Home size={size} />;
    case 'settings':
      return <Settings size={size} />;
    case 'info':
      return <Info size={size} />;
    case 'edit':
      return <Edit size={size} />;
    case 'search':
      return <Search size={size} />;
    case 'filter':
      return <Filter size={size} />;
    case 'plus':
      return <Plus size={size} />;
    case 'user':
      return <User size={size} />;
    default:
      return <Info size={size} />;
  }
};

export default CategoryIcon;
