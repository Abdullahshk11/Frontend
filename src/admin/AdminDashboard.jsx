import React, { useEffect, useState, useContext } from 'react'
import { authContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'


const AdminDashboard = () => {
    const { user } = useContext(authContext)
    const navigate = useNavigate()
    const [stats, setStats] = useState(null)
    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/')
            return
        }
        fetch('/api/analytic', { headers: { Authorization: `Bearer ${user.token}` } })
            .then(async (response) => {
                if (response.ok) setStats(await response.json())
            })
            .catch((error) => console.error(error))
    }, [user, navigate])
    if (!user || user.role !== 'admin') return null

    return (
        <main className="admin-page">
            <section className="profile-hero">
                <p className="admin-kicker">Store control</p>
                <h1>Admin dashboard</h1>
                <p>Manage your catalog and keep orders moving from one place.</p>
            </section>
            <section className="admin-grid" aria-label="Admin sections">
                <Link className="admin-panel admin-nav-card" to="/admin/products">
                    <span className="admin-card-icon" aria-hidden="true">+</span>
                    <h2>Manage products</h2>
                    <p>Add new products, see the catalog, and remove products that are no longer available.</p>
                    <span className="admin-card-link">Open products -&gt;</span>
                </Link>
                <Link className="admin-panel admin-nav-card" to="/admin/orders">
                    <span className="admin-card-icon" aria-hidden="true">[ ]</span>
                    <h2>See all orders</h2>
                    <p>Review every customer order, its status, and the customer details.</p>
                    <span className="admin-card-link">Open orders -&gt;</span>
                </Link>
            </section>
            <section className="admin-stats" aria-label="Store summary">
                <div><strong>{stats?.totalProducts ?? '-'}</strong><span>Products</span></div>
                <div><strong>{stats?.totalOrders ?? '-'}</strong><span>Orders</span></div>
                <div><strong>{stats ? `$${Number(stats.totalRevenue).toFixed(2)}` : '-'}</strong><span>Revenue</span></div>
            </section>
        </main>
    )
}

export default AdminDashboard
