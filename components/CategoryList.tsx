```tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Category {
  _id: string;
  name: string;
}

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
        setCategories(response.data);
      } catch (err) {
        setError('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="bg-white shadow-md rounded-lg overflow-hidden">
        {categories.map((category) => (
          <li
            key={category._id}
            className="p-4 border-b last:border-b-0 hover:bg-gray-100 transition-colors"
          >
            {category.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
```