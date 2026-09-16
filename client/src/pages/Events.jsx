import { useEffect, useState } from "react";
import API from "../api";

function Events() {
    const [events, setEvents] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("events-cache") || "[]");
        } catch {
            return [];
        }
    });
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isOffline, setIsOffline] = useState(false);

    const getEvents = async () => {
        try {
            const res = await API.get("/events");

            setEvents(res.data);
            localStorage.setItem("events-cache", JSON.stringify(res.data));
            setIsOffline(false);
        } catch (error) {
            console.error("EVENTS ERROR:", error);
            setIsOffline(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getEvents();
    }, []);

    const registerEvent = async (eventId) => {
        try {
            const token = localStorage.getItem("token");

            await API.post(
                "/registrations",
                { eventId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Event registration successful!");
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Registration failed"
            );
        }
    };

    const filteredEvents = events.filter((event) =>
        event.title
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <div className="page">

            <h2>College Events</h2>

            {isOffline && events.length > 0 && (
                <p className="status-message">
                    Showing the last saved events. Reconnect the backend to refresh the list.
                </p>
            )}

            <input
                className="search"
                type="text"
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="event-grid">

                {isLoading && events.length === 0 ? (
                    <p>Loading events...</p>
                ) : filteredEvents.length === 0 ? (
                    <p>No events found.</p>
                ) : (
                    filteredEvents.map((event) => (
                        <div
                            className="event-card"
                            key={event._id}
                        >

                            {event.poster ? (
                                <img
                                    src={event.poster}
                                    alt={event.title}
                                    className="event-poster"
                                />
                            ) : (
                                <div className="poster-placeholder">
                                    College Event
                                </div>
                            )}

                            <h3>{event.title}</h3>

                            <p>{event.description}</p>

                            <p>
                                📅 <b>Date:</b>{" "}
                                {new Date(event.date).toLocaleDateString()}
                            </p>

                            <p>
                                📍 <b>Venue:</b> {event.venue}
                            </p>

                            <p>
                                👥 <b>Capacity:</b> {event.capacity}
                            </p>

                            <button
                                onClick={() => registerEvent(event._id)}
                            >
                                Register
                            </button>

                        </div>
                    ))
                )}

            </div>

        </div>
    );
}

export default Events;