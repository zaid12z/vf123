const express = require('express');
const router = express.Router();
const productService = require('../services/product.service');
const { ensureAuthenticated } = require('../middleware/auth.middleware');

// Download route with authentication check
router.get('/download/:id', ensureAuthenticated, async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product || !product.download_url) {
      return res.status(404).json({ 
        success: false, 
        error: 'Download not found' 
      });
    }
    res.json({ 
      success: true, 
      downloadUrl: product.download_url 
    });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error processing download' 
    });
  }
});

module.exports = router;