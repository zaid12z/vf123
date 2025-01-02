export async function handleDownload(productId) {
  try {
    const response = await fetch(`/products/download/${productId}`);
    const result = await response.json();
    
    if (result.success) {
      window.location.href = result.downloadUrl;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    if (error.message === 'Please log in to access this page') {
      window.showNotification('Please log in to download this product', 'error');
      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 2000);
    } else {
      window.showNotification(error.message || 'Error processing download', 'error');
    }
  }
}