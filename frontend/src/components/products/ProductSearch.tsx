interface ProductSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const ProductSearch = ({ value, onChange }: ProductSearchProps) => {
  return (
    <label className="flex w-full items-center rounded-xl border border-cave-moss/30 bg-cave-slate/45 px-4 py-3">
      <span className="sr-only">Search products</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by name, category, description, or sustainability tag"
        className="w-full bg-transparent text-sm text-cave-mist placeholder:text-cave-mist/65 focus:outline-none"
        aria-label="Search products"
      />
    </label>
  );
};
