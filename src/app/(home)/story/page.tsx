'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Button } from '@/components/ui/button';
import { BookOpenText } from 'lucide-react';
import {
  Search,
  Filter,
  // MapPin, Loader2
} from 'lucide-react';
import StoryList from '@/components/view/story/StoryList';
import CategoryList from '@/components/view/story/CategoryList';
import { useState } from 'react';

export default function Story() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [query, setQuery] = useState('');

  return (
    <div className="min-h-screen pt-25 px-5 container mx-auto">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/" className="text-zinc-400">
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-white">Story</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className=" ">
        {/* Hero Header */}
        <div className="text-center space-y-4 py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-zinc-100 rounded-full">
            <BookOpenText
              className="w-8 h-8 text-black text-2xl"
              width={200}
              height={200}
            />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white pb-5">
            Stories
          </h1>
        </div>
        <div className="space-y-6 mb-5">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search category story."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-12 border-2 border-gray-200 focus:border-orange-400 rounded-xl"
            />
          </div>

          <div className="flex flex-wrap gap-4 justify-center items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">Filters:</span>
            </div>
            <CategoryList
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </div>
          <div className="flex flex-col">
            <StoryList query={query} category={selectedCategory} />
          </div>
        </div>
      </div>
    </div>
  );
}
