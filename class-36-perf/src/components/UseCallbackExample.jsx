import { useState, useCallback } from 'react';

const ItemList = () => {
    const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3']);

    const removeItem = useCallback((itemToRemove) => {
        setItems((prevItems) => prevItems.filter(item => item !== itemToRemove));
    }, []);

    return (
        <div>
            {items.map((item) =>(
                <div key={item}>
                    {item}
                    <button onClick={() => removeItem(item)}>Remove</button>
                </div>
            ))}
        </div>
    );
}

export default ItemList;