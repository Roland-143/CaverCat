interface ProductFiltersProps {
  categories: string[];
  selectedCategory: string;
  handmadeOnly: boolean;
  recycledOnly: boolean;
  onCategoryChange: (category: string) => void;
  onHandmadeChange: (value: boolean) => void;
  onRecycledChange: (value: boolean) => void;
}

export const ProductFilters = ({
  categories,
  selectedCategory,
  handmadeOnly,
  recycledOnly,
  onCategoryChange,
  onHandmadeChange,
  onRecycledChange
}: ProductFiltersProps) => {
  return (
    <div className="grid gap-3 rounded-xl border border-cave-moss/30 bg-cave-basalt/80 p-4 sm:grid-cols-3">
      <label className="text-sm text-cave-mist/85">
        Category
        <select
          value={selectedCategory}
          onChange={(event) => onCategoryChange(event.target.value)}
          className="mt-1 block w-full rounded-md border border-cave-moss/35 bg-cave-slate/50 px-3 py-2 text-sm text-cave-mist focus:border-cave-glow focus:outline-none"
        >
          {categories.map((category) => (
            <option key={category} value={category} className="bg-cave-basalt">
              {category}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 rounded-md border border-cave-moss/30 bg-cave-slate/45 px-3 py-2 text-sm">
        <input
          type="checkbox"
          checked={handmadeOnly}
          onChange={(event) => onHandmadeChange(event.target.checked)}
          className="h-4 w-4 rounded border-cave-moss/40 bg-cave-basalt accent-cave-ember"
        />
        Handmade only
      </label>

      <label className="flex items-center gap-2 rounded-md border border-cave-moss/30 bg-cave-slate/45 px-3 py-2 text-sm">
        <input
          type="checkbox"
          checked={recycledOnly}
          onChange={(event) => onRecycledChange(event.target.checked)}
          className="h-4 w-4 rounded border-cave-moss/40 bg-cave-basalt accent-cave-ember"
        />
        90% recycled+ only
      </label>
    </div>
  );
};
