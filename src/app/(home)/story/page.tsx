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
import { BookOpenText, XCircle } from 'lucide-react';
import { Search, Filter } from 'lucide-react';
import StoryList from '@/components/view/story/StoryList';
import CategoryList from '@/components/view/story/CategoryList';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export default function Story() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [totalFilteredItems, setTotalFilteredItems] = useState(0);
  console.log('🚀 ~ Story ~ totalFilteredItems:', totalFilteredItems);

  const handleClearFilter = () => {
    setQuery('');
    setSelectedCategory('');
  };

  const isFiltering = query !== '' || selectedCategory !== '';

  return (
    <div className="min-h-screen pt-25 px-5 container mx-auto">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/" className="text-zinc-400 hover:text-white">
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
              placeholder="Search nama story."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-10 border-2 border-gray-200 focus:border-orange-400 rounded-xl"
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
            {isFiltering && (
              <Button
                onClick={handleClearFilter}
                className="flex items-center gap-1 px-3 py-2 cursor-pointer rounded-md bg-red-500 text-white text-sm hover:bg-red-600 transition"
              >
                <XCircle className="w-4 h-4" />
                Clear
              </Button>
            )}
          </div>
          <div className="flex flex-col">
            <StoryList
              query={query}
              category={selectedCategory}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onTotalChange={setTotalFilteredItems}
            />
          </div>
          <div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    className={
                      currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                    }
                  />
                </PaginationItem>

                {[...Array(Math.ceil(totalFilteredItems / itemsPerPage))].map(
                  (_, i) => (
                    <PaginationItem key={i} className="">
                      <PaginationLink
                        className={`border-0 px-3 py-1 rounded-md ${
                          currentPage === i + 1
                            ? 'bg-neutral-800/80 text-white hover:bg-neutral-800/80 hover:text-white' // ✅ Aktif
                            : 'bg-neutral-800/50 text-white/50 hover:text-white hover:bg-neutral-800/80 cursor-pointer'
                        }`}
                        isActive={currentPage === i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((p) =>
                        p < Math.ceil(totalFilteredItems / itemsPerPage)
                          ? p + 1
                          : p
                      )
                    }
                    className={
                      currentPage ===
                      Math.ceil(totalFilteredItems / itemsPerPage)
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
}
