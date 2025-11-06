import { Facebook, Instagram, Phone } from 'lucide-react';

interface FooterProps {
  storeName?: string;
  description?: string;
  instaLink?: string;
  facebookLink?: string;
  phone?: string;
  telegram?: string;
}

export default function Footer({
  storeName,
  description,
  instaLink,
  facebookLink,
  phone,
  telegram,
}: FooterProps) {
  return (
    <footer className="mt-10 w-full border-t">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-10 text-center md:grid-cols-3 md:text-left">
        <div>
          <h2 className="text-xl font-semibold">{storeName ?? 'اسم المتجر'}</h2>
          <p className="mt-2 text-sm text-gray-600">{description ?? 'وصف قصير عن المتجر.'}</p>
        </div>

        <div className="flex flex-col space-y-2">
          <a href="#" className="text-sm text-gray-700 hover:text-black">
            المنتجات
          </a>
          <a href="#" className="text-sm text-gray-700 hover:text-black">
            من نحن
          </a>
          <a href="#" className="text-sm text-gray-700 hover:text-black">
            تواصل معنا
          </a>
        </div>

        <div className="flex flex-col items-center space-y-2 text-sm text-gray-500 md:items-end">
          {phone || (
            <div className="flex items-center gap-2">
              <Phone size={16} />
              <span>{phone}</span>
            </div>
          )}

          {instaLink || (
            <a
              href={instaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-black"
            >
              <Instagram size={16} /> Instagram
            </a>
          )}

          {facebookLink || (
            <a
              href={facebookLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-black"
            >
              <Facebook size={16} /> Facebook
            </a>
          )}
        </div>
      </div>

      <div className="bg-gray-950 py-4">
        <p className="text-center text-xs text-white">
          Powered by <span className="font-semibold text-white">Sahl</span> — Make your store free
          now
        </p>
      </div>
    </footer>
  );
}
