# Booking App Project

## Structure
- `auth-service`: user registration/login with MongoDB and JWT
- `resource-service`: room listings
- `booking-service`: reservation creation, availability check, cancellation, RabbitMQ notification
- `notification-service`: receives `booking.confirmed` events and logs simulated emails
- `frontend-react`: React SPA with login/register, room list, booking, bookings list
- `docker-compose.yml`: includes MongoDB, RabbitMQ, services, frontend, nginx

## Run
1. `docker compose up --build`
2. Open `http://localhost:8080`
3. Auth API: `http://localhost:3001`
4. Booking API: `http://localhost:3003`

## Notes
- Use `JWT_SECRET` in `.env` or compose env for production
- `notification-service` logs booking confirmations from RabbitMQ
- `booking-service` checks room availability by date overlap
