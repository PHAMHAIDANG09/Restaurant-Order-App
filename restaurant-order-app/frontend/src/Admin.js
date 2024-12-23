import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Admin.css';

function Admin() {
  const [orders, setOrders] = useState([]);
  const [orderStatus, setOrderStatus] = useState({}); // State lưu trạng thái checkbox cho từng order
  const [hiddenOrders, setHiddenOrders] = useState({}); // State lưu trạng thái ẩn/hiện đơn hàng

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('https://restaurant-order-app8.onrender.com/api/orders');
        setOrders(data);
  
        // Khởi tạo trạng thái checkbox mặc định là false
        const initialStatus = {};
        data.forEach(order => {
          initialStatus[order._id] = { sent: false, paid: false };
        });
        setOrderStatus(initialStatus);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
  
    // Lấy đơn hàng ban đầu khi trang load
    fetchOrders();
  
    // Set polling để kiểm tra mỗi 5 giây
    const interval = setInterval(fetchOrders, 5000); // 5000ms = 5s
    return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
  }, []);
  

  const handleCheckboxChange = (orderId, field) => {
    const updatedStatus = {
      ...orderStatus,
      [orderId]: {
        ...orderStatus[orderId],
        [field]: !orderStatus[orderId][field], // Đảo ngược trạng thái checkbox
      },
    };
    setOrderStatus(updatedStatus);

    // Kiểm tra nếu cả hai checkbox đều được chọn thì ẩn đơn hàng
    const isSentAndPaid = updatedStatus[orderId].sent && updatedStatus[orderId].paid;
    setHiddenOrders({
      ...hiddenOrders,
      [orderId]: isSentAndPaid,
    });
  };

  const handleShowOrder = (orderId) => {
    setHiddenOrders({
      ...hiddenOrders,
      [orderId]: false, // Hiển thị lại đơn hàng
    });
  };

  return (
    <div className="admin-container">
      <h1>Khách gọi món</h1>
      {orders.length > 0 ? (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Số bàn</th>
              <th>Các món</th>
              <th>Ghi chú</th>
              <th>Thời gian đặt món</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              !hiddenOrders[order._id] && (
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
                  <td>
                    <div className="checkbox-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={orderStatus[order._id]?.sent || false}
                          onChange={() => handleCheckboxChange(order._id, 'sent')}
                        />
                        Đã gửi khách
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={orderStatus[order._id]?.paid || false}
                          onChange={() => handleCheckboxChange(order._id, 'paid')}
                        />
                        Khách đã thanh toán
                      </label>
                    </div>
                    {hiddenOrders[order._id] && (
                      <button className="show-btn" onClick={() => handleShowOrder(order._id)}>
                        <img src="/path/to/eye-icon.png" alt="Hiển thị đơn hàng" /> {/* Đổi đường dẫn hình con mắt */}
                      </button>
                    )}
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
}

export default Admin;
