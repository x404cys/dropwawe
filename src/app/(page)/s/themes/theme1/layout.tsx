import { ReactNode } from 'react';
import ProvidersWrapper from './_components/ProvidersWrapper';

export default function ThemeLayout({ children }: { children: ReactNode }) {
  return <ProvidersWrapper>{children}</ProvidersWrapper>;
}
