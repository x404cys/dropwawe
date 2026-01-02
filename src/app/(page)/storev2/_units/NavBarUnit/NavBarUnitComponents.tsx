import { useProducts } from '../../Data/context/products/ProductsContext';
import StoreNavBarTheme1 from './NavBarTheme1';
import NavBarTheme2 from './NavBarTheme2';

export default function NavBarUnitComponents() {
  const { store } = useProducts();
  return (
    <section>
      {store?.theme === 'NORMAL' && <StoreNavBarTheme1 />}
      {store?.theme === 'MODERN' && <NavBarTheme2 />}
    </section>
  );
}
