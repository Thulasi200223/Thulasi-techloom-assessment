const products = [

/* ================= 1. BEVERAGES ================= */
{ id: 1, name: "Ice Cream Soda", price: 180, category: "beverages", brand: "kist", image: "/images/bev1.jpg" },
{ id: 2, name: "Coca Cola", price: 320, category: "beverages", brand: "kist", image: "/images/bev2.jpg" },
{ id: 3, name: "Sprite", price: 300, category: "beverages", brand: "kist", image: "/images/bev3.jpg" },
{ id: 4, name: "Fanta", price: 280, category: "beverages", brand: "kist", image: "/images/bev4.jpg" },
{ id: 5, name: "Cream Soda", price: 200, category: "beverages", brand: "kist", image: "/images/bev5.jpg" },
{ id: 6, name: "Orange Juice", price: 250, category: "beverages", brand: "kist", image: "/images/bev6.jpg" },

/* ================= 2. BAKERY ================= */
{ id: 7, name: "Maliban Marie", price: 120, category: "bakery", brand: "maliban", image: "/images/bak1.jpg" },
{ id: 8, name: "Cheesebits", price: 150, category: "bakery", brand: "maliban", image: "/images/bak2.jpg" },
{ id: 9, name: "Little Lion Cracker", price: 140, category: "bakery", brand: "maliban", image: "/images/bak3.jpg" },
{ id: 10, name: "Chocolate Biscuit", price: 160, category: "bakery", brand: "maliban", image: "/images/bak4.jpg" },
{ id: 11, name: "Butter Cookies", price: 220, category: "bakery", brand: "maliban", image: "/images/bak5.jpg" },
{ id: 12, name: "Cream Cracker", price: 180, category: "bakery", brand: "maliban", image: "/images/bak6.jpg" },

/* ================= 3. CHRISTMAS ================= */
{ id: 13, name: "Christmas Cake", price: 1800, category: "christmas", brand: "munchee", image: "/images/x1.jpg" },
{ id: 14, name: "Plum Cake", price: 1500, category: "christmas", brand: "munchee", image: "/images/x2.jpg" },
{ id: 15, name: "Gift Biscuit Box", price: 1200, category: "christmas", brand: "munchee", image: "/images/x3.jpg" },
{ id: 16, name: "Chocolate Gift Pack", price: 900, category: "christmas", brand: "munchee", image: "/images/x4.jpg" },
{ id: 17, name: "Xmas Cookies", price: 750, category: "christmas", brand: "munchee", image: "/images/x5.jpg" },
{ id: 18, name: "Christmas Chocolates", price: 1100, category: "christmas", brand: "munchee", image: "/images/x6.jpg" },

/* ================= 4. COFFEE ================= */
{ id: 19, name: "Nescafe Classic", price: 950, category: "coffee", brand: "ceylon1844", image: "/images/c1.jpg" },
{ id: 20, name: "Bru Coffee", price: 820, category: "coffee", brand: "ceylon1844", image: "/images/c2.jpg" },
{ id: 21, name: "Green Tea", price: 600, category: "coffee", brand: "ceylon1844", image: "/images/c3.jpg" },
{ id: 22, name: "Tea Bags", price: 560, category: "coffee", brand: "ceylon1844", image: "/images/c4.jpg" },
{ id: 23, name: "Milo", price: 980, category: "coffee", brand: "ceylon1844", image: "/images/c5.jpg" },
{ id: 24, name: "Hot Chocolate", price: 1050, category: "coffee", brand: "ceylon1844", image: "/images/c6.jpg" },

/* ================= 5. DAILY DEALS ================= */
{ id: 25, name: "Rice 5kg", price: 1500, category: "deals", brand: "magic", image: "/images/d1.jpg" },
{ id: 26, name: "Sugar 1kg", price: 390, category: "deals", brand: "magic", image: "/images/d2.jpg" },
{ id: 27, name: "Dhal 1kg", price: 620, category: "deals", brand: "magic", image: "/images/d3.jpg" },
{ id: 28, name: "Cooking Oil", price: 780, category: "deals", brand: "magic", image: "/images/d4.jpg" },
{ id: 29, name: "Flour 1kg", price: 420, category: "deals", brand: "magic", image: "/images/d5.jpg" },
{ id: 30, name: "Onion Pack", price: 360, category: "deals", brand: "magic", image: "/images/d6.jpg" },

/* ================= 6. DAIRY ================= */
{ id: 31, name: "Anchor Milk", price: 850, category: "dairy", brand: "kotmale", image: "/images/da1.jpg" },
{ id: 32, name: "Fresh Milk", price: 420, category: "dairy", brand: "kotmale", image: "/images/da2.jpg" },
{ id: 33, name: "Butter", price: 760, category: "dairy", brand: "kotmale", image: "/images/da3.jpg" },
{ id: 34, name: "Cheese", price: 980, category: "dairy", brand: "kotmale", image: "/images/da4.jpg" },
{ id: 35, name: "Yoghurt", price: 90, category: "dairy", brand: "kotmale", image: "/images/da5.jpg" },
{ id: 36, name: "Curd", price: 120, category: "dairy", brand: "kotmale", image: "/images/da6.jpg" },


/* ================= 8. FRESH ================= */
{ id: 43, name: "Carrot 1kg", price: 200, category: "fresh", brand: "ceylon1844", image: "/images/f1.jpg" },
{ id: 44, name: "Tomato 1kg", price: 180, category: "fresh", brand: "ceylon1844", image: "/images/f2.jpg" },
{ id: 45, name: "Potato 1kg", price: 160, category: "fresh", brand: "ceylon1844", image: "/images/f3.jpg" },
{ id: 46, name: "Onion 1kg", price: 190, category: "fresh", brand: "ceylon1844", image: "/images/f4.jpg" },
{ id: 47, name: "Cabbage", price: 240, category: "fresh", brand: "ceylon1844", image: "/images/f5.jpg" },
{ id: 48, name: "Beans", price: 260, category: "fresh", brand: "ceylon1844", image: "/images/f6.jpg" },

/* ================= 9. FROZEN ================= */
{ id: 49, name: "Vanilla Ice Cream", price: 1280, category: "frozen", brand: "kist", image: "/images/fr1.jpg" },
{ id: 50, name: "Chocolate Ice Cream", price: 1480, category: "frozen", brand: "kist", image: "/images/fr2.jpg" },
{ id: 51, name: "Strawberry Ice Cream", price: 1380, category: "frozen", brand: "kist", image: "/images/fr3.jpg" },
{ id: 52, name: "Frozen Nuggets", price: 1750, category: "frozen", brand: "kist", image: "/images/fr4.jpg" },
{ id: 53, name: "Frozen Sausage", price: 1650, category: "frozen", brand: "kist", image: "/images/fr5.jpg" },
{ id: 54, name: "Frozen Fries", price: 1450, category: "frozen", brand: "kist", image: "/images/fr6.jpg" },

/* ================= 10. GROCERY ================= */
{ id: 55, name: "Rice 10kg", price: 2800, category: "grocery", brand: "magic", image: "/images/g1.jpg" },
{ id: 56, name: "Sugar 2kg", price: 780, category: "grocery", brand: "magic", image: "/images/g2.jpg" },
{ id: 57, name: "Salt Pack", price: 120, category: "grocery", brand: "magic", image: "/images/g3.jpg" },
{ id: 58, name: "Chilli Powder", price: 560, category: "grocery", brand: "magic", image: "/images/g4.jpg" },
{ id: 59, name: "Curry Powder", price: 480, category: "grocery", brand: "magic", image: "/images/g5.jpg" },
{ id: 60, name: "Pepper Powder", price: 620, category: "grocery", brand: "magic", image: "/images/g6.jpg" },

/* ================= 11. BEAUTY ================= */
{ id: 61, name: "Face Cream", price: 650, category: "beauty", brand: "babycheramy", image: "/images/b1.jpg" },
{ id: 62, name: "Face Wash", price: 540, category: "beauty", brand: "babycheramy", image: "/images/b2.jpg" },
{ id: 63, name: "Perfume", price: 2200, category: "beauty", brand: "babycheramy", image: "/images/b3.jpg" },
{ id: 64, name: "Body Lotion", price: 890, category: "beauty", brand: "babycheramy", image: "/images/b4.jpg" },
{ id: 65, name: "Shampoo", price: 720, category: "beauty", brand: "babycheramy", image: "/images/b5.jpg" },
{ id: 66, name: "Conditioner", price: 780, category: "beauty", brand: "babycheramy", image: "/images/b6.jpg" },

/* ================= 12. HOUSEHOLD ================= */
{ id: 67, name: "Dish Wash", price: 480, category: "household", brand: "surfexcel", image: "/images/h1.jpg" },
{ id: 68, name: "Floor Cleaner", price: 650, category: "household", brand: "surfexcel", image: "/images/h2.jpg" },
{ id: 69, name: "Toilet Cleaner", price: 540, category: "household", brand: "surfexcel", image: "/images/h3.jpg" },
{ id: 70, name: "Detergent Powder", price: 890, category: "household", brand: "surfexcel", image: "/images/h4.jpg" },
{ id: 71, name: "Garbage Bags", price: 320, category: "household", brand: "surfexcel", image: "/images/h5.jpg" },
{ id: 72, name: "Scrub Pad", price: 180, category: "household", brand: "surfexcel", image: "/images/h6.jpg" },


/* ================= 14. BABY ================= */
{ id: 79, name: "Baby Diapers", price: 2100, category: "baby", brand: "babycheramy", image: "/images/ba1.jpg" },
{ id: 80, name: "Baby Soap", price: 320, category: "baby", brand: "babycheramy", image: "/images/ba2.jpg" },
{ id: 81, name: "Baby Shampoo", price: 580, category: "baby", brand: "babycheramy", image: "/images/ba3.jpg" },
{ id: 82, name: "Baby Lotion", price: 760, category: "baby", brand: "babycheramy", image: "/images/ba4.jpg" },
{ id: 83, name: "Baby Powder", price: 450, category: "baby", brand: "babycheramy", image: "/images/ba5.jpg" },
{ id: 84, name: "Baby Wipes", price: 390, category: "baby", brand: "babycheramy", image: "/images/ba6.jpg" },

];

export default products;
