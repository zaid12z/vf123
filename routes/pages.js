const express = require('express');
const router = express.Router();
const productService = require('../services/product.service');

router.get('/', async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.render('pages/home', { 
      title: 'Home',
      products: products.slice(0, 3) // Show only first 3 products
    });
  } catch (error) {
    console.error('Error loading home page:', error);
    res.status(500).render('error', { 
      message: 'Error loading page' 
    });
  }
});

router.get('/products', async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.render('pages/products', {
      products,
      category: 'All Products',
      title: 'Products'
    });
  } catch (error) {
    console.error('Error loading products:', error);
    res.status(500).render('error', { 
      message: 'Error loading products' 
    });
  }
});

router.get('/products/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const products = await productService.getProductsByCategory(category);
    const categoryTitles = {
      web: 'Web Applications',
      mobile: 'Mobile Apps',
      desktop: 'Desktop Software'
    };
    
    res.render('pages/products', {
      products,
      category: categoryTitles[category] || 'Products',
      title: categoryTitles[category]
    });
  } catch (error) {
    console.error('Error loading products:', error);
    res.status(500).render('error', { 
      message: 'Error loading products' 
    });
  }
});

router.get('/free', async (req, res) => {
  try {
    const freeProducts = await productService.getFreeProducts();
    res.render('pages/free', {
      title: 'Free Products',
      freeProducts
    });
  } catch (error) {
    console.error('Error loading free products:', error);
    res.status(500).render('error', { 
      message: 'Error loading free products' 
    });
  }
});

router.get('/about', (req, res) => {
  res.render('pages/about', { title: 'About Us' });
});

router.get('/contact', (req, res) => {
  res.render('pages/contact', { title: 'Contact' });
});

module.exports = router;