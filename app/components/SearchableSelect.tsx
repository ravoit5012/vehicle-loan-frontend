import React, { useState } from "react";

interface Option {
  id: string | number;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: Option | null;
  onChange: (selected: Option) => void;
  placeholder?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
}) => {
  const [search, setSearch] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative w-full">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="border border-gray-300 rounded-md px-4 py-2 flex justify-between items-center cursor-pointer bg-white hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      >
        <span>{value ? value.label : placeholder}</span>
        <svg
          className={`w-5 h-5 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full px-4 py-2 border-b border-gray-200 focus:outline-none"
          />
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <div
                key={opt.id}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                  setSearch("");
                }}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
              >
                {opt.label}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500">No options found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
