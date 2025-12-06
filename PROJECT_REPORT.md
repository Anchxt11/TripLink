# TripLink Project Report

---

# Page 1: Introduction

## 1.1 Project Title
**TripLink: Share Rides. Save Money. Travel Smarter.**

## 1.2 Abstract
TripLink is a web-based carpooling platform designed to connect drivers with empty seats to passengers traveling along the same route. In response to rising fuel costs and environmental concerns, TripLink offers a sustainable and cost-effective travel alternative. The platform facilitates the entire ridesharing lifecycle, including user registration, ride creation, searching, and booking, thereby providing a seamless and efficient experience for daily commuters and travelers.

## 1.3 Problem Statement
Modern commuting often relies heavily on single-occupancy vehicles, which contributes significantly to traffic congestion, high fuel consumption, and increased carbon emissions. While public transport exists, it may not always offer the necessary convenience or comfort, and private cab services can be prohibitively expensive. TripLink addresses these issues by optimizing existing vehicle usage, creating a community-driven solution that benefits both drivers and passengers.

## 1.4 Objectives
The primary goal of TripLink is to create a sustainable ecosystem for travelers. The key objectives include:
*   **Cost Efficiency**: Enabling travelers to split fuel expenses, making travel more affordable.
*   **Sustainability**: Reducing the number of cars on the road to lower the collective carbon footprint.
*   **Convenience**: Providing a user-friendly interface for finding verified rides and managing bookings.
*   **Safety**: Implementing user verification and profile management to build trust within the community.

## 1.5 Scope
The current scope of the project encompasses a fully functional web application. Users can sign up, create driver profiles, and publish ride offers. Passengers can search for available rides based on origin and destination, and book seats accordingly. Future iterations are planned to include advanced features such as real-time map tracking and integrated payment gateways.

---

# Page 2: System Requirements

## 2.1 Functional Requirements
The system is designed around three core user roles, each with specific functionalities:

*   **User Module**: Handles the foundational aspects of the application. Users can register and login securely. It also allows for profile management, where users can update personal details, and interface customization through dark/light mode toggles.
*   **Driver Module**: Focuses on the supply side of the platform. Users can verify their status by submitting license and vehicle details. Once verified, they can publish rides by specifying routes, schedules, and pricing, and manage their active listings.
*   **Passenger Module**: tailored for those seeking rides. It enables users to search for rides based on specific criteria like location and date, book available seats, and view the status of their current bookings.

## 2.2 Non-Functional Requirements
The application is built with a strong focus on quality attributes:
*   **Usability**: The interface is intuitive and responsive, ensuring a seamless experience across mobile and desktop devices.
*   **Performance**: The backend is optimized to handle concurrent ride searches and bookings efficiently.
*   **Security**: Data protection is prioritized, with planned implementation for password hashing and secure session management.

## 2.3 Technology Stack
The project utilizes a modern and robust technology stack:
*   **Frontend**: HTML5 for semantic structure, CSS3 for responsive styling, and Vanilla JavaScript for dynamic interactions.
*   **Backend**: Python with Django and Django REST Framework (DRF) for a powerful and scalable API.
*   **Database**: SQLite for efficient development and testing storage.

---

# Page 3: System Design

## 3.1 System Architecture
TripLink follows the **Model-View-Template (MVT)** architectural pattern standard in Django, adapted for a RESTful API approach. The Frontend acts as the client, handling user interactions and sending HTTP requests. The API Layer, consisting of Views and Serializers, processes these requests, validates data, and interacts with the Database Layer, which is responsible for storing and retrieving persistent data.

## 3.2 Database Schema
The database is structured around four primary entities that define the relationships within the system:

1.  **Users Table**: Stores essential user information including full name, email, phone number, and password hash.
2.  **Drivers Table**: Links to the User entity. It stores specific driver verification details such as license numbers, vehicle make/model, and plate numbers.
3.  **Rides Table**: Represents the core offering. It links to a Driver and contains route details (origin, destination), timing, price, and seat availability.
4.  **Bookings Table**: Manages the transaction between a Passenger and a Ride. It tracks the number of seats reserved and the current status of the booking.

---

# Page 4: Implementation

## 4.1 Backend Implementation
The backend logic is implemented using **Django REST Framework**, providing a clean separation between data and presentation.
*   **Serializers**: These are used to transform complex database models (User, Driver, Ride) into JSON formats suitable for the frontend.
*   **API Endpoints**: Key endpoints manage the data flow:
    *   `/register` & `/login`: Handle user authentication.
    *   `/rides` (GET): Handles search queries with filters.
    *   `/rides` (POST): Allows drivers to create new ride entries.

## 4.2 Frontend Implementation
The frontend is designed as a Multi-Page Application (MPA) connected via a central navigation bar.
*   **Pages**: The application includes a **Home** page with a hero section, a **Find Ride** page for filtering options, an **Offer Ride** form for drivers, and a **Profile** page.
*   **Styling & Logic**: A custom `style.css` file uses CSS variables for easy theming (Dark/Light mode). JavaScript handles the API communication, dynamically updating the DOM based on user actions without requiring full page reloads.

## 4.3 Core Logic
The application relies on two critical logic flows:
*   **Search Logic**: Filters rides based on case-insensitive matches for origin and destination, ensuring users find relevant results even with minor spelling variations.
*   **Booking Logic**: Employs an atomic check (`seats_available > requested`) before confirming a transaction. This prevents overbooking and ensures data integrity.

---

# Page 5: Conclusion

## 5.1 Conclusion
TripLink successfully demonstrates a functional prototype of a carpooling platform that addresses the core requirements of user management, ride sharing, and searching. The use of a modular Django backend combined with a standard web frontend ensures that the application is both scalable and easy to maintain, providing a solid foundation for future development.

## 5.2 Limitations
While functional, the current prototype has specific limitations:
*   **Payments**: Transactions are currently assumed to be cash-based, with no online payment processing.
*   **Tracking**: There is no real-time GPS tracking for vehicles.
*   **Matching**: The search algorithm relies on exact location matches rather than route proximity.

## 5.3 Future Scope
To evolve TripLink into a commercial-grade product, the following enhancements are proposed:
*   **Map Integration**: Integrating Google Maps or Leaflet to visualize routes and allow map-based selection of pick-up points.
*   **Payment Gateway**: Implementing Stripe or PayPal for secure, in-app cashless transactions.
*   **Community Features**: Adding a rating system and real-time chat to enhance trust and communication between users.
*   **Mobile App**: Developing a dedicated mobile application using React Native for better on-the-go access.

---
