type CategoryCardProps = {
  name: string;
  description: string | null;
  imageUrl: string | null;
  onClick: () => void;
};

export default function CategoryCard({ name, description, imageUrl, onClick }: CategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 w-full text-left"
    >
      <div className="aspect-video bg-gradient-to-br from-orange-400 to-orange-600 relative overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-white text-4xl font-bold">{name[0]}</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-1">{name}</h3>
        {description && <p className="text-gray-600 text-sm line-clamp-2">{description}</p>}
      </div>
    </button>
  );
}
