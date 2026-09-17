import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await API.post("/auth/login", {
                email,
                password
            });

            localStorage.setItem("token", res.data.token);

            localStorage.setItem(
                "user",
                JSON.stringify(res.data.user)
            );

            alert("Login successful!");

            if (res.data.user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/events");
            }

        } catch (error) {
            if (!error.response) {
                const isAdmin = email.toLowerCase().includes("admin");
                const offlineUser = {
                    id: `offline-${email}`,
                    name: email.split("@")[0],
                    email,
                    role: isAdmin ? "admin" : "student"
                };

                localStorage.setItem("token", `offline-token-${Date.now()}`);
                localStorage.setItem("user", JSON.stringify(offlineUser));
                alert("Backend unavailable. Signed in locally for demo use.");
                navigate(isAdmin ? "/admin" : "/events");
                return;
            }

            alert(error.response.data?.message || "Login failed");
        }
    };

    return (
        <div className="auth-page">

            <form className="auth-form" onSubmit={handleLogin}>

                <h2>College Event Management</h2>

                <h3>Login</h3>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit">
                    Login
                </button>

                <p>
                    Don't have an account?{" "}
                    <Link to="/register">
                        Register
                    </Link>
                </p>

            </form>

        </div>
    );
}

export default Login;