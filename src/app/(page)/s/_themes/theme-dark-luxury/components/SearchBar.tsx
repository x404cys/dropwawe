// THEME: dark-luxury — SearchBar

import BaseSearchBar from '../../../_components/store/SearchBar';
import type { SearchBarProps } from '../../../_lib/types';

export default function DarkLuxurySearchBar({ value, onChange, colors }: SearchBarProps) {
  return <BaseSearchBar value={value} onChange={onChange} colors={colors} />;
}
