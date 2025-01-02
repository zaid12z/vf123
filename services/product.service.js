const db = require('../config/database');

class ProductService {
  async getAllProducts() {
    try {
      const [rows] = await db.query(`
        SELECT * FROM products
        WHERE price > 0
        ORDER BY created_at DESC
      `);
      return rows.map(this.parseProduct);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getFreeProducts() {
    try {
      const [rows] = await db.query(`
        SELECT * FROM products
        WHERE price = 0
        ORDER BY created_at DESC
      `);
      return rows.map(this.parseProduct);
    } catch (error) {
      console.error('Error fetching free products:', error);
      throw error;
    }
  }

  async getProductsByCategory(category) {
    try {
      const [rows] = await db.query(`
        SELECT * FROM products
        WHERE category = ?
        ORDER BY created_at DESC
      `, [category]);
      return rows.map(this.parseProduct);
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const [rows] = await db.query(`
        SELECT * FROM products
        WHERE id = ?
      `, [id]);
      return rows[0] ? this.parseProduct(rows[0]) : null;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  parseProduct(product) {
    return {
      ...product,
      price: Number(product.price),
      features: typeof product.features === 'string' 
        ? JSON.parse(product.features)
        : (Array.isArray(product.features) ? product.features : [])
    };
  }
}

module.exports = new ProductService();