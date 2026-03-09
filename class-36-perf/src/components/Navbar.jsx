import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav style={{
            display: "flex",
            gap: "8px",
            position: "fixed",
            top: 0,
        }}>
            <div>
                <Link to="/">Home</Link>
            </div>
            <div>
                <Link to="/about">About</Link>
            </div>
            <div>
                <Link to="/contact">Contact</Link>
            </div>
        </nav>
    );
};

export default Navbar;