import { ReactNode } from 'react';

export default function Theme2Layout({ children }: { children: ReactNode }) {
  return (
    <div className="theme-2 bg-gray-50 text-gray-800">
      <header className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
        <h1 className="text-3xl font-bold">Theme 2 Store</h1>
      </header>
      <nav className="border-b border-gray-200 bg-white p-3">
        <ul className="flex gap-6 px-4">
          <li>
            <a href="/" className="hover:text-purple-600">
              Home
            </a>
          </li>
          <li>
            <a href="/cart" className="hover:text-purple-600">
              Cart
            </a>
          </li>
        </ul>
      </nav>
      <main className="mx-auto max-w-6xl p-6">{children}</main>
      <footer className="mt-12 bg-gray-900 p-6 text-center text-gray-300">
        © 2025 Theme 2 Store - Premium Edition
      </footer>
    </div>
  );
}
