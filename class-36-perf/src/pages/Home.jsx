import LargeArraySum from '../components/UseMemoExample';
import ItemList from '../components/UseCallbackExample';

const Home = () => {
    return (
        <div>
            Home Component
            <LargeArraySum />
            <ItemList />
        </div>
    );
};

export default Home;