import { Home, Wallet, Plus, Settings, User } from 'lucide-react';

export default function BottomNavBar() {
  return (
    <div className="fixed bottom-5 left-1/2 z-50 w-full max-w-md -translate-x-1/2">
      <div className="mx-auto flex h-16 items-center justify-around rounded-2xl border border-gray-200 bg-white px-4 shadow-lg">
        {/* Home */}
        <button className="group flex flex-col items-center justify-center transition hover:scale-110">
          <Home className="h-6 w-6 text-black transition group-hover:text-black" />
          <span className="text-xs text-black group-hover:text-black">Home</span>
        </button>

        {/* Wallet */}
        <button className="group flex flex-col items-center justify-center transition hover:scale-110">
          <Wallet className="h-6 w-6 text-black transition group-hover:text-black" />
          <span className="text-xs text-black group-hover:text-black">Wallet</span>
        </button>

        {/* Add Button (Floating) */}
        <button className="group -mt-10 flex h-14 w-14 items-center justify-center rounded-full bg-black shadow-lg transition hover:scale-110 hover:bg-gray-900 focus:ring-4 focus:ring-gray-400">
          <Plus className="h-7 w-7 text-white" />
        </button>

        {/* Settings */}
        <button className="group flex flex-col items-center justify-center transition hover:scale-110">
          <Settings className="h-6 w-6 text-black transition group-hover:text-black" />
          <span className="text-xs text-black group-hover:text-black">Settings</span>
        </button>

        {/* Profile */}
        <button className="group flex flex-col items-center justify-center transition hover:scale-110">
          <User className="h-6 w-6 text-black transition group-hover:text-black" />
          <span className="text-xs text-black group-hover:text-black">Profile</span>
        </button>
      </div>
    </div>
  );
}
