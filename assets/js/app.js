const products = [
  {
    id: "urban-flex",
    name: "Giày Urban Flex",
    category: "Thời trang",
    description: "Thể thao hằng ngày",
    detail: "Thiết kế êm chân, đế cao su bám tốt, phù hợp đi học, đi làm và tập nhẹ.",
    price: 799000,
    oldPrice: 999000,
    badge: "-20%",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    stock: 18,
    sold: 164
  },
  {
    id: "minimal-watch",
    name: "Đồng hồ Minimal",
    category: "Phụ kiện",
    description: "Dây thép không gỉ",
    detail: "Mặt kính chống trầy, dây thép chắc tay, phù hợp phong cách tối giản.",
    price: 1290000,
    badge: "Mới",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
    stock: 12,
    sold: 98
  },
  {
    id: "bass-pro",
    name: "Tai nghe Bass Pro",
    category: "Công nghệ",
    description: "Bluetooth 5.3",
    detail: "Âm trầm dày, pin dùng lâu, kết nối ổn định cho làm việc và giải trí.",
    price: 649000,
    badge: "Hot",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    stock: 26,
    sold: 221
  },
  {
    id: "canvas-jacket",
    name: "Áo khoác Canvas",
    category: "Thời trang",
    description: "Chất liệu dày dặn",
    detail: "Form gọn, vải canvas bền, dễ phối đồ cho lịch trình hằng ngày.",
    price: 529000,
    badge: "Best",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80",
    stock: 20,
    sold: 145
  },
  {
    id: "citrus-perfume",
    name: "Nước hoa Citrus",
    category: "Phụ kiện",
    description: "Hương tươi mát",
    detail: "Tầng hương citrus nhẹ, lưu mùi vừa phải, hợp môi trường công sở.",
    price: 390000,
    image: "https://images.unsplash.com/photo-1585386959984-a41552231658?auto=format&fit=crop&w=900&q=80",
    stock: 34,
    sold: 73
  },
  {
    id: "skincare-basic",
    name: "Bộ skincare Basic",
    category: "Gia dụng",
    description: "Chăm sóc mỗi ngày",
    detail: "Bộ chăm sóc cơ bản gồm sữa rửa mặt, toner và kem dưỡng dịu nhẹ.",
    price: 459000,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80",
    stock: 17,
    sold: 86
  }
];

const storage = {
  get(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

const formatMoney = (value) => `${Number(value).toLocaleString("vi-VN")}d`;
const findProduct = (id) => products.find((product) => product.id === id);

function showToast(message) {
  const toast = document.querySelector("#shopToast");
  if (!toast || !window.bootstrap) return;
  toast.querySelector(".toast-body").textContent = message;
  bootstrap.Toast.getOrCreateInstance(toast).show();
}

function getCart() {
  return storage.get("novamartCart", []);
}

function saveCart(cart) {
  storage.set("novamartCart", cart.filter((item) => item.quantity > 0));
  renderCartCount();
}

function addToCart(productId, quantity = 1) {
  const product = findProduct(productId);
  if (!product) return;
  const cart = getCart();
  const item = cart.find((entry) => entry.id === productId);
  if (item) {
    item.quantity = Math.min(product.stock, item.quantity + quantity);
  } else {
    cart.push({ id: productId, quantity: Math.min(product.stock, quantity) });
  }
  saveCart(cart);
  renderCart();
  renderCheckoutSummary();
  showToast("Đã thêm sản phẩm vào giỏ hàng");
}

function cartTotals() {
  const items = getCart()
    .map((item) => ({ ...item, product: findProduct(item.id) }))
    .filter((item) => item.product);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= 499000 ? 0 : 30000;
  const discount = storage.get("novamartCoupon", "") === "NOVA10" ? Math.round(subtotal * 0.1) : 0;
  return { items, subtotal, shipping, discount, total: Math.max(0, subtotal + shipping - discount) };
}

function renderCartCount() {
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll("[data-cart-count]").forEach((target) => {
    target.textContent = count;
    target.classList.toggle("d-none", count === 0);
  });
}

function renderProducts() {
  const grid = document.querySelector("#productGrid");
  if (!grid) return;

  const search = document.querySelector("#productSearch")?.value.trim().toLowerCase() || "";
  const category = document.querySelector("#categoryFilter")?.value || "Tất cả";
  const maxPrice = Number(document.querySelector("#priceFilter")?.value || 2000000);
  const sort = document.querySelector("#sortFilter")?.value || "newest";
  const priceText = document.querySelector("#priceFilterValue");
  if (priceText) priceText.textContent = formatMoney(maxPrice);

  let visible = products.filter((product) => {
    const matchesSearch = `${product.name} ${product.description}`.toLowerCase().includes(search);
    const matchesCategory = category === "Tất cả" || product.category === category;
    return matchesSearch && matchesCategory && product.price <= maxPrice;
  });

  visible = visible.sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "best-seller") return b.sold - a.sold;
    return 0;
  });

  document.querySelector("#productResultText").textContent = `Hiển thị ${visible.length} sản phẩm.`;
  grid.innerHTML = visible.length
    ? visible.map(productCard).join("")
    : `<div class="col-12"><div class="empty-state">Không tìm thấy sản phẩm phù hợp.</div></div>`;
}

function productCard(product) {
  return `
    <div class="col-sm-6 col-xl-4">
      <article class="product-card overflow-hidden h-100">
        <a href="product-detail.html?id=${product.id}"><img class="w-100" src="${product.image}" alt="${product.name}"></a>
        <div class="p-3">
          <div class="d-flex justify-content-between gap-2">
            <span class="badge text-bg-light">${product.category}</span>
            ${product.badge ? `<span class="badge badge-sale">${product.badge}</span>` : ""}
          </div>
          <h3 class="h6 mt-2">${product.name}</h3>
          <p class="small text-muted-2">${product.description}</p>
          <div class="d-flex justify-content-between align-items-center gap-2">
            <strong>${formatMoney(product.price)}</strong>
            <div class="btn-group btn-group-sm">
              <button class="btn btn-outline-secondary" data-wishlist="${product.id}" aria-label="Yêu thích"><i class="bi bi-heart"></i></button>
              <button class="btn btn-brand" data-add-cart="${product.id}">Thêm</button>
            </div>
          </div>
        </div>
      </article>
    </div>`;
}

function renderProductDetail() {
  const detail = document.querySelector("#productDetail");
  if (!detail) return;
  const id = new URLSearchParams(window.location.search).get("id") || "urban-flex";
  const product = findProduct(id) || products[0];
  document.title = `${product.name} - NovaMart`;
  detail.innerHTML = `
    <nav aria-label="breadcrumb"><ol class="breadcrumb"><li class="breadcrumb-item"><a href="index.html">Trang chủ</a></li><li class="breadcrumb-item"><a href="products.html">Sản phẩm</a></li><li class="breadcrumb-item active">${product.name}</li></ol></nav>
    <div class="row g-5">
      <div class="col-lg-6"><img class="product-detail-img w-100 rounded-3" src="${product.image.replace("w=900", "w=1200")}" alt="${product.name}"></div>
      <div class="col-lg-6">
        ${product.badge ? `<span class="badge badge-sale mb-2">${product.badge}</span>` : ""}
        <h1 class="fw-bold">${product.name}</h1>
        <div class="text-warning mb-2"><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-half"></i> <span class="text-muted-2">${product.sold} lượt mua</span></div>
        <p class="lead fw-bold">${formatMoney(product.price)} ${product.oldPrice ? `<span class="text-muted text-decoration-line-through fs-6">${formatMoney(product.oldPrice)}</span>` : ""}</p>
        <p class="text-muted-2">${product.detail}</p>
        <div class="row g-3">
          <div class="col-sm-6"><label class="form-label">Phân loại</label><select class="form-select"><option>${product.category}</option></select></div>
          <div class="col-sm-6"><label class="form-label">Số lượng</label><div class="input-group" data-qty><button class="btn btn-outline-secondary" data-action="minus">-</button><input class="form-control text-center" value="1" min="1" max="${product.stock}"><button class="btn btn-outline-secondary" data-action="plus">+</button></div></div>
        </div>
        <div class="d-flex flex-wrap gap-2 mt-4"><button class="btn btn-brand btn-lg" data-add-cart="${product.id}" data-qty-source="#productDetail"><i class="bi bi-bag-plus me-2"></i>Thêm vào giỏ</button><button class="btn btn-outline-secondary btn-lg" data-buy-now="${product.id}">Mua ngay</button></div>
        <hr>
        <ul class="list-unstyled text-muted-2"><li><i class="bi bi-truck me-2"></i>Giao hàng 2-4 ngày</li><li><i class="bi bi-arrow-repeat me-2"></i>Đổi trả trong 7 ngày</li><li><i class="bi bi-shield-check me-2"></i>Thanh toán an toàn</li></ul>
      </div>
    </div>`;
}

function renderCart() {
  const body = document.querySelector("#cartItems");
  if (!body) return;
  const totals = cartTotals();
  body.innerHTML = totals.items.length
    ? totals.items.map(({ product, quantity }) => `
      <tr>
        <td><div class="d-flex align-items-center gap-3"><img class="cart-thumb" src="${product.image}" alt="${product.name}"><div><strong>${product.name}</strong><div class="small text-muted-2">${product.category}</div></div></div></td>
        <td>${formatMoney(product.price)}</td>
        <td><input class="form-control" type="number" min="1" max="${product.stock}" value="${quantity}" data-cart-qty="${product.id}" style="max-width:88px"></td>
        <td><strong>${formatMoney(product.price * quantity)}</strong></td>
        <td><button class="btn btn-sm btn-outline-danger" data-remove-cart="${product.id}">Xóa</button></td>
      </tr>`).join("")
    : `<tr><td colspan="5"><div class="empty-state">Giỏ hàng đang trống.</div></td></tr>`;

  document.querySelectorAll("[data-cart-subtotal]").forEach((el) => (el.textContent = formatMoney(totals.subtotal)));
  document.querySelectorAll("[data-cart-shipping]").forEach((el) => (el.textContent = formatMoney(totals.shipping)));
  document.querySelectorAll("[data-cart-discount]").forEach((el) => (el.textContent = `-${formatMoney(totals.discount)}`));
  document.querySelectorAll("[data-cart-total]").forEach((el) => (el.textContent = formatMoney(totals.total)));
  document.querySelectorAll("[data-cart-size]").forEach((el) => (el.textContent = totals.items.reduce((sum, item) => sum + item.quantity, 0)));
}

function renderCheckoutSummary() {
  const summary = document.querySelector("#checkoutSummary");
  if (!summary) return;
  const totals = cartTotals();
  summary.innerHTML = totals.items.length
    ? totals.items.map(({ product, quantity }) => `<div class="d-flex justify-content-between gap-3 mb-2"><span>${product.name} x${quantity}</span><strong>${formatMoney(product.price * quantity)}</strong></div>`).join("")
    : `<div class="empty-state">Chưa có sản phẩm để thanh toán.</div>`;
  document.querySelectorAll("[data-cart-total]").forEach((el) => (el.textContent = formatMoney(totals.total)));
}

function createOrder(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }
  const totals = cartTotals();
  if (!totals.items.length) {
    showToast("Giỏ hàng đang trống");
    return;
  }
  const order = {
    id: `NM${Date.now().toString().slice(-6)}`,
    date: new Date().toLocaleDateString("vi-VN"),
    status: "Đã đặt",
    total: totals.total,
    items: totals.items.map(({ id, quantity }) => ({ id, quantity }))
  };
  const orders = storage.get("novamartOrders", []);
  orders.unshift(order);
  storage.set("novamartOrders", orders);
  saveCart([]);
  window.location.href = `order-success.html?order=${order.id}`;
}

function renderOrders() {
  const body = document.querySelector("#ordersBody");
  if (!body) return;
  const orders = getKnownOrders();
  body.innerHTML = orders.map((order) => `
    <tr>
      <td>#${order.id}</td>
      <td>${order.date}</td>
      <td><span class="badge text-bg-${order.status === "Hoàn tất" ? "success" : "primary"}">${order.status}</span></td>
      <td>${formatMoney(order.total)}</td>
      <td><a class="btn btn-sm btn-outline-secondary" href="order-detail.html?order=${order.id}">Chi tiết</a></td>
    </tr>`).join("");
}

function getKnownOrders() {
  const demoOrders = [
    {
      id: "NM1026",
      date: "11/05/2026",
      status: "Đang giao",
      total: 2738000,
      items: [
        { id: "urban-flex", quantity: 1 },
        { id: "minimal-watch", quantity: 1 },
        { id: "bass-pro", quantity: 1 }
      ]
    },
    {
      id: "NM1019",
      date: "03/05/2026",
      status: "Hoàn tất",
      total: 799000,
      items: [{ id: "urban-flex", quantity: 1 }]
    }
  ];
  return [...storage.get("novamartOrders", []), ...demoOrders];
}

function renderOrderDetail() {
  const body = document.querySelector("#orderDetailItems");
  if (!body) return;
  const requestedId = new URLSearchParams(window.location.search).get("order") || "NM1026";
  const order = getKnownOrders().find((entry) => entry.id === requestedId) || getKnownOrders()[0];
  document.querySelector("#orderDetailHeader").innerHTML = `
    <div><h1 class="h3 fw-bold mb-1">Đơn hàng #${order.id}</h1><p class="text-muted-2 mb-0">Ngày đặt: ${order.date}</p></div>
    <span class="badge text-bg-${order.status === "Hoàn tất" ? "success" : "primary"}">${order.status}</span>`;
  body.innerHTML = order.items.map((item) => {
    const product = findProduct(item.id);
    if (!product) return "";
    return `<tr><td>${product.name}</td><td>${item.quantity}</td><td>${formatMoney(product.price)}</td><td>${formatMoney(product.price * item.quantity)}</td></tr>`;
  }).join("");
  document.querySelector("#orderDetailTotal").textContent = formatMoney(order.total);
}

function renderOrderSuccess() {
  const target = document.querySelector("#successOrderId");
  if (!target) return;
  const orderId = new URLSearchParams(window.location.search).get("order") || "NM1026";
  target.textContent = `#${orderId}`;
}

function renderWishlist() {
  const grid = document.querySelector("#wishlistGrid");
  if (!grid) return;
  const ids = storage.get("novamartWishlist", ["minimal-watch", "bass-pro"]);
  const items = ids.map(findProduct).filter(Boolean);
  grid.innerHTML = items.length
    ? items.map((product) => `<div class="col-md-4">${productCard(product).replace("col-sm-6 col-xl-4", "")}</div>`).join("")
    : `<div class="col-12"><div class="empty-state">Bạn chưa lưu sản phẩm yêu thích.</div></div>`;
}

function toggleWishlist(productId) {
  const wishlist = storage.get("novamartWishlist", []);
  const next = wishlist.includes(productId)
    ? wishlist.filter((id) => id !== productId)
    : [...wishlist, productId];
  storage.set("novamartWishlist", next);
  renderWishlist();
  showToast(next.includes(productId) ? "Đã lưu vào yêu thích" : "Đã bỏ khỏi yêu thích");
}

function bindEvents() {
  document.addEventListener("click", (event) => {
    const qtyButton = event.target.closest("[data-qty] button");
    if (qtyButton) {
      const input = qtyButton.closest("[data-qty]").querySelector("input");
      const delta = qtyButton.dataset.action === "plus" ? 1 : -1;
      input.value = Math.max(1, Number(input.value || 1) + delta);
    }

    const addButton = event.target.closest("[data-add-cart]");
    if (addButton) {
      const source = addButton.dataset.qtySource ? document.querySelector(addButton.dataset.qtySource) : document;
      const quantity = Number(source?.querySelector("[data-qty] input")?.value || 1);
      addToCart(addButton.dataset.addCart, quantity);
    }

    const buyNow = event.target.closest("[data-buy-now]");
    if (buyNow) {
      const quantity = Number(document.querySelector("[data-qty] input")?.value || 1);
      addToCart(buyNow.dataset.buyNow, quantity);
      window.location.href = "checkout.html";
    }

    const removeButton = event.target.closest("[data-remove-cart]");
    if (removeButton) {
      saveCart(getCart().filter((item) => item.id !== removeButton.dataset.removeCart));
      renderCart();
      renderCheckoutSummary();
    }

    const wishlistButton = event.target.closest("[data-wishlist]");
    if (wishlistButton) toggleWishlist(wishlistButton.dataset.wishlist);
  });

  document.addEventListener("input", (event) => {
    if (event.target.matches("#productSearch, #categoryFilter, #priceFilter, #sortFilter")) renderProducts();
    if (event.target.matches("[data-cart-qty]")) {
      const product = findProduct(event.target.dataset.cartQty);
      const quantity = Math.max(1, Math.min(product?.stock || 99, Number(event.target.value || 1)));
      const cart = getCart().map((item) => item.id === event.target.dataset.cartQty ? { ...item, quantity } : item);
      saveCart(cart);
      renderCart();
      renderCheckoutSummary();
    }
  });

  document.querySelector("#couponForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const code = event.currentTarget.querySelector("input").value.trim().toUpperCase();
    storage.set("novamartCoupon", code === "NOVA10" ? code : "");
    renderCart();
    showToast(code === "NOVA10" ? "Đã áp dụng mã NOVA10" : "Mã giảm giá không hợp lệ");
  });

  document.querySelector("#checkoutForm")?.addEventListener("submit", createOrder);
}

document.querySelectorAll("[data-year]").forEach((target) => {
  target.textContent = new Date().getFullYear();
});

bindEvents();
renderProductDetail();
renderProducts();
renderCart();
renderCartCount();
renderCheckoutSummary();
renderOrders();
renderOrderDetail();
renderOrderSuccess();
renderWishlist();
