import { useEffect, useState } from "react";
import API from "../api";

function AdminDashboard() {
    const [events, setEvents] = useState([]);
    const [registrations, setRegistrations] = useState([]);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [venue, setVenue] = useState("");
    const [poster, setPoster] = useState("");
    const [capacity, setCapacity] = useState("");

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const token = localStorage.getItem("token");

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const eventRes = await API.get("/events");
            const registrationRes = await API.get(
                "/registrations/all",
                config
            );

            setEvents(eventRes.data);
            setRegistrations(registrationRes.data);
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to load dashboard"
            );
        }
    };

    const createEvent = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            await API.post(
                "/events",
                {
                    title,
                    description,
                    date,
                    venue,
                    poster,
                    capacity
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Event created successfully!");

            setTitle("");
            setDescription("");
            setDate("");
            setVenue("");
            setPoster("");
            setCapacity("");

            getData();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to create event"
            );
        }
    };

    const deleteEvent = async (id) => {
        try {
            const token = localStorage.getItem("token");

            await API.delete(`/events/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert("Event deleted successfully!");

            getData();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to delete event"
            );
        }
    };

    const editEvent = async (event) => {
        const newTitle = prompt(
            "Enter new event title:",
            event.title
        );

        if (!newTitle) return;

        try {
            const token = localStorage.getItem("token");

            await API.put(
                `/events/${event._id}`,
                {
                    title: newTitle
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Event updated successfully!");

            getData();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to update event"
            );
        }
    };

    return (
        <div className="page">

            <h2>Admin Dashboard</h2>

            <h3>Create Event</h3>

            <form onSubmit={createEvent}>

                <input
                    type="text"
                    placeholder="Event Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <br />
                <br />

                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />

                <br />
                <br />

                <input
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />

                <br />
                <br />

                <input
                    type="text"
                    placeholder="Venue"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    required
                />

                <br />
                <br />

                <input
                    type="text"
                    placeholder="Poster Image URL"
                    value={poster}
                    onChange={(e) => setPoster(e.target.value)}
                />

                <br />
                <br />

                <input
                    type="number"
                    placeholder="Capacity"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    required
                />

                <br />
                <br />

                <button type="submit">
                    Create Event
                </button>

            </form>

            <hr />

            <h3>Events</h3>

            <div className="event-grid">

                {events.length === 0 ? (
                    <p>No events available.</p>
                ) : (
                    events.map((event) => (
                        <div
                            className="event-card"
                            key={event._id}
                        >

                            {event.poster && (
                                <img
                                    src={event.poster}
                                    alt={event.title}
                                    className="event-poster"
                                />
                            )}

                            <h4>{event.title}</h4>

                            <p>
                                Date:{" "}
                                {new Date(
                                    event.date
                                ).toLocaleDateString()}
                            </p>

                            <p>
                                Venue: {event.venue}
                            </p>

                            <button
                                onClick={() =>
                                    editEvent(event)
                                }
                            >
                                Edit
                            </button>

                            {" "}

                            <button
                                onClick={() =>
                                    deleteEvent(event._id)
                                }
                            >
                                Delete
                            </button>

                        </div>
                    ))
                )}

            </div>

            <h3>Registered Students</h3>

            {registrations.length === 0 ? (
                <p>No registrations found.</p>
            ) : (
                registrations.map((registration) => (
                    <div
                        className="event-card"
                        key={registration._id}
                    >

                        <p>
                            <b>Student:</b>{" "}
                            {registration.userId?.name ||
                                "Unknown Student"}
                        </p>

                        <p>
                            <b>Email:</b>{" "}
                            {registration.userId?.email ||
                                "Unknown Email"}
                        </p>

                        <p>
                            <b>Event:</b>{" "}
                            {registration.eventId?.title ||
                                "Event Deleted"}
                        </p>

                        <p>
                            <b>Status:</b>{" "}
                            {registration.attendance}
                        </p>

                    </div>
                ))
            )}

        </div>
    );
}

export default AdminDashboard;