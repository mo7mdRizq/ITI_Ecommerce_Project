
  // ---------- DOM Elements ----------
  const saveBtn = document.getElementById("saveProductBtn");
  const form = document.getElementById("productForm");
  const tableBody = document.querySelector("table tbody");
  const modal = new bootstrap.Modal(document.getElementById("addProductModal"));
  
  let products = JSON.parse(localStorage.getItem("products")) || [];
  let editIndex = null;

  // ---------- Display Products ----------
  function renderTable() {
    tableBody.innerHTML = "";
    products.forEach((p, i) => {
      const status =
        p.stock > 0
          ? `<span class="status-available">Available</span>`
          : `<span class="status-out">Out of stock</span>`;

      const row = `
        <tr>
          <td>${i + 1}</td>
          <td>${p.name}</td>
          <td>${p.category}</td>
          <td>$${p.price}</td>
          <td>${p.stock}</td>
          <td>${status}</td>
          <td>
            <button class="btn btn-link text-primary action-btn edit-btn" data-index="${i}">
              <i class="bi bi-pencil-square"></i>
            </button>
            <button class="btn btn-link text-danger action-btn delete-btn" data-index="${i}">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      `;
      tableBody.insertAdjacentHTML("beforeend", row);
    });

    // بعد ما نرسم الجدول، نربط الأحداث
    document.querySelectorAll(".delete-btn").forEach((btn) =>
      btn.addEventListener("click", deleteProduct)
    );
    document.querySelectorAll(".edit-btn").forEach((btn) =>
      btn.addEventListener("click", editProduct)
    );
  }

  // ---------- Add / Edit Product ----------
  saveBtn.addEventListener("click", () => {
    const newProduct = {
      name: document.getElementById("productName").value.trim(),
      category: document.getElementById("productCategory").value.trim(),
      price: parseFloat(document.getElementById("productPrice").value),
      stock: parseInt(document.getElementById("productStock").value),
      description: document.getElementById("productDescription").value.trim(),
      image: document.getElementById("productImage").value,
    };

    if (!newProduct.name || !newProduct.category) return;

    if (editIndex !== null) {
      products[editIndex] = newProduct;
      editIndex = null;
    } else {
      products.push(newProduct);
    }

    localStorage.setItem("products", JSON.stringify(products));
    renderTable();
    form.reset();
    modal.hide();
  });

  // ---------- Delete ----------
  function deleteProduct(e) {
    const index = e.currentTarget.getAttribute("data-index");
    products.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(products));
    renderTable();
  }

  // ---------- Edit ----------
  function editProduct(e) {
    editIndex = e.currentTarget.getAttribute("data-index");
    const p = products[editIndex];

    document.getElementById("productName").value = p.name;
    document.getElementById("productCategory").value = p.category;
    document.getElementById("productPrice").value = p.price;
    document.getElementById("productStock").value = p.stock;
    document.getElementById("productDescription").value = p.description;

    modal.show();
  }

  // ---------- Initialize ----------
  renderTable();

