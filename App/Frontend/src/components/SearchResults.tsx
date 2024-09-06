import React from "react";
import { useNavigate } from "react-router-dom";

interface SearchResultsProps {
  searchItem: {
    id: number;
    name: string;
  }[];
}

export const SearchResults: React.FC<SearchResultsProps> = ({ searchItem }) => {

  const navigate = useNavigate();
  const routeChange = (id: number) => {
    const path = `/product/${id}`;
    navigate(path);
  };


  return (
    <div className=" w-1/3 absolute bg-white flex flex-col text-left max-h-[300px] overflow-y mt-1 shadow-lg rounded-lg">
      {searchItem.length > 0 ? (
        searchItem.map((item) => (
          <div key={item.id} className="py-2 px-3 border-b cursor-pointer rounded-lg hover:bg-gray-200 transition-colors"
          onClick={() => routeChange(item.id)}>
            {item.name}
          </div>
        ))
      ) : (
        <div>No results found</div>
      )}
    </div>
  );
};
