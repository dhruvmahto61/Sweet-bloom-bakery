const products = [
  { id: 1, name: "Chocolate Chip Cookies", price: 24, category: "cookies", img: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 2, name: "Red Velvet Cupcakes", price: 36, category: "cakes", img: "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 3, name: "Rainbow Macarons", price: 42, category: "macarons", img: "https://images.pexels.com/photos/1352280/pexels-photo-1352280.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 4, name: "Strawberry Shortcake", price: 48, category: "cakes", img: "https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 5, name: "Matcha Cookies", price: 28, category: "cookies", img: "https://images.pexels.com/photos/230897/pexels-photo-230897.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 6, name: "Rose Pistachio Cake", price: 55, category: "cakes", img: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 7, name: "Lavender Macarons", price: 45, category: "macarons", img: "https://images.pexels.com/photos/1352280/pexels-photo-1352280.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 8, name: "Salted Caramel Cookies", price: 30, category: "cookies", img: "https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 9, name: "Danish Pastrie", price: 30, category: "cakes", img:"./Danish pastries.jpeg"},
  { id: 10, name: "Garlic Bread", price: 12, category: "Bread", img:"./Garlic Bread.jpeg"},
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

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

/* FULL PAGE LOGIN FUNCTIONALITY */
function initFullPageLogin() {
  // Check if user is already logged in
  if (currentUser) {
    showMainContent();
    showUserInfo();
  } else {
    showLoginPage();
  }

  // Login button click handler - using event delegation for better browser compatibility
  function handleLogin(e) {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const email = document.getElementById('login-page-email');
      const password = document.getElementById('login-page-password');
      
      if (!email || !password) {
        showToast('Form fields not found');
        return false;
      }
      
      const emailValue = email.value.trim();
      const passwordValue = password.value;
      
      if (!emailValue || !passwordValue) {
        showToast('Please fill in all fields');
        return false;
      }
      
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(u => u.email === emailValue && u.password === passwordValue);
      
      if (user) {
        currentUser = { name: user.name, email: user.email };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showMainContent();
        showUserInfo();
        showToast(`Welcome back, ${user.name}!`);
      } else {
        showToast('Invalid email or password');
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      showToast('Error: ' + error.message);
      return false;
    }
  }
  
  // Attach login handler with multiple methods for maximum compatibility
  function attachLoginHandler() {
    const loginSubmitBtn = document.getElementById('login-submit-btn-page');
    if (loginSubmitBtn) {
      // Remove any existing listeners by cloning
      const newBtn = loginSubmitBtn.cloneNode(true);
      loginSubmitBtn.parentNode.replaceChild(newBtn, loginSubmitBtn);
      
      // Attach to the new button
      const freshBtn = document.getElementById('login-submit-btn-page');
      if (freshBtn) {
        freshBtn.addEventListener('click', handleLogin, false);
        freshBtn.onclick = handleLogin; // Fallback for older browsers
      }
    } else {
      setTimeout(attachLoginHandler, 100);
    }
  }
  
  attachLoginHandler();

  // Signup button click handler
  const signupSubmitBtn = document.getElementById('signup-submit-btn-page');
  if (signupSubmitBtn) {
    signupSubmitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const name = document.getElementById('signup-page-name').value;
      const email = document.getElementById('signup-page-email').value;
      const password = document.getElementById('signup-page-password').value;
      
      if (!name || !email || !password) {
        showToast('Please fill in all fields');
        return;
      }
      
      let users = JSON.parse(localStorage.getItem('users')) || [];
      
      if (users.find(u => u.email === email)) {
        showToast('Email already registered');
        return;
      }
      
      users.push({ name, email, password });
      localStorage.setItem('users', JSON.stringify(users));
      
      currentUser = { name, email };
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      showMainContent();
      showUserInfo();
      showToast(`Welcome to SweetBloom, ${name}!`);
    });
  }

  // Toggle between login and signup forms
  document.getElementById('show-signup-page').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('login-page-form').style.display = 'none';
    document.getElementById('signup-page-form').style.display = 'block';
    document.getElementById('forgot-password-page').style.display = 'none';
  });

  document.getElementById('show-login-page').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('signup-page-form').style.display = 'none';
    document.getElementById('login-page-form').style.display = 'block';
    document.getElementById('forgot-password-page').style.display = 'none';
  });

  // Forgot password functionality
  let resetEmail = '';

  document.getElementById('show-forgot-password-page').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('login-page-form').style.display = 'none';
    document.getElementById('signup-page-form').style.display = 'none';
    document.getElementById('forgot-password-page').style.display = 'block';
  });

  // Forgot password button handler
  function handleForgotPassword(e) {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const emailInput = document.getElementById('reset-email-page');
      if (!emailInput) {
        showToast('Email input not found');
        return false;
      }
      
      const email = emailInput.value.trim();
      
      if (!email) {
        showToast('Please enter your email address');
        return false;
      }
      
      resetEmail = email;
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const userExists = users.find(u => u.email === email);
      
      if (userExists) {
        document.getElementById('forgot-password-step1-page').style.display = 'none';
        document.getElementById('forgot-password-step2-page').style.display = 'block';
        document.getElementById('reset-email-display-page').textContent = email;
      } else {
        showToast('Email not found. Please check your email address.');
      }
      return false;
    } catch (error) {
      console.error('Forgot password error:', error);
      showToast('Error: ' + error.message);
      return false;
    }
  }

  // Attach forgot password handler
  function attachForgotPasswordHandler() {
    const forgotPasswordBtn = document.getElementById('forgot-password-submit-page');
    if (forgotPasswordBtn) {
      const newBtn = forgotPasswordBtn.cloneNode(true);
      forgotPasswordBtn.parentNode.replaceChild(newBtn, forgotPasswordBtn);
      const freshBtn = document.getElementById('forgot-password-submit-page');
      if (freshBtn) {
        freshBtn.addEventListener('click', handleForgotPassword, false);
        freshBtn.onclick = handleForgotPassword;
      }
    } else {
      setTimeout(attachForgotPasswordHandler, 100);
    }
  }
  
  attachForgotPasswordHandler();

  // Reset password button handler
  function handleResetPassword(e) {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const newPasswordInput = document.getElementById('new-password-page');
      const confirmPasswordInput = document.getElementById('confirm-password-page');
      
      if (!newPasswordInput || !confirmPasswordInput) {
        showToast('Password fields not found');
        return false;
      }
      
      const newPassword = newPasswordInput.value;
      const confirmPassword = confirmPasswordInput.value;
      
      if (!newPassword || !confirmPassword) {
        showToast('Please fill in all fields');
        return false;
      }
      
      if (newPassword !== confirmPassword) {
        showToast('Passwords do not match!');
        return false;
      }
      
      if (newPassword.length < 6) {
        showToast('Password must be at least 6 characters long!');
        return false;
      }
      
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const userIndex = users.findIndex(u => u.email === resetEmail);
      
      if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));
        showToast('Password reset successfully! You can now login.');
        document.getElementById('forgot-password-page').style.display = 'none';
        document.getElementById('login-page-form').style.display = 'block';
        document.getElementById('forgot-password-step1-page').style.display = 'block';
        document.getElementById('forgot-password-step2-page').style.display = 'none';
        document.getElementById('reset-email-page').value = '';
        document.getElementById('new-password-page').value = '';
        document.getElementById('confirm-password-page').value = '';
      } else {
        showToast('Error: Email not found');
      }
      return false;
    } catch (error) {
      console.error('Reset password error:', error);
      showToast('Error: ' + error.message);
      return false;
    }
  }

  // Attach reset password handler
  function attachResetPasswordHandler() {
    const resetPasswordBtn = document.getElementById('reset-password-submit-page');
    if (resetPasswordBtn) {
      const newBtn = resetPasswordBtn.cloneNode(true);
      resetPasswordBtn.parentNode.replaceChild(newBtn, resetPasswordBtn);
      const freshBtn = document.getElementById('reset-password-submit-page');
      if (freshBtn) {
        freshBtn.addEventListener('click', handleResetPassword, false);
        freshBtn.onclick = handleResetPassword;
      }
    } else {
      setTimeout(attachResetPasswordHandler, 100);
    }
  }
  
  attachResetPasswordHandler();

  document.getElementById('back-to-login-page').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('forgot-password-page').style.display = 'none';
    document.getElementById('login-page-form').style.display = 'block';
    document.getElementById('forgot-password-step1-page').style.display = 'block';
    document.getElementById('forgot-password-step2-page').style.display = 'none';
  });

  document.getElementById('back-to-login-from-reset-page').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('forgot-password-page').style.display = 'none';
    document.getElementById('login-page-form').style.display = 'block';
    document.getElementById('forgot-password-step1-page').style.display = 'block';
    document.getElementById('forgot-password-step2-page').style.display = 'none';
  });

  // Logout functionality
  if (document.getElementById('logout-btn')) {
    document.getElementById('logout-btn').addEventListener('click', () => {
      currentUser = null;
      localStorage.removeItem('currentUser');
      hideUserInfo();
      showLoginPage();
      showToast('Logged out successfully');
    });
  }
}

function showLoginPage() {
  document.getElementById('login-page').style.display = 'flex';
  document.getElementById('main-content').style.display = 'none';
}

function showMainContent() {
  document.getElementById('login-page').style.display = 'none';
  document.getElementById('main-content').style.display = 'block';
  
  // Initialize main content when shown
  if (!productsContainer.innerHTML) {
    renderProducts();
    updateCartUI();
    
    // Set up event listeners for main content
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
  }
}

function showUserInfo() {
  const loginBtn = document.getElementById('login-btn');
  const userInfo = document.getElementById('user-info');
  const userName = document.getElementById('user-name');
  
  if (loginBtn) loginBtn.style.display = 'none';
  if (userInfo) {
    userInfo.style.display = 'flex';
    if (userName && currentUser) userName.textContent = currentUser.name;
  }
}

function hideUserInfo() {
  const loginBtn = document.getElementById('login-btn');
  const userInfo = document.getElementById('user-info');
  
  if (loginBtn) loginBtn.style.display = 'block';
  if (userInfo) userInfo.style.display = 'none';
}

/* INIT - Wait for DOM to be ready */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFullPageLogin);
} else {
  // DOM is already ready
  initFullPageLogin();
}