import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authContext } from '../context/AuthContext.jsx'
import '../styles/Profile.css'
import '../styles/Admin.css'

const emptyForm = { name: '', description: '', price: '', category: '', stock: '', image: null }

const AdminProducts = () => {
    const { user } = useContext(authContext)
    const navigate = useNavigate()
    const [products, setProducts] = useState([])
    const [form, setForm] = useState(emptyForm)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const loadProducts = async () => {
        const response = await fetch('/api/products')
        if (!response.ok) throw new Error('Unable to load products.')
        setProducts(await response.json())
    }

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/', { replace: true })
            return
        }
        loadProducts().catch((requestError) => setError(requestError.message))
    }, [navigate, user])

    if (!user || user.role !== 'admin') return null

    const updateField = (event) => {
        const { name, value, files } = event.target
        setForm((current) => ({ ...current, [name]: files ? files[0] : value }))
    }

    const createProduct = async (event) => {
        event.preventDefault()
        setError('')
        setMessage('')
        const body = new FormData()
        Object.entries(form).forEach(([key, value]) => value !== '' && value !== null && body.append(key, value))
        try {
            const response = await fetch('/api/products', { method: 'POST', headers: { Authorization: `Bearer ${user.token}` }, body })
            const data = await response.json()
            if (!response.ok) throw new Error(data.message || 'Unable to create product.')
            setForm(emptyForm)
            setMessage('Product added successfully.')
            await loadProducts()
        } catch (requestError) {
            setError(requestError.message)
        }
    }

    const deleteProduct = async (id) => {
        if (!window.confirm('Delete this product?')) return
        const response = await fetch(`/api/products/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${user.token}` } })
        if (response.ok) setProducts((current) => current.filter((product) => product._id !== id))
        else setError('Unable to delete product.')
    }

    return (
        <main className="admin-page">
            <Link className="profile-link" to="/admin">&lt;- Dashboard</Link>
            <section className="profile-hero admin-subpage-heading"><p className="admin-kicker">Catalog</p><h1>Manage products</h1><p>Add products or remove items from your store.</p></section>
            <div className="admin-grid">
                <section className="admin-panel"><h2>Add product</h2>
                    <form className="admin-form" onSubmit={createProduct}>
                        <label>Name<input name="name" value={form.name} onChange={updateField} required /></label>
                        <label>Description<textarea name="description" value={form.description} onChange={updateField} required /></label>
                        <label>Price<input name="price" type="number" min="0" step="0.01" value={form.price} onChange={updateField} required /></label>
                        <label>Category<input name="category" value={form.category} onChange={updateField} required /></label>
                        <label>Stock<input name="stock" type="number" min="0" value={form.stock} onChange={updateField} required /></label>
                        <label>Image<input name="image" type="file" accept="image/*" onChange={updateField} /></label>
                        <button className="admin-button" type="submit">Add product</button>
                    </form>
                    {message && <p className="admin-success">{message}</p>}{error && <p className="admin-error" role="alert">{error}</p>}
                </section>
                <section className="admin-panel"><h2>All products <span className="admin-count">{products.length}</span></h2>
                    <div className="admin-list">{products.map((product) => <article className="admin-row" key={product._id}><div><strong>{product.name}</strong><span>${Number(product.price).toFixed(2)} · Stock: {product.stock}</span></div><button className="admin-delete" type="button" onClick={() => deleteProduct(product._id)}>Delete</button></article>)}{products.length === 0 && <p className="admin-muted">No products found.</p>}</div>
                </section>
            </div>
        </main>
    )
}

export default AdminProducts