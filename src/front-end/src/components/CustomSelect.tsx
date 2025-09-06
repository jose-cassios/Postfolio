import { useState, useRef, useEffect } from "react";

interface SelectOption {
  label: string;
  value: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
  placeholder?: string;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  className = "",
  placeholder = "Selecione...",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const handleSelect = (optionValue: string) =>{
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find(option => option.value === value);
  
  
  return (
    <div ref={selectRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 rounded-lg bg-indigo-900/80 border border-indigo-700 text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition cursor-pointer font-sans text-left flex items-center justify-between"
      >
        <span className="block truncate">
            {selectedOption ? selectedOption.label : placeholder}
        </span>

        <svg
            className={`w-4 h-4 ml-4 text-blue-100 transition-transform duration-200 ${
                        isOpen ? '' : 'rotate-90'
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
      </button>
      {isOpen &&(
        <div className="absolute top-full left-0 right-0 mt-1 bg-indigo-900/95 border border-indigo-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            {options.map((option)=>(
                <button
                    key={option.value}
                    type="button"
                    onClick={()=>handleSelect(option.value)}
                    className={`w-full px-4 py-2 text-left font-sans transition-colors ${
                                option.value === value
                                    ? 'bg-indigo-800/60 text-blue-200'
                                    : 'text-blue-100 hover:bg-indigo-800/40'
                            } first:rounded-t-lg last:rounded-b-lg`}
                >
                    {option.label}
                </button>
            ))}
        </div>
      )}
    </div>
  );
}
