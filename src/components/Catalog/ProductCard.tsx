import { Plus } from 'lucide-react';

type ProductCardProps = {
  name: string;
  description: string | null;
  basePrice: number;
  imageUrl: string | null;
  onClick: () => void;
};

export default function ProductCard({ name, description, basePrice, imageUrl, onClick }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="aspect-square bg-gradient-to-br from-orange-300 to-orange-500 relative overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-white text-5xl font-bold">{name[0]}</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-1">{name}</h3>
        {description && <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-orange-600">${basePrice.toFixed(2)}</span>
          <button
            onClick={onClick}
            className="bg-orange-600 text-white p-2 rounded-full hover:bg-orange-700 transition"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
