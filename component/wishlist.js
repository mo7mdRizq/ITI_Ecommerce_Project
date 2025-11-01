// ✅ 1. الدالة الأساسية اللي بتخزن المنتج فعلاً
function addToWishlist(product) {
  if (!product || !product.id) {
    alert("❌ Product not found");
    return;
  }

  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const exist = wishlist.find(item => item.id === product.id);
  if (exist) {
    alert("❤️ This product is already in your wishlist!");
    return;
  }

  wishlist.push(product);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  alert(`💖 ${product.name} added to your wishlist!`);
}

// ✅ 2. الدالة اللي بتتعامل مع الزرار في الكارد
function addToWishlistById(id) {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const product = products.find(p => p.id === id);

  if (!product) {
    alert("❌ Product not found");
    return;
  }

  addToWishlist(product);
}
