import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Admin.css';

function Admin() {
  const [orders, setOrders] = useState([]);
  const [foods, setFoods] = useState([]); // State lưu danh sách món ăn
  const [newFood, setNewFood] = useState({ name: '', price: '', image: '' }); // State lưu thông tin món mới
  const [editingFood, setEditingFood] = useState(null); // State lưu món ăn đang sửa
  const [activeTab, setActiveTab] = useState('orders'); // State lưu tab đang hiển thị (orders/foods)

  useEffect(() => {
    const fetchOrdersAndFoods = async () => {
      try {
        const [ordersRes, foodsRes] = await Promise.all([
          axios.get('https://restaurant-order-app8.onrender.com/api/orders'),
          axios.get('https://restaurant-order-app8.onrender.com/api/foods'),
        ]);
        setOrders(ordersRes.data);
        setFoods(foodsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchOrdersAndFoods();
  }, []);

  const handleAddFood = async () => {
    try {
      const { data } = await axios.post('https://restaurant-order-app8.onrender.com/api/foods', newFood);
      setFoods([...foods, data]);
      setNewFood({ name: '', price: '', image: '' });
    } catch (error) {
      console.error('Error adding food:', error);
    }
  };

  const handleEditFood = (food) => {
    setEditingFood(food);
  };

  const handleUpdateFood = async () => {
    try {
      const { data } = await axios.put(
        `https://restaurant-order-app8.onrender.com/api/foods/${editingFood._id}`,
        editingFood
      );
      setFoods(foods.map((food) => (food._id === data._id ? data : food)));
      setEditingFood(null);
    } catch (error) {
      console.error('Error updating food:', error);
    }
  };

  const handleDeleteFood = async (id) => {
    try {
      await axios.delete(`https://restaurant-order-app8.onrender.com/api/foods/${id}`);
      setFoods(foods.filter((food) => food._id !== id));
    } catch (error) {
      console.error('Error deleting food:', error);
    }
  };

  return (
    <div className="admin-container">
      <h1>Quản lý Món Ăn và Đơn Hàng</h1>

      {/* Tabs to switch between order and food management */}
      <div className="tabs">
        <button onClick={() => setActiveTab('orders')} className={activeTab === 'orders' ? 'active' : ''}>
          Quản lý Đơn Hàng
        </button>
        <button onClick={() => setActiveTab('foods')} className={activeTab === 'foods' ? 'active' : ''}>
          Quản lý Món Ăn
        </button>
      </div>

      {/* Orders Section */}
      {activeTab === 'orders' && (
        <div className="orders-section">
          <h2>Danh sách đơn hàng</h2>
          {orders.length > 0 ? (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Số bàn</th>
                  <th>Các món</th>
                  <th>Ghi chú</th>
                  <th>Thời gian đặt món</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.tableNumber}</td>
                    <td>
                      {order.items.map((item, index) => (
                        <div key={index}>
                          {item.foodName} x {item.quantity}
                        </div>
                      ))}
                    </td>
                    <td>{order.note || 'Không có ghi chú'}</td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No orders found.</p>
          )}
        </div>
      )}

      {/* Food Section */}
      {activeTab === 'foods' && (
        <div className="food-management">
          <h2>Quản lý món ăn</h2>
          <table className="orders-table">
            <thead>
              <tr>
                <th>Tên món</th>
                <th>Giá</th>
                <th>Hình ảnh</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {foods.map((food) => (
                <tr key={food._id}>
                  <td>{food.name}</td>
                  <td>{food.price} VNĐ</td>
                  <td>
                    <img src={food.image} alt={food.name} style={{ width: '50px', height: '50px' }} />
                  </td>
                  <td>
                    <button onClick={() => handleEditFood(food)}>Sửa</button>
                    <button onClick={() => handleDeleteFood(food._id)}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Form thêm/sửa món ăn */}
          <div className="food-form">
            <h3>{editingFood ? 'Sửa món ăn' : 'Thêm món ăn'}</h3>
            <input
              type="text"
              placeholder="Tên món"
              value={editingFood ? editingFood.name : newFood.name}
              onChange={(e) =>
                editingFood
                  ? setEditingFood({ ...editingFood, name: e.target.value })
                  : setNewFood({ ...newFood, name: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Giá"
              value={editingFood ? editingFood.price : newFood.price}
              onChange={(e) =>
                editingFood
                  ? setEditingFood({ ...editingFood, price: e.target.value })
                  : setNewFood({ ...newFood, price: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Link hình ảnh"
              value={editingFood ? editingFood.image : newFood.image}
              onChange={(e) =>
                editingFood
                  ? setEditingFood({ ...editingFood, image: e.target.value })
                  : setNewFood({ ...newFood, image: e.target.value })
              }
            />
            <button onClick={editingFood ? handleUpdateFood : handleAddFood}>
              {editingFood ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
