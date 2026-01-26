import localFont from 'next/font/local';

export const landingFont = localFont({
  src: [
    {
      path: '/lyon-arabic-display-black.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '/lyon-arabic-display-regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '/lyon-arabic-display-medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '/lyon-arabic-display-bold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
});
