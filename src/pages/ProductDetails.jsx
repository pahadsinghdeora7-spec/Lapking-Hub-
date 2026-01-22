import { useState } from "react";
import { useParams } from "react-router-dom";
import products from "../data/dummyProducts";
import "./ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  const stock = product?.stock || 50;

  const [qty, setQty] = useState(1);

  if (!product) {
    return <div className="pd-not-found">Product not found</div>;
  }

  const handleQtyChange = (value) => {
    if (value === "") {
      setQty("");
      return;
    }

    let num = Number(value);

    if (isNaN(num)) return;
    if (num < 1) num = 1;
    if (num > stock) num = stock;

    setQty(num);
  };

  return (
    <div className="pd-page">

      {/* IMAGE */}
      <div className="pd-image-box">
        <img src={product.image} alt={product.name} />
      </div>

      {/* INFO */}
      <h1 className="pd-title">{product.name}</h1>

      <div className="pd-price">₹{product.price}</div>

      <div className="pd-stock">
        ✔ In Stock ({stock} available)
      </div>

      {/* QUANTITY */}
      <div className="pd-qty-row">
        <button
          onClick={() => qty > 1 && setQty(qty - 1)}
        >
          −
        </button>

        <input
          type="number"
          value={qty}
          onChange={(e) =>
            handleQtyChange(e.target.value)
          }
        />

        <button
          onClick={() =>
            qty < stock && setQty(qty + 1)
          }
        >
          +
        </button>
      </div>

      {/* ACTION BUTTONS */}
      <button className="pd-buy-btn">
        Buy Now
      </button>

      <button className="pd-cart-btn">
        Add to Cart
      </button>

      <a
        className="pd-wa-btn"
        href={`https://wa.me/919873670361?text=Product:%20${product.name}%0AQty:%20${qty}%0APrice:%20₹${product.price}`}
        target="_blank"
        rel="noreferrer"
      >
        Order on WhatsApp
      </a>

      {/* DESCRIPTION */}
      <div className="pd-desc-box">
        <h3>Description</h3>
        <p>
          High quality laptop spare part. Tested
          and compatible with supported models.
          Suitable for wholesale and retail use.
        </p>
      </div>

      {/* RELATED PRODUCTS */}
      <h3 className="pd-related-title">
        Related Products
      </h3>

      <div className="pd-related-list">
        {products
          .filter(
            (p) =>
              p.category === product.category &&
              p.id !== product.id
          )
          .slice(0, 6)
          .map((item) => (
            <div
              key={item.id}
              className="pd-related-card"
            >
              <img
                src={item.image}
                alt={item.name}
              />
              <div className="pd-related-info">
                <p>{item.name}</p>
                <span>₹{item.price}</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
          }
