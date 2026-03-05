'use client';

export default function CategoriesScreen({ config, onNavigateToCategory }) {
  const categories = config?.menuStructure?.children || [];

  return (
    <div className="grid grid-cols-2 gap-3 animate-fadeIn">
      {categories.map((category, index) => (
        <button
          key={category.id}
          onClick={() => onNavigateToCategory(category.id)}
          className="rounded-2xl p-4 h-36 flex flex-col justify-between text-left hover:opacity-90 transition-all duration-200 animate-scaleIn"
          style={{ backgroundColor: '#25303d', animationDelay: `${index * 50}ms` }}
        >
          {/* Category name - top */}
          <span className="text-white font-semibold text-sm uppercase leading-tight line-clamp-3">
            {category.name}
          </span>

          {/* Bottom row: tree icon left, CATALOG badge right */}
          <div className="flex items-end justify-between">
            <img
              src="/catalog-tree-icon.png"
              alt=""
              className="w-8 h-8 object-contain opacity-90"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <span className="bg-white text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
              CATALOG
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
