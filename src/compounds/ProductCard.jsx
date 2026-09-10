import React from 'react'
import { Link } from 'react-router-dom'
import './ProductsCards.css'

const ProductCard = ({ product }) => {
    return (
        <article className="product-card">
            <img src={product.imageURL} alt={product.name} />
            <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-price">${Number(product.price).toFixed(2)}</p>
                <Link className="product-link" to={`/product/${product._id}`}>
                    View Details
                </Link>
            </div>
        </article>
    )
}

export default ProductCard
