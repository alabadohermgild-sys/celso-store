export const categories = [
  { id: 'all', name: 'All', emoji: '🛒' },
  { id: 'beverages', name: 'Drinks', emoji: '🥤' },
  { id: 'snacks', name: 'Snacks', emoji: '🍿' },
  { id: 'canned', name: 'Canned', emoji: '🥫' },
  { id: 'noodles', name: 'Noodles', emoji: '🍜' },
  { id: 'condiments', name: 'Sauces', emoji: '🧴' },
  { id: 'toiletries', name: 'Hygiene', emoji: '🧼' },
  { id: 'dairy', name: 'Dairy', emoji: '🥛' },
  { id: 'rice', name: 'Rice', emoji: '🍚' },
];

export const products = [
  // Beverages
  { id: 1, name: 'Coca-Cola 1.5L', category: 'beverages', price: 65, stock: 24, emoji: '🥤', description: 'Classic Coca-Cola in 1.5L bottle. Ice cold and refreshing!', tags: ['popular'], unit: 'per bottle' },
  { id: 2, name: 'Sprite 1L', category: 'beverages', price: 45, stock: 18, emoji: '🍋', description: 'Crisp lemon-lime Sprite soda', tags: [], unit: 'per bottle' },
  { id: 3, name: 'Royal TRU-ORANGE 1.5L', category: 'beverages', price: 58, stock: 12, emoji: '🍊', description: 'Filipino favorite orange soda', tags: ['popular'] },
  { id: 4, name: 'Milo 3-in-1 Sachet', category: 'beverages', price: 8, stock: 100, emoji: '☕', description: 'Chocolate malt drink sachet', tags: ['bestseller'], unit: 'per sachet' },
  { id: 5, name: 'C2 Green Tea 500mL', category: 'beverages', price: 22, stock: 30, emoji: '🍵', description: 'Ready-to-drink green tea', tags: [] },
  { id: 6, name: 'Zesto Orange 250mL', category: 'beverages', price: 12, stock: 50, emoji: '🧃', description: 'Juice drink tetra pack', tags: [] },
  { id: 7, name: 'Red Horse Beer 1L', category: 'beverages', price: 85, stock: 24, emoji: '🍺', description: 'Strong beer, 6.9% alcohol', tags: [] },
  { id: 8, name: 'Absolute Distilled Water 500mL', category: 'beverages', price: 18, stock: 36, emoji: '💧', description: 'Pure distilled drinking water', tags: [] },

  // Snacks
  { id: 9, name: 'Chippy Chili & Cheese 110g', category: 'snacks', price: 25, stock: 40, emoji: '🌽', description: 'Jack n Jill Chippy corn chips', tags: ['popular'] },
  { id: 10, name: 'Nova Country Cheddar 78g', category: 'snacks', price: 22, stock: 35, emoji: '🧀', description: 'Crunchy corn snack with cheese', tags: [] },
  { id: 11, name: 'Boy Bawang Cornick 90g', category: 'snacks', price: 20, stock: 45, emoji: '🌾', description: 'Crunchy garlic cornick snack', tags: ['bestseller'] },
  { id: 12, name: 'Nips Chocolate 40g', category: 'snacks', price: 15, stock: 60, emoji: '🍫', description: 'Small chocolate-coated snack', tags: [] },
  { id: 13, name: 'Skyflakes Crackers 250g', category: 'snacks', price: 28, stock: 25, emoji: '🍘', description: 'Classic Filipino crackers', tags: ['popular'] },
  { id: 14, name: 'Oishi Prawn Crackers 60g', category: 'snacks', price: 15, stock: 48, emoji: '🦐', description: 'Light and crunchy prawn crackers', tags: [] },

  // Canned
  { id: 15, name: 'Ligo Sardines in Tomato 155g', category: 'canned', price: 22, stock: 50, emoji: '🥫', description: 'Sardines in tomato sauce', tags: ['bestseller'] },
  { id: 16, name: 'Argentina Corned Beef 260g', category: 'canned', price: 75, stock: 20, emoji: '🥩', description: 'Premium corned beef', tags: ['popular'] },
  { id: 17, name: 'Century Tuna Flakes in Oil 180g', category: 'canned', price: 42, stock: 30, emoji: '🐟', description: 'Tuna flakes in vegetable oil', tags: [] },
  { id: 18, name: 'Del Monte Tomato Sauce 250g', category: 'canned', price: 18, stock: 35, emoji: '🍅', description: 'Pure tomato sauce for cooking', tags: [] },
  { id: 19, name: 'Palm Corned Tuna 180g', category: 'canned', price: 35, stock: 28, emoji: '🐠', description: 'Corned tuna in brine', tags: [] },

  // Noodles
  { id: 20, name: 'Lucky Me! Pancit Canton 80g', category: 'noodles', price: 12, stock: 80, emoji: '🍜', description: 'Stir-fried noodles, original flavor', tags: ['bestseller'], unit: 'per pack' },
  { id: 21, name: 'Nissin Cup Noodles Seafood 70g', category: 'noodles', price: 18, stock: 45, emoji: '🍣', description: 'Cup noodles with seafood flavor', tags: [] },
  { id: 22, name: 'Payless Pancit Canton 55g', category: 'noodles', price: 8, stock: 100, emoji: '🍝', description: 'Budget stir-fried noodles', tags: ['popular'] },
  { id: 23, name: 'Quickchow Instant Mami 55g', category: 'noodles', price: 10, stock: 70, emoji: '🍲', description: 'Instant chicken mami noodles', tags: [] },

  // Condiments
  { id: 24, name: 'Silver Swan Soy Sauce 350mL', category: 'condiments', price: 28, stock: 22, emoji: '🫙', description: 'All-purpose soy sauce', tags: [] },
  { id: 25, name: 'Datu Puti Vinegar 350mL', category: 'condiments', price: 22, stock: 20, emoji: '🧪', description: 'Coconut vinegar', tags: [] },
  { id: 26, name: 'UFC Banana Ketchup 320g', category: 'condiments', price: 32, stock: 25, emoji: '🍌', description: 'Filipino-style banana ketchup', tags: ['popular'] },
  { id: 27, name: 'Mang Tomas All-Purpose Sauce 550g', category: 'condiments', price: 45, stock: 18, emoji: '🥘', description: 'Classic lechon sauce', tags: ['bestseller'] },
  { id: 28, name: 'Knorr Sinigang Mix 20g', category: 'condiments', price: 8, stock: 60, emoji: '🌿', description: 'Tamarind soup base mix', tags: [] },

  // Toiletries
  { id: 29, name: 'Safeguard Bar Soap 115g', category: 'toiletries', price: 28, stock: 35, emoji: '🧼', description: 'Antibacterial bar soap', tags: ['popular'] },
  { id: 30, name: 'Head & Shoulders Shampoo Sachet', category: 'toiletries', price: 8, stock: 100, emoji: '🧴', description: 'Anti-dandruff shampoo sachet', tags: ['bestseller'] },
  { id: 31, name: 'Colgate Toothpaste 40g', category: 'toiletries', price: 22, stock: 40, emoji: '🪥', description: 'Cavity protection toothpaste', tags: [] },
  { id: 32, name: 'Ariel Powder Detergent 65g', category: 'toiletries', price: 12, stock: 55, emoji: '🫧', description: 'Laundry detergent sachet', tags: [] },

  // Dairy
  { id: 33, name: 'Bear Brand Milk 33g Sachet', category: 'dairy', price: 10, stock: 80, emoji: '🥛', description: 'Sterilized full cream milk', tags: ['popular'] },
  { id: 34, name: 'Alaska Evaporated Milk 370mL', category: 'dairy', price: 38, stock: 24, emoji: '🥛', description: 'Evaporated filled milk', tags: [] },
  { id: 35, name: 'Magnolia Cheese Singles 165g', category: 'dairy', price: 65, stock: 15, emoji: '🧀', description: '6 slices of cheddar cheese', tags: [] },
  { id: 36, name: 'Nestlé All Purpose Cream 250mL', category: 'dairy', price: 48, stock: 20, emoji: '🍦', description: 'All-purpose cooking cream', tags: [] },

  // Rice
  { id: 37, name: 'Sinandomeng Rice 1kg', category: 'rice', price: 55, stock: 50, emoji: '🍚', description: 'Premium white rice, 1 kilo', tags: ['popular'] },
  { id: 38, name: 'Jasmine Rice 1kg', category: 'rice', price: 65, stock: 30, emoji: '🌾', description: 'Fragrant jasmine rice, 1 kilo', tags: [] },
  { id: 39, name: 'Red Rice 1kg', category: 'rice', price: 75, stock: 20, emoji: '🍙', description: 'Nutritious red rice, 1 kilo', tags: [] },
];
