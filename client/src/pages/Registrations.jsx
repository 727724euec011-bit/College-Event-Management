import { useEffect, useState } from "react";
import API from "../api";

function MyRegistrations() {
    const [registrations, setRegistrations] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("registrations-cache") || "[]");
        } catch {
            return [];
        }
    });
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        getMyRegistrations();
    }, []);

    const getMyRegistrations = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await API.get("/registrations/my", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setRegistrations(res.data);
        } catch (error) {
            console.error(error);
            setIsOffline(true);
        }
    };

    return (
        <div className="page">

            <h2>My Registered Events</h2>

            {isOffline && registrations.length > 0 && (
                <p className="status-message">
                    Showing registrations saved in this browser. Reconnect the backend to sync them.
                </p>
            )}

            {registrations.length === 0 ? (
                <div className="empty-box">
                    <p>You have not registered for any events.</p>
                </div>
            ) : (
                <div className="event-grid">

                    {registrations.map((registration) => (
                        <div
                            className="event-card"
                            key={registration._id}
                        >

                            {registration.eventId ? (
                                <>
                                    <h3>
                                        {registration.eventId.title}
                                    </h3>

                                    <p>
                                        📅 <b>Date:</b>{" "}
                                        {new Date(
                                            registration.eventId.date
                                        ).toLocaleDateString()}
                                    </p>

                                    <p>
                                        📍 <b>Venue:</b>{" "}
                                        {registration.eventId.venue}
                                    </p>

                                    <p>
                                        🎟️ <b>Status:</b>{" "}
                                        {registration.attendance}
                                    </p>
                                </>
                            ) : (
                                <p>
                                    Event is no longer available.
                                </p>
                            )}

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
}

export default MyRegistrations;