import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authContext } from '../context/AuthContext.jsx'
import '../styles/Profile.css'
import '../styles/Admin.css'

const AdminOrders = () => {
    const { user } = useContext(authContext)
    const navigate = useNavigate()
    const [orders, setOrders] = useState([])
    const [error, setError] = useState('')
    const [updatingOrder, setUpdatingOrder] = useState('')

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/', { replace: true })
            return
        }
        fetch(import.meta.env.VITE_BACKEND_URL + '/api/orders', { headers: { Authorization: `Bearer ${user.token}` } })
            .then(async (response) => {
                const data = await response.json()
                if (!response.ok) throw new Error(data.message || 'Unable to load orders.')
                setOrders(data)
            })
            .catch((requestError) => setError(requestError.message))
    }, [navigate, user])

    if (!user || user.role !== 'admin') return null

    const updateOrderStatus = async (orderId, status) => {
        setError('')
        setUpdatingOrder(orderId)
        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            })
            const data = await response.json()
            if (!response.ok) throw new Error(data.message || 'Unable to update order status.')
            setOrders((current) => current.map((order) => order._id === orderId ? { ...order, status: data.order.status } : order))
        } catch (requestError) {
            setError(requestError.message)
        } finally {
            setUpdatingOrder('')
        }
    }

    return (
        <main className="admin-page">
            <Link className="profile-link" to="/admin">&lt;- Dashboard</Link>
            <section className="profile-hero admin-subpage-heading"><p className="admin-kicker">Fulfillment</p><h1>All orders</h1><p>Review complete customer orders and update their current status.</p></section>
            <section className="admin-panel"><div className="profile-section-heading"><h2>Order list</h2><span>{orders.length} total</span></div>
                {error && <p className="admin-error" role="alert">{error}</p>}
                <div className="admin-list">
                    {orders.map((order) => (
                        <details className="admin-order" key={order._id}>
                            <summary className="admin-order-summary">
                                <div><strong>Order #{order._id.slice(-6).toUpperCase()}</strong><span>{order.user?.name || order.address?.fullName || 'Customer'} · {new Date(order.createdAt).toLocaleDateString()}</span></div>
                                <div className="admin-order-total"><strong>${Number(order.totalAmount).toFixed(2)}</strong><span className={`profile-status profile-status--${String(order.status).toLowerCase()}`}>{order.status}</span></div>
                            </summary>
                            <div className="admin-order-details">
                                <div className="admin-detail-grid">
                                    <div><strong>Customer</strong><span>{order.user?.name || order.address?.fullName || 'Not provided'}</span><span>{order.user?.email || 'No email available'}</span></div>
                                    <div><strong>Delivery address</strong><span>{order.address?.fullName}</span><span>{order.address?.phoneNumber || 'No phone number'}</span><span>{order.address?.street}, {order.address?.city}</span><span>{order.address?.postalCode}</span></div>
                                    <div><strong>Payment</strong><span>{order.paymentId || 'Not provided'}</span></div>
                                    <div><strong>Placed</strong><span>{new Date(order.createdAt).toLocaleString()}</span></div>
                                </div>
                                <div className="admin-items"><strong>Items</strong>{order.items?.map((item, index) => <div className="admin-item" key={`${order._id}-${item.productId?._id || index}`}><span>{item.productId?.name || 'Product no longer available'} × {item.quantity}</span><span>${(Number(item.productId?.price || 0) * item.quantity).toFixed(2)}</span></div>)}</div>
                                <label className="admin-status-field">Update status<select className="admin-status-select" value={order.status} disabled={updatingOrder === order._id} onChange={(event) => updateOrderStatus(order._id, event.target.value)}><option value="Pending">Pending</option><option value="shipped">Shipped</option><option value="Delivered">Delivered</option></select></label>
                            </div>
                        </details>
                    ))}
                    {!error && orders.length === 0 && <p className="admin-muted">No orders found.</p>}
                </div>
            </section>
        </main>
    )
}

export default AdminOrders