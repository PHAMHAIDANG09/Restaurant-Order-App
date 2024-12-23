import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState([]);
  const [tableNumber, setTableNumber] = useState('');
  const [note, setNote] = useState('');

  // Lấy danh sách món ăn từ API
  useEffect(() => {
    const fetchFoods = async () => {
      const { data } = await axios.get('https://restaurant-order-app8.onrender.com/api/foods');
      setFoods(data);
    };
    fetchFoods();
  }, []);

  // Lấy số bàn từ URL khi tải trang
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tableFromUrl = params.get('tableNumber');
    if (tableFromUrl) {
      setTableNumber(tableFromUrl); // Đặt số bàn từ URL
    }
  }, []);

  const addToCart = (food) => {
    const item = cart.find(item => item.food.name === food.name);
    if (item) {
      item.quantity++;
      setCart([...cart]);
    } else {
      setCart([...cart, { food, quantity: 1 }]);
    }
  };

  const handleOrder = async () => {
    if (!tableNumber) {
      alert('Vui lòng nhập số bàn!');
      return;
    }
    await axios.post('https://restaurant-order-app8.onrender.com/api/orders', {
      tableNumber: tableNumber,
      note: note || '',
      items: cart.map(item => ({ foodName: item.food.name, quantity: item.quantity })),
    });
    alert('Order placed!');
    setCart([]);
    setTableNumber('');
    setNote('');
  };

  return (
    <div className="app-container">
      {/* Phần hiển thị Menu */}
      <div className="menu-container">
        <h1>Menu</h1>
        <ul className="food-list">
          {foods.map(food => (
              <li key={food._id} className="food-item">
              <img 
                src={`https://restaurant-order-app8.onrender.com/uploads/${food.image}`} 
                alt={food.name} 
                className="food-image" 
              />
              <div className="food-details">
                <span>{food.name}</span>
                <span className="price">${food.price}</span>
              </div>
              <button onClick={() => addToCart(food)}>Thêm vào giỏ hàng</button>
            </li>
            
          ))}
        </ul>
      </div>


      {/* Phần giỏ hàng */}
      <div className="cart-container">
        <h2>Giỏ Hàng</h2>
        {cart.length > 0 ? (
          <ul className="cart-list">
            {cart.map(item => (
              <li key={item.food._id} className="cart-item">
                <span>{item.food.name} x {item.quantity}</span>
                <button onClick={() => setCart(cart.filter(i => i.food._id !== item.food._id))}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Giỏ hàng hiện trống.</p>
        )}
        <div className="order-details">
          <label>
            Số bàn: 
            <input type="number" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} />
          </label>
          <label>
            Ghi chú: 
            <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Nhập ghi chú..." />
          </label>
        </div>
        <button className="order-button" onClick={handleOrder} disabled={cart.length === 0}>
          Place Order
        </button>
      </div>
    </div>
  );
}

export default App;
