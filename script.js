let cart = [];

const productsContainer = document.getElementById("productsContainer");
const cartContainer = document.getElementById("cartContainer");
const cartItems = document.getElementById("cartItems");
const totalAmount = document.getElementById("totalAmount");
const cartCount = document.getElementById("cartCount");
const clearCartBtn = document.getElementById("clearCart");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const toast = document.getElementById("toast");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const cartButton = document.getElementById("cartButton");
const closeCart = document.getElementById("closeCart");

document.addEventListener("DOMContentLoaded", () => {
  loadCart();
  displayProducts(products);
  updateCart();
  loadTheme();
});

// Display products
function displayProducts(list) {
  productsContainer.innerHTML = "";
  list.forEach((p) => {
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}" />
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
        <button onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    `;
    productsContainer.appendChild(card);
  });
}

// Add to cart
function addToCart(id) {
  const product = products.find((p) => p.id === id);
  const existing = cart.find((item) => item.id === id);

  if (existing) existing.quantity += 1;
  else cart.push({ ...product, quantity: 1 });

  saveCart();
  updateCart();
  showToast(`${product.name} added to cart`);
}

// Update cart
function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach((item) => {
    total += item.price * item.quantity;
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <div>
        <p>${item.name}</p>
        <p>₹${item.price}</p>
        <div class="qty-controls">
          <button onclick="changeQuantity(${item.id}, -1)">-</button>
          ${item.quantity}
          <button onclick="changeQuantity(${item.id}, 1)">+</button>
        </div>
      </div>
      <button class="remove-btn" onclick="removeItem(${item.id})">❌</button>
    `;
    cartItems.appendChild(div);
  });

  totalAmount.textContent = total;
  cartCount.textContent = cart.reduce((sum, i) => sum + i.quantity, 0);
}

// Change quantity
function changeQuantity(id, delta) {
  const item = cart.find((i) => i.id === id);
  item.quantity += delta;
  if (item.quantity <= 0) removeItem(id);
  saveCart();
  updateCart();
}

// Remove item
function removeItem(id) {
  cart = cart.filter((i) => i.id !== id);
  saveCart();
  updateCart();
}

// Clear cart
clearCartBtn.addEventListener("click", () => {
  cart = [];
  saveCart();
  updateCart();
});

// Search filter
searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = products.filter((p) => p.name.toLowerCase().includes(query));
  displayProducts(filtered);
});

// Category filter
categoryFilter.addEventListener("change", (e) => {
  const category = e.target.value;
  const filtered = category === "all" ? products : products.filter((p) => p.category === category);
  displayProducts(filtered);
});

// Toast notification
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

// Theme toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeIcon.src = isDark
    ? "https://cdn-icons-png.flaticon.com/512/169/169367.png"
    : "https://cdn-icons-png.flaticon.com/512/5262/5262027.png";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

function loadTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeIcon.src = "https://cdn-icons-png.flaticon.com/512/169/169367.png";
  }
}

// Toggle cart
cartButton.addEventListener("click", () => cartContainer.classList.toggle("hidden"));
closeCart.addEventListener("click", () => cartContainer.classList.add("hidden"));

// Local storage helpers
function saveCart() {
  localStorage.setItem("cartItems", JSON.stringify(cart));
}
function loadCart() {
  const saved = JSON.parse(localStorage.getItem("cartItems"));
  if (saved) cart = saved;
}
