const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
dotenv.config();

const products = [
  {
    name: 'Ruby Classic Red Gown',
    description: 'Elegant red gown with custom embroidery and tailored fit. Perfect for parties and weddings.',
    price: 2499,
    sizes: ['S','M','L','XL'],
    colors: ['Red'],
    images: ['/uploads/dress_red.svg'],
    stock: 10,
    category: 'Gowns',
    isCustomizable: true
  },
  {
    name: 'Ruby Ocean Blue Dress',
    description: 'Flowy blue dress for daily wear and events. Customizable with prints.',
    price: 1999,
    sizes: ['S','M','L'],
    colors: ['Blue'],
    images: ['/uploads/dress_blue.svg'],
    stock: 15,
    category: 'Dresses',
    isCustomizable: true
  },
  {
    name: 'Ruby Emerald Green Kurta',
    description: 'Traditional kurta with modern cuts. Add initials or a short text.',
    price: 1599,
    sizes: ['M','L','XL'],
    colors: ['Green'],
    images: ['/uploads/dress_green.svg'],
    stock: 8,
    category: 'Ethnic',
    isCustomizable: true
  },
  {
    name: 'Ruby Noir Little Black Dress',
    description: 'Timeless black dress with optional custom lining.',
    price: 2999,
    sizes: ['S','M','L','XL'],
    colors: ['Black'],
    images: ['/uploads/dress_black.svg'],
    stock: 5,
    category: 'Evening',
    isCustomizable: true
  }
];

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected');
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log('Seeded products');
  process.exit();
}).catch(err => { console.error(err); process.exit(1); });
