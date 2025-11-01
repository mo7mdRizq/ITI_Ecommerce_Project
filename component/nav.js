
  // ✅ جلب السلة من localStorage
  function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  }

  // ✅ حفظ السلة
  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount(); // كل مرة نحفظ نحدث العدد
  }

  // ✅ تحديث عداد الكارت في الـ navbar
  function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    const badge = document.getElementById("cart-count");

    if (!badge) return; // لو الصفحة دي مافيهاش navbar
    if (totalItems > 0) {
      badge.style.display = "inline";
      badge.textContent = totalItems;
    } else {
      badge.style.display = "none";
    }
  }

  // ✅ تحديث العدّاد أول ما الصفحة تفتح
  document.addEventListener("DOMContentLoaded", updateCartCount);

  // ✅ تعديل دالة addToCart عشان تحدث العداد بعد الإضافة
  function addToCart(index) {
    const products = getProducts();
    const p = products[index];
    if (!p) return alert('Product not found');

    const cart = getCart();
    const exist = cart.find(item => item.name === p.name);
    if (exist) exist.qty = (exist.qty || 1) + 1;
    else cart.push({ ...p, qty: 1 });

    saveCart(cart);
    alert(`${p.name} added to cart ✅`);
    updateCartCount(); // <-- السطر الجديد المهم 👈
  }




    document.addEventListener("DOMContentLoaded", () => {
  const searchInputTop = document.getElementById("navbarSearchInput");
  if (!searchInputTop) return;

  // إنشاء dropdown container
  const dropdown = document.createElement("div");
  dropdown.id = "navbarSearchDropdown";
  Object.assign(dropdown.style, {
    position: "absolute",
    top: "100%",
    left: "0",
    right: "0",
    background: "#fff",
    border: "1px solid #ddd",
    borderTop: "none",
    zIndex: "1000",
    maxHeight: "250px",
    overflowY: "auto",
    display: "none",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    borderRadius: "0 0 10px 10px"
  });
  searchInputTop.parentElement.style.position = "relative";
  searchInputTop.parentElement.appendChild(dropdown);

  searchInputTop.addEventListener("input", () => {
    const term = searchInputTop.value.trim().toLowerCase();
    const products = JSON.parse(localStorage.getItem("products")) || [];
    dropdown.innerHTML = "";

    if (!term) {
      dropdown.style.display = "none";
      return;
    }

    const results = products.filter(p => p.name?.toLowerCase().includes(term));

    if (results.length === 0) {
      dropdown.innerHTML = `<div class="p-2 text-muted small">No results found</div>`;
    } else {
      results.forEach(p => {
        const item = document.createElement("div");
        item.classList.add("dropdown-item");
        item.style.padding = "10px 15px";
        item.style.cursor = "pointer";
        item.style.borderBottom = "1px solid #f0f0f0";
        item.style.display = "flex";
        item.style.alignItems = "center";
        item.innerHTML = `
          <img src="${p.image || 'https://via.placeholder.com/40'}"
               style="width:40px;height:40px;object-fit:cover;border-radius:6px;margin-right:10px;">
          <div>
            <div class="fw-semibold">${p.name}</div>
            <div class="text-muted small">${p.category || ''}</div>
          </div>
        `;
        item.addEventListener("click", () => {
          localStorage.setItem("selectedProduct", JSON.stringify(p));
          window.location.href = "product-details.html";
        });
        dropdown.appendChild(item);
      });
    }

    dropdown.style.display = "block";
  });

  // إخفاء القائمة لما تضغط براها
  document.addEventListener("click", (e) => {
    if (!searchInputTop.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });

  // Enter يفتح أول نتيجة
  searchInputTop.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const first = dropdown.querySelector(".dropdown-item");
      if (first) first.click();
    }
  });
});

