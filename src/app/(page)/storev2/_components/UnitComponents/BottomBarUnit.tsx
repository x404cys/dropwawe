import { useProducts } from '../../Data/context/products/ProductsContext';
import StoreBottomNav from '../NavBar/BottomNavBar';
import BottomNavBarV2 from '../NavBar/BottomNavBarV2';

export default function BottomBarUnit() {
  const { store } = useProducts();
  return (
    <section>
      {store?.theme === 'NORMAL' && <BottomNavBarV2 />}
      {store?.theme === 'MODERN' && <StoreBottomNav />}
    </section>
  );
}
