const transactions = [
  {
    id: 1,
    cashier: "juan_dela_cruz",
    date: "2025-01-15T10:30:00",
    status: "completed",
    discount: "Senior Citizen",
    total_amount: 350.00,
    items: [
      { product: "Rice (5kg)", qty: 1, price: 280.00 },
      { product: "Sardines",   qty: 2, price: 35.00  },
    ],
  },
  {
    id: 2,
    cashier: "maria_santos",
    date: "2025-01-15T11:00:00",
    status: "cancelled",
    discount: "None",
    total_amount: 0,
    items: [],
  },
  {
    id: 3,
    cashier: "juan_dela_cruz",
    date: "2025-01-16T09:15:00",
    status: "completed",
    discount: "PWD",
    total_amount: 540.00,
    items: [
      { product: "Cooking Oil", qty: 1, price: 180.00 },
      { product: "Sugar (1kg)",  qty: 2, price: 80.00  },
      { product: "Detergent",    qty: 2, price: 120.00 },
    ],
  },
];

export default transactions;