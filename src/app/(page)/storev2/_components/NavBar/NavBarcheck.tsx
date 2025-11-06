import StoreNavBarV1 from './StoreNavBarV1';

export default function NavBarcheck(
  { theme }: { theme: 'NORMAL' | 'MODERN' },
  { slug }: { slug: string }
) {
  if (theme == 'NORMAL') {
    return <StoreNavBarV1 slug={slug} />;
  } else if (theme == 'MODERN') {
    return <StoreNavBarV1 slug={slug} />;
  } else {
    return <StoreNavBarV1 slug={slug} />;
  }
}
