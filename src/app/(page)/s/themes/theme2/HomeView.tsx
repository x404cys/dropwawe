export default function HomeView() {
  return (
    <div className="space-y-6">
      <h2 className="text-4xl font-bold text-purple-600">Welcome to Theme 2</h2>
      <p className="text-lg text-gray-600">Premium shopping experience</p>
      <div className="grid grid-cols-4 gap-6">
        <div className="rounded-lg bg-white p-6 shadow transition hover:shadow-lg">
          <h3 className="text-lg font-bold">Product 1</h3>
          <p className="text-2xl font-bold text-purple-600">$99.99</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow transition hover:shadow-lg">
          <h3 className="text-lg font-bold">Product 2</h3>
          <p className="text-2xl font-bold text-purple-600">$149.99</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow transition hover:shadow-lg">
          <h3 className="text-lg font-bold">Product 3</h3>
          <p className="text-2xl font-bold text-purple-600">$199.99</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow transition hover:shadow-lg">
          <h3 className="text-lg font-bold">Product 4</h3>
          <p className="text-2xl font-bold text-purple-600">$249.99</p>
        </div>
      </div>
    </div>
  );
}
