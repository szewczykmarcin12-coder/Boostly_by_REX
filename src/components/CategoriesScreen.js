'use client';

import { menuStructure } from '@/data/menuStructure';
import { 
  Monitor, 
  Book, 
  UserPlus, 
  Info, 
  Smile, 
  AlertTriangle, 
  CheckCircle, 
  ShoppingBag, 
  Clock, 
  Truck,
  ChevronRight,
  FolderOpen
} from 'lucide-react';

const iconMap = {
  'monitor': Monitor,
  'book': Book,
  'user-plus': UserPlus,
  'info': Info,
  'smile': Smile,
  'alert-triangle': AlertTriangle,
  'check-circle': CheckCircle,
  'shopping-bag': ShoppingBag,
  'clock': Clock,
  'truck': Truck,
};

export default function CategoriesScreen({ onNavigateToCategory }) {
  const categories = menuStructure.children;

  return (
    <div className="space-y-3 animate-fadeIn">
      {categories.map((category, index) => {
        const Icon = iconMap[category.icon] || FolderOpen;
        
        return (
          <button
            key={category.id}
            onClick={() => onNavigateToCategory(category.id)}
            className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all duration-200 animate-slideIn"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-gray-600" />
            </div>
            <span className="flex-1 text-left font-semibold text-gray-800 uppercase text-sm tracking-wide">
              {category.name}
            </span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        );
      })}
    </div>
  );
}
