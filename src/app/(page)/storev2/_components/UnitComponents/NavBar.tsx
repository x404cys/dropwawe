import { useProducts } from '../../Data/context/products/ProductsContext';
import StoreNavBarv2 from '../NavBar/StoreNavBarV2';
import StoreNavbarV1 from '../subComponents/_components/StoreNavbar';

export default function NavBarUnit({ subLink }: { subLink: string }) {
  const { store } = useProducts();
  return (
    <section>
      {store?.theme === 'NORMAL' && <StoreNavbarV1 slug={subLink} />}
      {store?.theme === 'MODERN' && <StoreNavBarv2 />}
    </section>
  );
}
