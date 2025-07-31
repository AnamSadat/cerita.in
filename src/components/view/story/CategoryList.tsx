'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getCategory } from '@/lib/prisma/apiPrisma';
import { useEffect, useState } from 'react';

interface Props {
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
}

export default function CategoryList({
  selectedCategory,
  setSelectedCategory,
}: Props) {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategory();
        setCategories(res);
      } catch (err) {
        console.error('Gagal mengambil kategori:', err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
      <SelectTrigger className="w-48 border-2 border-gray-200 rounded-lg">
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Pilih Kategori</SelectLabel>
          {categories.map((story) => (
            <SelectItem
              key={story.id}
              value={story.name}
              className="text-white"
            >
              {story.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
