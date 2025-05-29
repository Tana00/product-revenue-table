# Supermarket Revenue Aggregator

This is a React-based component that aggregates product sales from three supermarket branches and displays the data in a searchable, sortable table. Each row shows a product and its total revenue (across branches), and there's a total sum at the bottom that updates as you filter.

## Features

- Fetches data from three static JSON files: `branch1.json`, `branch2.json`, and `branch3.json`
- Aggregates revenue per product across all branches
- Sorts the table alphabetically by product name
- Provides case-insensitive search functionality to filter the list
- Calculates total revenue dynamically based on the filtered view
- Uses consistent number formatting with the provided `formatNumber` function
- Ensures search input is inline with its label and screen-reader friendly
- Passes all provided tests

## Getting Started

```bash
npm install     # Install dependencies
npm test        # Run all tests in watch mode
npm start       # Start the app at http://localhost:3000
```

## Technical Details

### Data Management

- Data is fetched from static JSON files (no backend required)
- The table only renders after all data is loaded
- Designed for modern browsers (tested in latest Chrome)

### Performance Optimizations

- Uses `useMemo` to memoize filtered products and total revenue
- Branch data is fetched once using `useEffect` and aggregated efficiently

### Accessibility Features

- Search input is linked to its label using `htmlFor`
- Added `aria-label` and `role="searchbox"` for assistive technologies
- Displays a message when no products match the filter
