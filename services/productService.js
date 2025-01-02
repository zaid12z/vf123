// Product service
const products = [
  {
    id: 1,
    name: 'Project Management System',
    price: 299,
    description: 'Complete system for project and team management',
    image: '/images/project-management.jpg',
    category: 'web',
    features: ['Task Management', 'Time Tracking', 'Advanced Reports']
  },
  {
    id: 2,
    name: 'Smart Accounting System',
    price: 199,
    description: 'Comprehensive accounting software for businesses',
    image: '/images/accounting.jpg',
    category: 'desktop',
    features: ['E-Invoicing', 'Financial Reports', 'Inventory Management']
  },
  {
    id: 3,
    name: 'E-Learning Platform',
    price: 399,
    description: 'Complete educational platform solution',
    image: '/images/elearning.jpg',
    category: 'web',
    features: ['Interactive Courses', 'Certified Programs', 'Mobile App']
  }
];

function getProducts() {
  return products;
}

function getProductsByCategory(category) {
  return products.filter(p => p.category === category);
}

module.exports = {
  getProducts,
  getProductsByCategory
};