import { useState, useEffect, useMemo } from "react";
import "./App.css";

const formatNumber = (number) =>
  new Intl.NumberFormat("en", { minimumFractionDigits: 2 }).format(number);

function App() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch and process product data from all three branches
    const fetchData = async () => {
      try {
        // Load JSON data from three static endpoints in parallel
        const [branch1, branch2, branch3] = await Promise.all([
          fetch("/api/branch1.json").then((res) => res.json()),
          fetch("/api/branch2.json").then((res) => res.json()),
          fetch("/api/branch3.json").then((res) => res.json()),
        ]);

        // Map to hold aggregated revenue per product name
        const productMap = new Map();

        // Combine all products and calculate revenue per product
        [...branch1.products, ...branch2.products, ...branch3.products].forEach(
          (product) => {
            const revenue = Number(
              (product.unitPrice * product.sold).toFixed(2)
            );
            // Accumulate revenue if product already exists
            if (productMap.has(product.name)) {
              const currentRevenue = productMap.get(product.name);
              productMap.set(
                product.name,
                Number((currentRevenue + revenue).toFixed(2))
              );
            } else {
              productMap.set(product.name, revenue);
            }
          }
        );

        // Convert Map to array of objects and sort alphabetically by name
        const sortedProducts = Array.from(productMap.entries())
          .map(([name, revenue]) => ({ name, revenue }))
          .sort((a, b) => a.name.localeCompare(b.name));

        // Store processed data in state and stop loading
        setProducts(sortedProducts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Using useMemo to avoid recalculating on every keystroke
  // Memoized filter: returns products whose names match the search term (case-insensitive)
  // Note: If this gets large in future, consider debounce for search
  const filteredProducts = useMemo(
    () =>
      products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [products, searchTerm]
  );

  // Memoized sum of revenues for currently displayed (filtered) products
  const totalRevenue = useMemo(
    () => filteredProducts.reduce((sum, p) => sum + p.revenue, 0),
    [filteredProducts]
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      <div className="search-container">
        <label htmlFor="search">Search Products</label>
        <input
          id="search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter products..."
          aria-label="Search products by name"
          role="searchbox"
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length === 0 ? (
            <tr>
              <td colSpan="2">No products found.</td>
            </tr>
          ) : (
            filteredProducts.map((product) => (
              <tr key={product.name}>
                <td>{product.name}</td>
                <td>{formatNumber(product.revenue)}</td>
              </tr>
            ))
          )}
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td>{formatNumber(totalRevenue)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default App;
