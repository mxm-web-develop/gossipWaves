import { readJSONFile } from "@/scripts/getdata";
import { Star } from "lucide-react";
import Fuse from 'fuse.js';


import Search from "./Search";
// import Image from "next/image";


export default async function Aitools({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const tools = await readJSONFile('web/aitools.json')
  const searchTerm = searchParams.q as string || '';
  const selectedCategory = searchParams.category as string || '';
  const fuse = new Fuse(tools, {
    keys: ['name', 'description', 'categories'],
    threshold: 0.4,
  });

  let filteredTools = searchTerm
    ? fuse.search(searchTerm).map(result => result.item)
    : tools;

  if (selectedCategory) {
    filteredTools = filteredTools.filter(tool => tool.categories === selectedCategory);
  }

  // Group filtered tools by categories
  const categories = filteredTools.reduce((acc: { [key: string]: any[] }, tool: any) => {
    if (!acc[tool.categories]) {
      acc[tool.categories] = [];
    }
    acc[tool.categories].push(tool);
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: '#121212', color: 'white' }}>
      <div className="flex-none p-4">
        <div className="flex items-center justify-center mb-4">
          <h1 className="font-fancy text-4xl">AI TOOLS</h1>
        </div>
        <Search
          initialSearchTerm={searchTerm}
          initialCategory={selectedCategory}
          categories={Array.from(new Set(tools.map(tool => tool.categories)))}
        />
      </div>

      <div className="flex-grow overflow-auto p-4">
        {filteredTools.length === 0 ? (
          <p className="text-center mt-8">没有找到匹配的工具。</p>
        ) : (
          Object.entries(categories).map(([category, categoryTools]) => (
            <div key={category} className="mb-8">
              <h3 className="text-lg py-5  bg-[#121212] z-10">{category}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryTools.map((tool: any) => (
                  <div key={tool._id} className="border rounded-lg p-4 hover:shadow-lg transition-transform transform hover:scale-105" style={{ backgroundColor: '#333', borderColor: '#444' }}>
                    <div className="flex items-center">
                      <h4 className="text-xl">{tool.name}</h4>
                    </div>
                    <p className="text-sm line-clamp-3 py-1 text-gray-400">{tool.description}</p>
                    <div className="flex py-3">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          size={14}
                          fill={index < tool.rate ? '#ffc107' : '#e4e5e9'}
                          key={index}
                          color={index < tool.rate ? '#ffc107' : '#e4e5e9'}
                        />
                      ))}
                    </div>
                    <a href={tool.url} className="text-blue-500 hover:underline">查看详情</a>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
