import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addTOCart } from '../redux/CardSlice.js'
import '../styles/Productdetails.css'

const Productdetails = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const [product, setProduct] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [added, setAdded] = useState(false)

    useEffect(() => {
        const fetchProduct = async () => {
            setIsLoading(true)
            setError('')

            try {
                const response = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/products/${id}`)
                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.message || 'Product not found.')
                }

                setProduct(data)
            } catch (requestError) {
                setError(requestError.message || 'Unable to load this product.')
            } finally {
                setIsLoading(false)
            }
        }

        fetchProduct()
    }, [id])

    const handleAddToCart = () => {
        if (product) {
            dispatch(addTOCart({
                _id: product._id,
                name: product.name,
                price: product.price,
                imageURL: product.imageURL,
                quantity
            }))
            setAdded(true)
        }
    }

    if (isLoading) {
        return <div className="product-details-state">Loading product...</div>
    }

    if (error || !product) {
        return (
            <div className="product-details-state" role="alert">
                <h1>We could not find that product.</h1>
                <p>{error}</p>
                <Link className="product-details__back" to="/">Back to shopping</Link>
            </div>
        )
    }

    const stock = Number(product.stock) || 0
    const isAvailable = stock > 0

    return (
        <main className="product-details">
            <nav className="product-details__breadcrumbs" aria-label="Breadcrumb">
                <Link to="/">Home</Link>
                <span aria-hidden="true">/</span>
                <Link to="/">Products</Link>
                <span aria-hidden="true">/</span>
                <span aria-current="page">{product.name}</span>
            </nav>
            <div className="product-details__layout">
                <div className="product-details__image-wrap">
                    <img className="product-details__image" src={product.imageURL} alt={product.name} />
                </div>

                <section className="product-details__content" aria-labelledby="product-title">
                    <p className="product-details__category">{product.categories}</p>
                    <h1 id="product-title">{product.name}</h1>
                    <p className="product-details__price">${Number(product.price).toFixed(2)}</p>
                    <p className="product-details__rating">
                        <span aria-hidden="true">&#9733;</span> {Number(product.ratings || 0).toFixed(1)} ({product.numberOfReviews || 0} reviews)
                    </p>
                    <p className="product-details__description">{product.description}</p>

                    <div className={`product-details__stock ${isAvailable ? '' : 'is-unavailable'}`}>
                        {isAvailable ? `${stock} available` : 'Currently out of stock'}
                    </div>

                    {isAvailable && (
                        <div className="product-details__purchase">
                            <label htmlFor="quantity">Quantity</label>
                            <input id="quantity" type="number" min="1" max={stock} value={quantity} onChange={(event) => setQuantity(Math.min(stock, Math.max(1, Number(event.target.value) || 1)))} />
                            <button className="product-details__button" type="button" onClick={handleAddToCart}>
                                {added ? 'Added to cart' : 'Add to cart'}
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </main>
    )
}

export default Productdetails
