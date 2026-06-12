import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken, getUser } from '../utils/auth';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState('');
  const token = getToken();
  const user = getUser();

  const fetchBookings = async () => {
    if (!user) {
      setMessage('Utilisateur non authentifié');
      return;
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_BOOKING_URL || 'http://localhost:3003'}/api/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data);
    } catch (error) {
      setMessage('Impossible de charger les réservations');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BOOKING_URL || 'http://localhost:3003'}/api/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Réservation annulée');
      fetchBookings();
    } catch (error) {
      setMessage('Erreur lors de l annulation');
    }
  };

  return (
    <div>
      <h2>Mes réservations</h2>
      {message && <p>{message}</p>}
      <ul>
        {bookings.map((booking) => (
          <li key={booking._id}>
            {booking.roomId} du {new Date(booking.startDate).toLocaleString()} au {new Date(booking.endDate).toLocaleString()} - {booking.totalCost}€ - {booking.status}
            {booking.status === 'confirmed' && <button onClick={() => handleCancel(booking._id)}>Annuler</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyBookings;
