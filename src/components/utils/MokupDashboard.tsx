export default function DashboardMockup() {
  return (
    <section className="relative mx-auto h-[500px] w-70 rounded-[3rem] bg-black p-2 shadow-2xl">
      <div className="flex min-h-screen flex-col bg-gray-50">
        {/* Header */}
        <header className="flex items-center justify-between bg-white px-4 py-3">
          <span className="text-sm font-semibold text-gray-800">https://darneh.matager.store</span>
          <div className="flex items-center gap-3">
            <button className="rounded-full bg-gray-100 p-2">
              <svg
                className="h-5 w-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 6V4m0 16v-2m8-6h2M4 12H2m16.95 7.05l1.414 1.414M4.636 4.636L3.222 3.222m16.97 0l-1.414 1.414M4.636 19.364l-1.414 1.414" />
              </svg>
            </button>
            <button className="rounded-full bg-gray-100 p-2">
              <svg
                className="h-5 w-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <img src="/avatar.png" className="h-8 w-8 rounded-full" alt="user" />
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 p-4">
          <div className="rounded-lg bg-black p-3 text-white shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs">الزيارات</span>
              <svg className="h-5 w-5 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 3a7 7 0 017 7v1h-2v-1a5 5 0 00-10 0v1H3v-1a7 7 0 017-7z" />
                <path d="M5 13h10l1.5 5h-13L5 13z" />
              </svg>
            </div>
            <p className="mt-2 text-2xl font-bold">39</p>
            <p className="text-xs text-green-400">+0.03%</p>
          </div>

          <div className="rounded-lg border bg-white p-3 shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs">المنتجات</span>
              <svg
                className="h-5 w-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M3 7h18M3 12h18M3 17h18" />
              </svg>
            </div>
            <p className="mt-2 text-2xl font-bold">1</p>
            <p className="text-xs text-green-500">+11.01%</p>
          </div>

          <div className="rounded-lg border bg-white p-3 shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs">الطلبات</span>
              <svg
                className="h-5 w-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M3 3h18v18H3V3z" />
              </svg>
            </div>
            <p className="mt-2 text-2xl font-bold">0</p>
            <p className="text-xs text-green-500">+2.10%</p>
          </div>

          <div className="rounded-lg border bg-white p-3 shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs">العوائد</span>
              <svg
                className="h-5 w-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 8c-1.657 0-3 1.567-3 3.5S10.343 15 12 15s3-1.567 3-3.5S13.657 8 12 8z" />
              </svg>
            </div>
            <p className="mt-2 text-2xl font-bold">0</p>
            <p className="text-xs text-green-500">+0.09%</p>
          </div>
        </div>

        {/* Monthly Goal */}
        <div className="mx-4 mt-2 rounded-xl border bg-white p-4 shadow">
          <p className="mb-2 text-sm font-semibold text-gray-700">الهدف الشهري</p>
          <div className="flex flex-col items-center">
            <div className="relative h-24 w-24">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeDasharray="0, 100"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                0%
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-600">تم الوصول إلى 0 طلبات هذا الشهر من أصل 9</p>
          </div>
        </div>

        {/* Bottom Navigation */}
        <nav className="mt-auto flex h-14 w-full items-center justify-around rounded-t-3xl border-t bg-white">
          <button className="flex flex-col items-center text-green-600">
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 12l9-9 9 9-1.5 1.5L12 5l-7.5 7.5z" />
              <path d="M12 22V12h8v10z" />
            </svg>
          </button>
          <button className="flex flex-col items-center text-gray-500">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          <button className="flex flex-col items-center text-gray-500">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h18v18H3z" />
            </svg>
          </button>
          <button className="flex flex-col items-center text-gray-500">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4" />
              <path d="M6 20c0-3 12-3 12 0" />
            </svg>
          </button>
        </nav>
      </div>
    </section>
  );
}
