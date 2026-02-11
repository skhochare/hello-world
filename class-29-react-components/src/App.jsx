import './App.css';

// Components
import Counter from './component/Counter';
import UserCard from './component/UserCard';
import ProductList from './component/ProductList';
import Todo from './component/Todo';

function App() {
  const userInfo = {
    name: "Kunal Shah",
    email: "kunal@cred.com",
    age: 35,
    location: "Bangalore",
    picture: "https://assets.fp.scaler.com/seo/_next/static/media/Kunal.a0fb4a3c.webp"
  };

  const Products = [
    { id: 1, name: "Laptop", price: 1200 },
    { id: 2, name: "Mouse", price: 1200 },
    { id: 3, name: "Monitor", price: 1200 },
    { id: 4, name: "Desktop", price: 1200 },
    { id: 5, name: "Airpods", price: 1200 },
  ];
  return (
    <div>
      {/* <Counter initialCount={0} /> */}
      {/* <UserCard user={userInfo} /> */}
      {/* <ProductList products={Products} /> */}
      <Todo />
    </div>
  )
}

export default App
