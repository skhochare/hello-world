import { Navigate, Link, useNavigate  } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div>
            <header style={{
                backgroundColor: "#111827",
                padding: "16px 24px",
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "sticky",
                top: 0,
                zIndex: 10
            }}>
                <div style={{ fontSize: 18, fontWeight: 600 }}>
                    <Link
                        to="/"
                        style={{
                            color: "white",
                            textDecoration: "none",
                            fontWeight: 500
                        }}
                    >Book My Show</Link>
                </div>
                <nav style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <Link
                        to="/admin"
                        style={{
                            color: "white",
                            textDecoration: "none",
                            fontWeight: 500
                        }}
                    >Admin</Link>
                    <Link
                        to="/partner"
                        style={{
                            color: "white",
                            textDecoration: "none",
                            fontWeight: 500
                        }}
                    >Partner</Link>
                    <button onClick={handleLogout} style={{
                        background: "transparent",
                        border: "1px solid rgba(255, 255, 255, 0.35)",
                        color: "white",
                        padding: "6px 12px",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontWeight: 500
                    }}>
                        Logout
                    </button>
                </nav>
            </header>

            <main style={{ marginTop: "77px" }}>
                {children}
            </main>
        </div>
    );
}