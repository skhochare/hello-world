const ProductList = ({ products }) => {

    const handleAddToCart = (productName) => {
        console.log(productName);
    };

    return (
        <div style={{ maxWidth: "400px", margin: "auto", textAlign: "center" }}>
            <h2>Product List</h2>
            <ul>
                {products.map(product => (
                    <li key={product.id} style={{ marginBottom: "10px", display: "flex", gap: "8px" }}>
                        <p>{product.name} - {product.price}</p>
                        <button onClick={() => handleAddToCart(product.name)}>
                            Add to Cart
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductList;