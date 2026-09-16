import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Events from "./pages/Events";
import MyRegistrations from "./pages/Registrations";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
    const token = localStorage.getItem("token");
    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/";
    };

    return (
        <BrowserRouter>

            <nav>
                <Link to="/events">
                    Events
                </Link>

                {" | "}

                {token && (
                    <>
                        <Link to="/my-registrations">
                            My Registrations
                        </Link>

                        {" | "}
                    </>
                )}

                {user?.role === "admin" && (
                    <>
                        <Link to="/admin">
                            Admin
                        </Link>

                        {" | "}
                    </>
                )}

                {!token ? (
                    <>
                        <Link to="/">
                            Login
                        </Link>

                        {" | "}

                        <Link to="/register">
                            Register
                        </Link>
                    </>
                ) : (
                    <button onClick={logout}>
                        Logout
                    </button>
                )}
            </nav>

            <hr />

            <Routes>

                <Route
                    path="/"
                    element={
                        token ? (
                            user?.role === "admin" ? (
                                <Navigate to="/admin" />
                            ) : (
                                <Navigate to="/events" />
                            )
                        ) : (
                            <Login />
                        )
                    }
                />

                <Route
                    path="/register"
                    element={
                        token ? (
                            <Navigate to="/events" />
                        ) : (
                            <Register />
                        )
                    }
                />

                <Route
                    path="/events"
                    element={<Events />}
                />

                <Route
                    path="/my-registrations"
                    element={
                        token ? (
                            <MyRegistrations />
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />

                <Route
                    path="/admin"
                    element={
                        user?.role === "admin" ? (
                            <AdminDashboard />
                        ) : (
                            <Navigate to="/events" />
                        )
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;