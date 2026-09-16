import { useEffect, useState } from "react";
import API from "../api";

function Events() {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        getEvents();
    }, []);

    const getEvents = async () => {
        try {
            const res = await API.get("/events");
            setEvents(res.data);
        } catch (error) {
            alert("Failed to load events");
        }
    };

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
        event.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="page">

            <h2>College Events</h2>

            <input
                className="search"
                type="text"
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="event-grid">

                {filteredEvents.map((event) => (
                    <div className="event-card" key={event._id}>

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
                ))}

            </div>

        </div>
    );
}

export default Events;