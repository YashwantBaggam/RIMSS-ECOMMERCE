export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  badge?: 'new' | 'sale' | 'hot' | 'limited';
}

export const CATEGORIES = ['all', 'electronics', 'clothing', 'home', 'sports', 'books'];

const BASE_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium audio experience with 30-hour battery life and active noise cancellation. Perfect for work and travel.',
    price: 249.99,
    originalPrice: 329.99,
    image: 'https://picsum.photos/seed/headphones/800/600',
    images: ['https://picsum.photos/seed/headphones/800/600', 'https://picsum.photos/seed/headphones2/800/600'],
    category: 'electronics',
    tags: ['audio', 'wireless', 'noise-cancelling', 'headphones'],
    rating: 4.7,
    reviewCount: 2341,
    stock: 45,
    badge: 'sale',
  },
  {
    id: 'p2',
    name: 'Mechanical Gaming Keyboard',
    description: 'RGB backlit mechanical keyboard with Cherry MX switches. Tactile feedback for gaming and typing.',
    price: 129.99,
    image: 'https://picsum.photos/seed/keyboard/800/600',
    images: ['https://picsum.photos/seed/keyboard/800/600'],
    category: 'electronics',
    tags: ['keyboard', 'gaming', 'mechanical', 'rgb'],
    rating: 4.5,
    reviewCount: 876,
    stock: 23,
    badge: 'hot',
  },
  {
    id: 'p3',
    name: 'Ultrawide 4K Monitor',
    description: '34-inch curved ultrawide display with 144Hz refresh rate and HDR600 support.',
    price: 799.99,
    originalPrice: 999.99,
    image: 'https://picsum.photos/seed/monitor/800/600',
    images: ['https://picsum.photos/seed/monitor/800/600'],
    category: 'electronics',
    tags: ['monitor', '4k', 'ultrawide', 'gaming'],
    rating: 4.8,
    reviewCount: 1204,
    stock: 12,
    badge: 'sale',
  },
  {
    id: 'p4',
    name: 'Premium Running Shoes',
    description: 'Lightweight responsive foam with carbon fiber plate. Built for marathon performance.',
    price: 179.99,
    image: 'https://picsum.photos/seed/shoes/800/600',
    images: ['https://picsum.photos/seed/shoes/800/600'],
    category: 'sports',
    tags: ['running', 'shoes', 'marathon', 'carbon'],
    rating: 4.6,
    reviewCount: 543,
    stock: 67,
    badge: 'new',
  },
  {
    id: 'p5',
    name: 'Smart Home Security Camera',
    description: '4K outdoor security camera with night vision, two-way audio, and AI person detection.',
    price: 89.99,
    image: 'https://picsum.photos/seed/camera/800/600',
    images: ['https://picsum.photos/seed/camera/800/600'],
    category: 'electronics',
    tags: ['security', 'camera', 'smart-home', '4k'],
    rating: 4.3,
    reviewCount: 2109,
    stock: 89,
  },
  {
    id: 'p6',
    name: 'Ergonomic Office Chair',
    description: 'Lumbar support, adjustable armrests, and breathable mesh back. 8-hour comfort guarantee.',
    price: 449.99,
    originalPrice: 599.99,
    image: 'https://picsum.photos/seed/chair/800/600',
    images: ['https://picsum.photos/seed/chair/800/600'],
    category: 'home',
    tags: ['chair', 'ergonomic', 'office', 'lumbar'],
    rating: 4.9,
    reviewCount: 3892,
    stock: 34,
    badge: 'sale',
  },
  {
    id: 'p7',
    name: 'Merino Wool Sweater',
    description: 'Ultra-soft 100% Merino wool. Naturally temperature-regulating and odor-resistant.',
    price: 119.99,
    image: 'https://picsum.photos/seed/sweater/800/600',
    images: ['https://picsum.photos/seed/sweater/800/600'],
    category: 'clothing',
    tags: ['sweater', 'merino', 'wool', 'warm'],
    rating: 4.4,
    reviewCount: 234,
    stock: 56,
    badge: 'new',
  },
  {
    id: 'p8',
    name: 'Portable Power Bank 20000mAh',
    description: 'Charge 4 devices simultaneously with 65W fast charging. Fits in your pocket.',
    price: 59.99,
    image: 'https://picsum.photos/seed/powerbank/800/600',
    images: ['https://picsum.photos/seed/powerbank/800/600'],
    category: 'electronics',
    tags: ['power-bank', 'charging', 'portable', 'usb-c'],
    rating: 4.6,
    reviewCount: 1567,
    stock: 145,
  },
  {
    id: 'p9',
    name: 'Cast Iron Dutch Oven',
    description: 'Enameled cast iron with superior heat retention. From stovetop to oven to table.',
    price: 149.99,
    image: 'https://picsum.photos/seed/dutchoven/800/600',
    images: ['https://picsum.photos/seed/dutchoven/800/600'],
    category: 'home',
    tags: ['cooking', 'cast-iron', 'dutch-oven', 'kitchen'],
    rating: 4.8,
    reviewCount: 892,
    stock: 28,
  },
  {
    id: 'p10',
    name: 'Yoga Mat Pro',
    description: '6mm thick non-slip mat with alignment lines. Eco-friendly natural rubber.',
    price: 79.99,
    image: 'https://picsum.photos/seed/yogamat/800/600',
    images: ['https://picsum.photos/seed/yogamat/800/600'],
    category: 'sports',
    tags: ['yoga', 'mat', 'fitness', 'eco-friendly'],
    rating: 4.5,
    reviewCount: 1203,
    stock: 92,
    badge: 'hot',
  },
  {
    id: 'p11',
    name: 'The Art of System Design',
    description: 'A comprehensive guide to scalable systems, distributed computing, and architecture patterns.',
    price: 44.99,
    image: 'https://picsum.photos/seed/book1/800/600',
    images: ['https://picsum.photos/seed/book1/800/600'],
    category: 'books',
    tags: ['programming', 'system-design', 'architecture', 'tech'],
    rating: 4.9,
    reviewCount: 4231,
    stock: 200,
  },
  {
    id: 'p12',
    name: 'Smart Watch Series X',
    description: 'Health monitoring, GPS, 7-day battery, and always-on display. Water-resistant 50m.',
    price: 299.99,
    originalPrice: 399.99,
    image: 'https://picsum.photos/seed/watch/800/600',
    images: ['https://picsum.photos/seed/watch/800/600'],
    category: 'electronics',
    tags: ['smartwatch', 'health', 'gps', 'fitness'],
    rating: 4.7,
    reviewCount: 5678,
    stock: 67,
    badge: 'sale',
  },
  // ── Electronics extras ──
  {
    id: 'p13', name: 'USB-C Hub 12-in-1', description: 'Connects monitors, drives, SD cards, ethernet and more from a single cable.', price: 69.99, image: 'https://picsum.photos/seed/hub/800/600', images: ['https://picsum.photos/seed/hub/800/600'], category: 'electronics', tags: ['usb-c', 'hub', 'adapter', 'multiport'], rating: 4.4, reviewCount: 988, stock: 210,
  },
  {
    id: 'p14', name: 'Wireless Charging Pad', description: '15W fast wireless charger compatible with all Qi-enabled devices.', price: 29.99, image: 'https://picsum.photos/seed/charger/800/600', images: ['https://picsum.photos/seed/charger/800/600'], category: 'electronics', tags: ['wireless', 'charging', 'qi', 'fast-charge'], rating: 4.3, reviewCount: 2301, stock: 175, badge: 'hot',
  },
  {
    id: 'p15', name: 'Bluetooth Earbuds Pro', description: 'True wireless with active noise cancellation, 36-hour total battery, and IPX5 water resistance.', price: 149.99, originalPrice: 199.99, image: 'https://picsum.photos/seed/earbuds/800/600', images: ['https://picsum.photos/seed/earbuds/800/600'], category: 'electronics', tags: ['earbuds', 'bluetooth', 'anc', 'wireless'], rating: 4.6, reviewCount: 3120, stock: 88, badge: 'sale',
  },
  {
    id: 'p16', name: 'Mechanical Numpad', description: 'Compact TKL numpad with programmable macros and hot-swappable switches.', price: 49.99, image: 'https://picsum.photos/seed/numpad/800/600', images: ['https://picsum.photos/seed/numpad/800/600'], category: 'electronics', tags: ['keyboard', 'numpad', 'mechanical', 'macro'], rating: 4.2, reviewCount: 432, stock: 56,
  },
  {
    id: 'p17', name: '4K Webcam', description: 'Sony sensor, auto-framing, dual noise-cancelling mics — professional video calls.', price: 119.99, image: 'https://picsum.photos/seed/webcam/800/600', images: ['https://picsum.photos/seed/webcam/800/600'], category: 'electronics', tags: ['webcam', '4k', 'streaming', 'video'], rating: 4.5, reviewCount: 1876, stock: 43, badge: 'new',
  },
  {
    id: 'p18', name: 'NVMe SSD 2TB', description: '7400 MB/s read speeds in M.2 2280 form factor. For gaming and content creation.', price: 179.99, originalPrice: 229.99, image: 'https://picsum.photos/seed/ssd/800/600', images: ['https://picsum.photos/seed/ssd/800/600'], category: 'electronics', tags: ['ssd', 'storage', 'nvme', 'gaming'], rating: 4.8, reviewCount: 4532, stock: 120, badge: 'sale',
  },
  {
    id: 'p19', name: 'RGB LED Strip 5m', description: 'Individually addressable LEDs with Wi-Fi control. Cut-to-length, adhesive backing.', price: 34.99, image: 'https://picsum.photos/seed/ledstrip/800/600', images: ['https://picsum.photos/seed/ledstrip/800/600'], category: 'electronics', tags: ['led', 'rgb', 'smart-home', 'lighting'], rating: 4.1, reviewCount: 5432, stock: 320,
  },
  {
    id: 'p20', name: 'Portable Bluetooth Speaker', description: '360-degree sound, 24h battery, waterproof. Roll it in the mud, it won\'t care.', price: 89.99, image: 'https://picsum.photos/seed/speaker/800/600', images: ['https://picsum.photos/seed/speaker/800/600'], category: 'electronics', tags: ['speaker', 'bluetooth', 'waterproof', 'portable'], rating: 4.7, reviewCount: 6201, stock: 95,
  },
  // ── Clothing extras ──
  {
    id: 'p21', name: 'Slim-Fit Chinos', description: 'Stretch cotton chinos that go from desk to dinner without a wrinkle.', price: 79.99, image: 'https://picsum.photos/seed/chinos/800/600', images: ['https://picsum.photos/seed/chinos/800/600'], category: 'clothing', tags: ['chinos', 'trousers', 'slim', 'smart-casual'], rating: 4.3, reviewCount: 876, stock: 140,
  },
  {
    id: 'p22', name: 'Waterproof Hiking Jacket', description: '3-layer Gore-Tex shell with pit-zips and a helmet-compatible hood.', price: 249.99, originalPrice: 319.99, image: 'https://picsum.photos/seed/jacket/800/600', images: ['https://picsum.photos/seed/jacket/800/600'], category: 'clothing', tags: ['jacket', 'hiking', 'waterproof', 'gore-tex'], rating: 4.8, reviewCount: 1109, stock: 34, badge: 'sale',
  },
  {
    id: 'p23', name: 'Graphic Tee — Space Print', description: 'Heavyweight 240gsm cotton with a vintage-washed space illustration.', price: 34.99, image: 'https://picsum.photos/seed/tee/800/600', images: ['https://picsum.photos/seed/tee/800/600'], category: 'clothing', tags: ['t-shirt', 'graphic', 'cotton', 'casual'], rating: 4.2, reviewCount: 542, stock: 200, badge: 'new',
  },
  {
    id: 'p24', name: 'Compression Running Tights', description: 'Graduated compression for faster recovery and better circulation on long runs.', price: 64.99, image: 'https://picsum.photos/seed/tights/800/600', images: ['https://picsum.photos/seed/tights/800/600'], category: 'clothing', tags: ['running', 'tights', 'compression', 'performance'], rating: 4.5, reviewCount: 723, stock: 88,
  },
  {
    id: 'p25', name: 'Down Puffer Vest', description: '650-fill responsibly sourced down in a packable vest for layering season.', price: 99.99, image: 'https://picsum.photos/seed/vest/800/600', images: ['https://picsum.photos/seed/vest/800/600'], category: 'clothing', tags: ['vest', 'down', 'warm', 'layering'], rating: 4.4, reviewCount: 391, stock: 67,
  },
  {
    id: 'p26', name: 'Linen Summer Shirt', description: 'Breathable washed linen in relaxed fit — the only shirt you need for summer.', price: 69.99, image: 'https://picsum.photos/seed/linen/800/600', images: ['https://picsum.photos/seed/linen/800/600'], category: 'clothing', tags: ['shirt', 'linen', 'summer', 'breathable'], rating: 4.6, reviewCount: 815, stock: 110, badge: 'hot',
  },
  {
    id: 'p27', name: 'Wool Beanie', description: 'Double-knit Merino wool beanie with a ribbed cuff. One size fits all.', price: 29.99, image: 'https://picsum.photos/seed/beanie/800/600', images: ['https://picsum.photos/seed/beanie/800/600'], category: 'clothing', tags: ['beanie', 'wool', 'winter', 'hat'], rating: 4.7, reviewCount: 2031, stock: 350,
  },
  {
    id: 'p28', name: 'Leather Sneakers', description: 'Italian full-grain leather uppers on a vulcanised rubber sole. Minimal and timeless.', price: 189.99, image: 'https://picsum.photos/seed/sneakers/800/600', images: ['https://picsum.photos/seed/sneakers/800/600'], category: 'clothing', tags: ['sneakers', 'leather', 'shoes', 'minimal'], rating: 4.5, reviewCount: 1456, stock: 55,
  },
  // ── Home extras ──
  {
    id: 'p29', name: 'Bamboo Cutting Board Set', description: 'Three-piece set with juice groove, handles, and anti-slip feet.', price: 44.99, image: 'https://picsum.photos/seed/cuttingboard/800/600', images: ['https://picsum.photos/seed/cuttingboard/800/600'], category: 'home', tags: ['kitchen', 'bamboo', 'cutting-board', 'cooking'], rating: 4.6, reviewCount: 2310, stock: 185,
  },
  {
    id: 'p30', name: 'Smart LED Bulb 4-Pack', description: 'Tunable white and color, voice-assistant compatible, 25,000-hour lifespan.', price: 39.99, image: 'https://picsum.photos/seed/bulbs/800/600', images: ['https://picsum.photos/seed/bulbs/800/600'], category: 'home', tags: ['smart-home', 'bulb', 'led', 'lighting'], rating: 4.4, reviewCount: 3420, stock: 260,
  },
  {
    id: 'p31', name: 'French Press Coffee Maker', description: 'Double-wall stainless steel, 1L capacity, stays hot for 2 hours.', price: 54.99, image: 'https://picsum.photos/seed/frenchpress/800/600', images: ['https://picsum.photos/seed/frenchpress/800/600'], category: 'home', tags: ['coffee', 'french-press', 'kitchen', 'brewing'], rating: 4.7, reviewCount: 4102, stock: 78,
  },
  {
    id: 'p32', name: 'Scented Soy Candle Set', description: 'Six hand-poured soy wax candles in seasonal scents. 45h burn time each.', price: 49.99, image: 'https://picsum.photos/seed/candles/800/600', images: ['https://picsum.photos/seed/candles/800/600'], category: 'home', tags: ['candles', 'scented', 'soy', 'home-decor'], rating: 4.8, reviewCount: 1890, stock: 130, badge: 'hot',
  },
  {
    id: 'p33', name: 'Robot Vacuum Cleaner', description: 'LiDAR mapping, auto-empty dock, 120-min runtime. Works on carpet and hard floors.', price: 399.99, originalPrice: 499.99, image: 'https://picsum.photos/seed/vacuum/800/600', images: ['https://picsum.photos/seed/vacuum/800/600'], category: 'home', tags: ['vacuum', 'robot', 'cleaning', 'smart-home'], rating: 4.5, reviewCount: 7231, stock: 42, badge: 'sale',
  },
  {
    id: 'p34', name: 'Linen Duvet Cover Set', description: 'Stone-washed linen duvet cover + 2 pillowcases. Gets softer with every wash.', price: 139.99, image: 'https://picsum.photos/seed/duvet/800/600', images: ['https://picsum.photos/seed/duvet/800/600'], category: 'home', tags: ['bedding', 'linen', 'duvet', 'bedroom'], rating: 4.9, reviewCount: 3124, stock: 67,
  },
  {
    id: 'p35', name: 'Air Purifier HEPA', description: 'True HEPA + activated carbon filter. Cleans 500 sq ft in 30 minutes.', price: 199.99, image: 'https://picsum.photos/seed/airpurifier/800/600', images: ['https://picsum.photos/seed/airpurifier/800/600'], category: 'home', tags: ['air-purifier', 'hepa', 'allergies', 'clean-air'], rating: 4.6, reviewCount: 2876, stock: 38, badge: 'new',
  },
  {
    id: 'p36', name: 'Ceramic Pour-Over Set', description: 'Matte ceramic dripper with matching carafe and filters. Pour-over perfected.', price: 79.99, image: 'https://picsum.photos/seed/pourover/800/600', images: ['https://picsum.photos/seed/pourover/800/600'], category: 'home', tags: ['coffee', 'pour-over', 'ceramic', 'brewing'], rating: 4.7, reviewCount: 1023, stock: 55,
  },
  // ── Sports extras ──
  {
    id: 'p37', name: 'Adjustable Dumbbells 40kg', description: 'Replace 12 pairs of dumbbells. Dial-select weight in 2.5kg increments.', price: 329.99, originalPrice: 399.99, image: 'https://picsum.photos/seed/dumbbells/800/600', images: ['https://picsum.photos/seed/dumbbells/800/600'], category: 'sports', tags: ['dumbbells', 'weights', 'home-gym', 'strength'], rating: 4.8, reviewCount: 4532, stock: 28, badge: 'sale',
  },
  {
    id: 'p38', name: 'Pull-Up Bar', description: 'Door-mounted multi-grip pull-up bar. No screws, 150kg capacity.', price: 44.99, image: 'https://picsum.photos/seed/pullupbar/800/600', images: ['https://picsum.photos/seed/pullupbar/800/600'], category: 'sports', tags: ['pull-up', 'bar', 'home-gym', 'calisthenics'], rating: 4.4, reviewCount: 6103, stock: 156,
  },
  {
    id: 'p39', name: 'Foam Roller Deep Tissue', description: 'High-density EVA foam with ridges for trigger-point release.', price: 34.99, image: 'https://picsum.photos/seed/foamroller/800/600', images: ['https://picsum.photos/seed/foamroller/800/600'], category: 'sports', tags: ['recovery', 'foam-roller', 'massage', 'fitness'], rating: 4.5, reviewCount: 3201, stock: 210,
  },
  {
    id: 'p40', name: 'Trail Running Vest', description: '10L hydration vest with 2 soft flasks, 12 pockets, and reflective strips.', price: 119.99, image: 'https://picsum.photos/seed/runvest/800/600', images: ['https://picsum.photos/seed/runvest/800/600'], category: 'sports', tags: ['running', 'vest', 'trail', 'hydration'], rating: 4.6, reviewCount: 987, stock: 44,
  },
  {
    id: 'p41', name: 'Resistance Bands Set', description: '5 bands from 5–50kg resistance, with handles, ankle straps, and door anchor.', price: 29.99, image: 'https://picsum.photos/seed/bands/800/600', images: ['https://picsum.photos/seed/bands/800/600'], category: 'sports', tags: ['resistance-bands', 'home-gym', 'stretching', 'fitness'], rating: 4.3, reviewCount: 8432, stock: 430,
  },
  {
    id: 'p42', name: 'Road Cycling Helmet', description: 'In-mold polycarbonate shell with MIPS rotational protection. 280g.', price: 149.99, image: 'https://picsum.photos/seed/helmet/800/600', images: ['https://picsum.photos/seed/helmet/800/600'], category: 'sports', tags: ['cycling', 'helmet', 'safety', 'road'], rating: 4.7, reviewCount: 1567, stock: 72,
  },
  {
    id: 'p43', name: 'Jump Rope Speed Cable', description: 'Ball-bearing handles with a 3mm steel cable. Adjustable length.', price: 19.99, image: 'https://picsum.photos/seed/jumprope/800/600', images: ['https://picsum.photos/seed/jumprope/800/600'], category: 'sports', tags: ['jump-rope', 'cardio', 'boxing', 'fitness'], rating: 4.5, reviewCount: 5678, stock: 560,
  },
  {
    id: 'p44', name: 'Swim Goggles Pro', description: 'Anti-fog, UV-blocking, hydrodynamic design for lap swimmers.', price: 39.99, image: 'https://picsum.photos/seed/goggles/800/600', images: ['https://picsum.photos/seed/goggles/800/600'], category: 'sports', tags: ['swimming', 'goggles', 'anti-fog', 'pool'], rating: 4.4, reviewCount: 2310, stock: 180,
  },
  // ── Books extras ──
  {
    id: 'p45', name: 'Clean Code', description: 'Robert C. Martin\'s seminal guide to writing readable, maintainable software.', price: 39.99, image: 'https://picsum.photos/seed/cleancode/800/600', images: ['https://picsum.photos/seed/cleancode/800/600'], category: 'books', tags: ['programming', 'clean-code', 'software', 'engineering'], rating: 4.8, reviewCount: 12031, stock: 500,
  },
  {
    id: 'p46', name: 'Designing Data-Intensive Applications', description: 'Deep dive into distributed systems, data models, and replication strategies.', price: 54.99, image: 'https://picsum.photos/seed/ddia/800/600', images: ['https://picsum.photos/seed/ddia/800/600'], category: 'books', tags: ['programming', 'databases', 'distributed-systems', 'backend'], rating: 4.9, reviewCount: 9821, stock: 200,
  },
  {
    id: 'p47', name: 'Atomic Habits', description: 'James Clear on how tiny 1% improvements compound into remarkable results.', price: 27.99, image: 'https://picsum.photos/seed/atomichabits/800/600', images: ['https://picsum.photos/seed/atomichabits/800/600'], category: 'books', tags: ['self-help', 'habits', 'productivity', 'psychology'], rating: 4.7, reviewCount: 34201, stock: 800, badge: 'hot',
  },
  {
    id: 'p48', name: 'The Pragmatic Programmer', description: '20th anniversary edition. Timeless advice for software craftspeople.', price: 44.99, image: 'https://picsum.photos/seed/pragprog/800/600', images: ['https://picsum.photos/seed/pragprog/800/600'], category: 'books', tags: ['programming', 'software', 'career', 'engineering'], rating: 4.8, reviewCount: 7654, stock: 300,
  },
];

// Generate additional products to reach ~96 total for lazy-loading demo
const EXTRA_TEMPLATES = [
  { category: 'electronics', names: ['Mechanical Keyboard TKL', 'Gaming Mouse 25K DPI', 'Monitor Arm Dual', 'Cable Management Kit', 'Smart Plug 4-Pack', 'Laptop Stand Aluminum', 'Screen Cleaning Kit', 'Anti-Glare Screen Protector', 'USB-C Dock Pro', 'Mini PC Stick'], tags: ['tech', 'computers', 'accessories'], price: [29, 249], seed: 'elec' },
  { category: 'clothing', names: ['Merino Base Layer', 'Fleece Midlayer Hoodie', 'Packable Rain Poncho', 'Hiking Socks 3-Pack', 'Thermal Gloves', 'Sun Hat Wide Brim', 'Workout Shorts 5"', 'Quarter-Zip Pullover', 'Canvas Tote Bag', 'Crossbody Bag'], tags: ['apparel', 'fashion', 'style'], price: [19, 149], seed: 'cloth' },
  { category: 'home', names: ['Non-Stick Pan Set', 'Spice Rack Organiser', 'Shower Curtain Liner', 'Bath Towel Set', 'Storage Ottoman', 'Desk Lamp LED', 'Planter Set Terracotta', 'Doormat Outdoor', 'Kitchen Scale Digital', 'Wine Rack Wall-Mount'], tags: ['home-goods', 'kitchen', 'decor'], price: [19, 179], seed: 'home' },
  { category: 'sports', names: ['Tennis Racket Pro', 'Basketball Outdoor', 'Yoga Block Set', 'Weight Belt Leather', 'Gym Bag 40L', 'Water Bottle 1L', 'Knee Sleeves Pair', 'Skipping Mat', 'Agility Ladder', 'Sports Sunglasses'], tags: ['fitness', 'outdoor', 'sport'], price: [15, 129], seed: 'sport' },
  { category: 'books', names: ['Deep Work', 'Zero to One', 'Thinking Fast and Slow', 'The Phoenix Project', 'Refactoring (2nd Ed)', 'Domain-Driven Design', 'Staff Engineer', 'The Staff Engineer Path', 'Engineering Management', 'Shape Up'], tags: ['books', 'learning', 'reading'], price: [24, 59], seed: 'book' },
];

let _extraId = 49;
const GENERATED: Product[] = [];

for (const tmpl of EXTRA_TEMPLATES) {
  tmpl.names.forEach((name, i) => {
    const [minP, maxP] = tmpl.price;
    const price = Math.round((minP + (maxP - minP) * ((i * 7 + 3) % 10) / 10) * 100) / 100 || minP;
    GENERATED.push({
      id: `p${_extraId++}`,
      name,
      description: `${name} — premium quality, built to last. Trusted by thousands of customers.`,
      price,
      image: `https://picsum.photos/seed/${tmpl.seed}${i + 1}/800/600`,
      images: [`https://picsum.photos/seed/${tmpl.seed}${i + 1}/800/600`],
      category: tmpl.category,
      tags: [...tmpl.tags, name.toLowerCase().replace(/\s+/g, '-')],
      rating: Math.round((3.8 + ((i * 13 + 7) % 12) / 10) * 10) / 10,
      reviewCount: 50 + ((i * 317 + 41) % 4000),
      stock: 10 + ((i * 53 + 17) % 200),
      badge: i % 7 === 0 ? 'new' : i % 11 === 0 ? 'sale' : undefined,
    });
  });
}

export const MOCK_PRODUCTS: Product[] = [...BASE_PRODUCTS, ...GENERATED];
