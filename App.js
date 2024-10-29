// Mpho Seutloali 901017429

import React, { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import LoginForm from './components/LoginForm';
import UserManagement from './components/UserManagement';
import ProductManagement from './components/ProductManagement.js';

function App() {
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('products');
    return savedProducts ? JSON.parse(savedProducts) : [];
  });
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('users');
    return savedUsers ? JSON.parse(savedUsers) : [];
  });
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);
    
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

    const addProduct = (newProduct) => {
    const productWithId = { ...newProduct, id: Date.now() }; // Add unique ID
    setProducts([...products, productWithId]);
  };


  const updateProduct = (id, updatedProduct) => {
    setProducts(products.map(product => (product.id === id ? { ...product, ...updatedProduct } : product)));
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const sellProduct = (id, quantity) => {
    const product = products.find(product => product.id === id);
    if (product) {
      if (product.quantity >= quantity) {
        const cost = product.price * quantity;
        updateProduct(id, { quantity: product.quantity - quantity });
        alert(`Sold ${quantity} of ${product.name} for $${cost}`);
      } else {
        alert(`Not enough stock available for ${product.name}. Available quantity: ${product.quantity}`);
      }
    } else {
      alert('Product not found');
    }
  };

  const registerUser = (newUser) => {
    setUsers([...users, { ...newUser, id: Date.now() }]);
  };

  const login = (credentials) => {
    const foundUser = users.find(user => user.username === credentials.username && user.password === credentials.password);
    if (foundUser) {
      setUser(foundUser.username);
    } else {
      alert('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('dashboard');
  };

  return (
    <div className="app">
      {user ? (
        <>
          <nav>
            <button onClick={() => setCurrentView('dashboard')}>Dashboard</button>
            <button onClick={() => setCurrentView('productManagement')}>Product Management</button> {/* Updated */}
            <button onClick={() => setCurrentView('userManagement')}>User Management</button>
            <button onClick={handleLogout}>Logout</button>
          </nav>
          {currentView === 'dashboard' && <Dashboard products={products} />}
          {currentView === 'productManagement' && <ProductManagement products={products} addProduct={addProduct} updateProduct={updateProduct} deleteProduct={deleteProduct} sellProduct={sellProduct} />} {/* Updated */}
          {currentView === 'userManagement' && <UserManagement users={users} registerUser={registerUser} />}
        </>
      ) : (
        <LoginForm login={login} registerUser={registerUser} />
      )}
    </div>
  );
}

export default App;
