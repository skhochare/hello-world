import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            HOME PAGE
            <Link to="/about">Go to About Page</Link>
        </div>
    )
};

export default Home;