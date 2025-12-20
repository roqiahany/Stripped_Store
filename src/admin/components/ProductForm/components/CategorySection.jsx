import CategorySelectorPopup from './../../CategorySelectorPopup';

export default function CategorySection({ categories, value, onSelect }) {
  return (
    <CategorySelectorPopup
      categories={categories}
      value={value}
      onSelect={onSelect}
    />
  );
}
