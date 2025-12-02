const products = [
  { id: 1, name: "Chocolate Chip Cookies", price: 24, category: "cookies", img: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 2, name: "Red Velvet Cupcakes", price: 36, category: "cakes", img: "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 3, name: "Rainbow Macarons", price: 42, category: "macarons", img: "https://images.pexels.com/photos/1352280/pexels-photo-1352280.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 4, name: "Strawberry Shortcake", price: 48, category: "cakes", img: "https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 5, name: "Matcha Cookies", price: 28, category: "cookies", img: "https://images.pexels.com/photos/230897/pexels-photo-230897.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 6, name: "Rose Pistachio Cake", price: 55, category: "cakes", img: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 7, name: "Lavender Macarons", price: 45, category: "macarons", img: "https://images.pexels.com/photos/1352280/pexels-photo-1352280.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 8, name: "Salted Caramel Cookies", price: 30, category: "cookies", img: "https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 9, name: "Danish Pastrie", price: 30, category: "cakes", img:"./Danish pastries.jpeg"}
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

const productsContainer = document.getElementById('products');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const miniTotal = document.getElementById('mini-total');
const cartItemsContainer = document.getElementById('cart-items');
const miniCartItems = document.getElementById('mini-cart-items');

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

function renderProducts(filter = "all") {
  productsContainer.innerHTML = '';
  const filtered = filter === "all" ? products : products.filter(p => p.category === filter);
  filtered.forEach(product => {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.innerHTML = `
      <img src="${product.img}" alt="${product.name}">
      <div class="product-info">
        <h3>${product.name}</h3>
        <div class="price">$${product.price}</div>
        <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    `;
    productsContainer.appendChild(div);
  });
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);
  if (existing) existing.quantity++;
  else cart.push({ ...product, quantity: 1 });
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
  showToast(`${product.name} added`);
}

function updateCartUI() {
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  cartCount.textContent = totalItems;
  cartTotal.textContent = totalPrice;
  miniTotal.textContent = totalPrice;

  cartItemsContainer.innerHTML = cart.length === 0 ? '<p style="text-align:center;color:#aaa;padding:2rem;">Your cart is empty</p>' :
    cart.map(item => `
      <div style="display:flex;gap:15px;margin:15px 0;align-items:center;background:#fff5fb;padding:12px;border-radius:16px;">
        <img src="${item.img}" style="width:70px;height:70px;border-radius:12px;object-fit:cover;">
        <div style="flex:1;"><strong>${item.name}</strong><br>$${item.price} × ${item.quantity}</div>
      </div>
    `).join('');

  miniCartItems.innerHTML = cart.length === 0 ? '<p style="text-align:center;color:#aaa;">Empty</p>' :
    cart.map(item => `
      <div style="display:flex;gap:10px;margin:10px 0;align-items:center;">
        <img src="${item.img}" style="width:50px;height:50px;border-radius:10px;object-fit:cover;">
        <div><strong>${item.name}</strong><br>$${item.price} × ${item.quantity}</div>
      </div>
    `).join('');
}

function openFullCart() {
  document.getElementById('cart-sidebar').classList.add('open');
  document.getElementById('overlay').classList.add('active');
  document.getElementById('mini-cart').classList.remove('show'); // close mini-cart
  updateCartUI();
}

/* EVENT LISTENERS */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.filter-btn.active').classList.remove('active');
    btn.classList.add('active');
    renderProducts(btn.dataset.category);
  });
});

document.getElementById('close-cart').onclick = () => {
  document.getElementById('cart-sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('active');
};

document.getElementById('overlay').onclick = () => {
  document.getElementById('cart-sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('active');
};

// Mini-cart open/close
document.getElementById('cart-btn').addEventListener('click', function(e) {
  e.stopPropagation();
  document.getElementById('mini-cart').classList.toggle('show');
});

document.getElementById('close-mini-cart').addEventListener('click', function() {
  document.getElementById('mini-cart').classList.remove('show');
});

document.addEventListener('click', function() {
  document.getElementById('mini-cart').classList.remove('show');
});

document.getElementById('mini-cart').addEventListener('click', function(e) {
  e.stopPropagation();
});

document.getElementById('search').addEventListener('input', e => {
  const term = e.target.value.toLowerCase();
  const filtered = products.filter(p => p.name.toLowerCase().includes(term));
  productsContainer.innerHTML = '';
  filtered.forEach(p => {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.innerHTML = `<img src="${p.img}" alt="${p.name}">
      <div class="product-info">
        <h3>${p.name}</h3>
        <div class="price">$${p.price}</div>
        <button class="add-to-cart" onclick="addToCart(${p.id})">Add to Cart</button>
      </div>`;
    productsContainer.appendChild(div);
  });
});

/* INIT */
renderProducts();
updateCartUI();