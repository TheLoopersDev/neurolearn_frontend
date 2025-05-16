"use client";

const CategoriesSection = () => {
  const categories = [
    'Tất cả', 
    'IT Certifications', 
    'Leadership', 
    'Web Development', 
    'Communication', 
    'Business Analytics & Intelligence'
  ];

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto pb-4 gap-4">
          {categories.map((category) => (
            <button
              key={category}
              className="whitespace-nowrap px-4 py-2 rounded-full bg-gray-100 text-sm hover:bg-gray-200"
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection; 