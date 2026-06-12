import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken, getUser } from '../utils/auth';

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');

  const token = getToken();
  const user = getUser();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_RESOURCE_URL || 'http://localhost:3002'}/api/rooms`);
        setRooms(response.data);
        if (response.data.length) setSelectedRoom(response.data[0].id);
      } catch (error) {
        setMessage('Impossible de charger les salles');
      }
    };
    fetchRooms();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) {
      setMessage('Utilisateur non authentifié');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_BOOKING_URL || 'http://localhost:3003'}/api/bookings`, {
        roomId: selectedRoom,
        startDate,
        endDate
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Réservation créée avec succès');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Erreur de réservation');
    }
  };

  return (
    <div>
      <h2>Liste des salles</h2>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>{room.name} - {room.pricePerHour}€/h</li>
        ))}
      </ul>
      <h3>Réserver une salle</h3>
      <form onSubmit={handleSubmit}>
        <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)}>
          {rooms.map((room) => (
            <option value={room.id} key={room.id}>{room.name}</option>
          ))}
        </select>
        <label>Début</label>
        <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        <label>Fin</label>
        <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        <button type="submit">Réserver</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Rooms;
