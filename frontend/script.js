document.addEventListener('DOMContentLoaded', () => {
    // --- Auth Logic ---
    const authButtonsContainer = document.getElementById('auth-buttons');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');
    const userPhone = localStorage.getItem('userPhone');

    // Update Header based on Auth State
    if (authButtonsContainer) {
        if (isLoggedIn) {
            authButtonsContainer.innerHTML = `
                <div class="user-menu" style="display: flex; align-items: center; gap: 15px;">
                    <a href="profile.html" style="font-weight: 500; color: var(--text-color); display: flex; align-items: center; gap: 8px;">
                        <span>Hello, ${userName || 'User'}</span>
                    </a>
                    <button id="logout-btn" class="btn btn-outline btn-sm">Sign Out</button>
                </div>
            `;
            // Add Logout Listener
            document.getElementById('logout-btn').addEventListener('click', () => {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userName');
                localStorage.removeItem('userPhone');
                window.location.href = 'index.html';
            });
        } else {
            authButtonsContainer.innerHTML = `
                <a href="login.html" class="btn btn-primary">Sign In / Create Account</a>
            `;
        }
    } else {
        // Fallback for index.html where the container might be the .header-actions div itself or a specific button
        const signInBtn = document.querySelector('.header-actions .btn-primary');
        if (signInBtn && signInBtn.textContent.includes('Sign In')) {
            if (isLoggedIn) {
                signInBtn.textContent = 'My Profile';
                signInBtn.href = 'profile.html'; // Updated link
                // Create a logout button and append it
                const logoutBtn = document.createElement('button');
                logoutBtn.className = 'btn btn-outline btn-sm';
                logoutBtn.textContent = 'Sign Out';
                logoutBtn.style.marginLeft = '10px';
                logoutBtn.addEventListener('click', () => {
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('userEmail');
                    localStorage.removeItem('userName');
                    localStorage.removeItem('userPhone');
                    window.location.reload();
                });
                signInBtn.parentNode.insertBefore(logoutBtn, signInBtn.nextSibling);
            } else {
                signInBtn.href = 'login.html';
            }
        }
    }

    // Profile Page Logic
    // Check for 'profile' but exclude 'driver-profile' to handle both .html and pretty URLs
    if (window.location.pathname.includes('profile') && !window.location.pathname.includes('driver-profile')) {
        console.log('Detected Profile Page');
        if (!isLoggedIn) {
            window.location.href = 'login.html';
        } else {
            const profileName = document.getElementById('profile-name');
            const profileEmail = document.getElementById('profile-email');
            const profileFullnameInput = document.getElementById('profile-fullname');
            const profilePhoneInput = document.getElementById('profile-phone');

            if (profileName && userName) profileName.textContent = userName;
            if (profileEmail && userEmail) profileEmail.textContent = userEmail;
            if (profileFullnameInput && userName) profileFullnameInput.value = userName;
            if (profilePhoneInput && userPhone) profilePhoneInput.value = userPhone;

            const profileLogoutBtn = document.getElementById('profile-logout-btn');
            if (profileLogoutBtn) {
                profileLogoutBtn.addEventListener('click', () => {
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('userEmail');
                    localStorage.removeItem('userName');
                    localStorage.removeItem('userPhone');
                    window.location.href = 'index.html';
                });
            }
        }
    }

    // Driver Profile Page Logic
    if (window.location.pathname.includes('driver-profile')) {
        console.log('Detected Driver Profile Page');
        if (!isLoggedIn) {
            window.location.href = 'login.html';
        } else {
            const profileName = document.getElementById('profile-name');
            const profileEmail = document.getElementById('profile-email');

            if (profileName && userName) profileName.textContent = userName;
            if (profileEmail && userEmail) profileEmail.textContent = userEmail;

            const profileLogoutBtn = document.getElementById('profile-logout-btn');
            if (profileLogoutBtn) {
                profileLogoutBtn.addEventListener('click', () => {
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('userEmail');
                    localStorage.removeItem('userName');
                    localStorage.removeItem('userPhone');
                    window.location.href = 'index.html';
                });
            }
        }
    }

    // Driver Form Submission (Global Listener)
    const driverForm = document.getElementById('driver-form');
    if (driverForm) {
        console.log('Driver form found, attaching listener');
        driverForm.addEventListener('submit', async (e) => {
            console.log('Driver form submitted');
            e.preventDefault();

            const license = document.getElementById('license').value;
            const vehicleMake = document.getElementById('vehicle-make').value;
            const vehicleModel = document.getElementById('vehicle-model').value;
            const vehiclePlate = document.getElementById('vehicle-plate').value;
            const vehicleYear = document.getElementById('vehicle-year').value;
            const vehicleColor = document.getElementById('vehicle-color').value;
            const submitBtn = driverForm.querySelector('button[type="submit"]');

            try {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Saving...';

                const response = await fetch('https://web-production-7394a.up.railway.app/api/driver-profile/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: userEmail,
                        license_number: license,
                        vehicle_make: vehicleMake,
                        vehicle_model: vehicleModel,
                        vehicle_plate: vehiclePlate,
                        vehicle_year: vehicleYear,
                        vehicle_color: vehicleColor
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Driver profile saved successfully!');
                } else {
                    alert(data.error || 'Failed to save driver profile.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Unable to connect to the server.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Save Driver Details';
            }
        });
    }

    // Route Protection (Offer Ride)
    if (window.location.pathname.includes('offer-ride')) {
        if (!isLoggedIn) {
            alert('You must be signed in to offer a ride.');
            window.location.href = 'login.html';
        }
    }

    // Login Form Handling
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const submitBtn = loginForm.querySelector('button[type="submit"]');

            try {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Signing In...';

                const response = await fetch('https://web-production-7394a.up.railway.app/api/login/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userEmail', data.user.email);
                    localStorage.setItem('userName', data.user.full_name);
                    localStorage.setItem('userPhone', data.user.phone_number || '');
                    window.location.href = 'index.html';
                } else {
                    alert(data.error || 'Login failed. Please check your credentials.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Unable to connect to the server. Please ensure the backend is running.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Sign In';
            }
        });
    }

    // Register Form Handling
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fullName = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            let phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const submitBtn = registerForm.querySelector('button[type="submit"]');

            // Auto-prepend +91 if user didn't add a country code
            if (phone && !phone.startsWith('+')) {
                phone = '+91' + phone.trim();
            }

            try {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Creating Account...';

                const response = await fetch('https://web-production-7394a.up.railway.app/api/register/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        full_name: fullName,
                        email: email,
                        phone_number: phone,
                        password: password
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userEmail', data.user.email);
                    localStorage.setItem('userName', data.user.full_name);
                    localStorage.setItem('userPhone', data.user.phone_number || '');
                    alert('Account created successfully!');
                    window.location.href = 'index.html';
                } else {
                    // Handle validation errors (which might be an object)
                    let errorMessage = 'Registration failed.';
                    if (data.email) errorMessage = data.email[0];
                    else if (data.password) errorMessage = data.password[0];
                    else if (data.message) errorMessage = data.message;

                    alert(errorMessage);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Unable to connect to the server. Please ensure the backend is running.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Create Account';
            }
        });
    }

    // Book Button Handling (Find Ride)
    const bookBtns = document.querySelectorAll('.book-btn');
    bookBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (!isLoggedIn) {
                alert('Please sign in to book a ride.');
                window.location.href = 'login.html';
            } else {
                alert('Booking feature coming soon! (Mock Success)');
            }
        });
    });

    // Offer Ride Form Handling
    const offerRideForm = document.getElementById('offer-ride-form');
    if (offerRideForm) {
        offerRideForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const origin = document.getElementById('origin').value;
            const destination = document.getElementById('destination').value;
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const price = document.getElementById('price').value;
            const seats = document.getElementById('seats').value;
            const details = document.getElementById('details').value;
            const submitBtn = offerRideForm.querySelector('button[type="submit"]');

            try {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Publishing...';

                const response = await fetch('https://web-production-7394a.up.railway.app/api/offer-ride/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: userEmail,
                        origin: origin,
                        destination: destination,
                        departure_date: date,
                        departure_time: time,
                        price: price,
                        seats_available: seats,
                        description: details
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Ride published successfully!');
                    window.location.href = 'find-ride.html';
                } else {
                    if (data.error === "You must create a driver profile first") {
                        if (confirm('You must create a driver profile before offering a ride. Go to Driver Profile page now?')) {
                            window.location.href = 'driver-profile.html';
                        }
                    } else {
                        alert(data.error || 'Failed to publish ride.');
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Unable to connect to the server.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Publish Ride';
            }
        });
    }

    // --- Existing UI Logic ---

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            const spans = mobileMenuBtn.querySelectorAll('span');
            if (nav.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Dark Mode Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else if (currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else if (prefersDarkScheme.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            let theme = 'light';
            if (!document.documentElement.hasAttribute('data-theme') || document.documentElement.getAttribute('data-theme') === 'light') {
                theme = 'dark';
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
            }
            localStorage.setItem('theme', theme);
        });
    }

    // Protected Navigation Links
    const protectedLinks = [
        document.getElementById('nav-find-ride'),
        document.getElementById('nav-offer-ride'),
        document.getElementById('nav-my-trips')
    ];

    protectedLinks.forEach(link => {
        if (link) {
            link.addEventListener('click', (e) => {
                if (!isLoggedIn) {
                    e.preventDefault();
                    alert('Please login to continue with our services.');
                    window.location.href = 'login.html';
                }
            });
        }
    });

    // Sticky Header on Scroll
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.style.boxShadow = 'var(--shadow-md)';
            } else {
                header.style.boxShadow = 'none';
            }
        });
    }

    // Find Ride Page Logic
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn || window.location.pathname.includes('find-ride')) {
        const loadRides = async () => {
            const origin = document.getElementById('search-from')?.value || '';
            const destination = document.getElementById('search-to')?.value || '';
            const date = document.getElementById('search-date')?.value || '';
            const ridesList = document.querySelector('.rides-list');

            if (!ridesList) return;

            // Clear existing mock data (except header)
            const header = ridesList.querySelector('.search-header');
            ridesList.innerHTML = '';
            if (header) ridesList.appendChild(header);

            // Update header text
            if (header) {
                const title = header.querySelector('h1');
                const subtitle = header.querySelector('p');
                if (title) title.textContent = origin && destination ? `${origin} to ${destination}` : 'Available Rides';
                if (subtitle) subtitle.textContent = 'Loading rides...';
            }

            try {
                // Build query string
                const params = new URLSearchParams();
                if (origin) params.append('origin', origin);
                if (destination) params.append('destination', destination);
                if (date) params.append('date', date);

                const fetchUrl = `https://web-production-7394a.up.railway.app/api/find-ride/?${params.toString()}`;
                console.log('Fetching rides from:', fetchUrl);
                console.log('Params:', { origin, destination, date });

                const response = await fetch(fetchUrl);
                const rides = await response.json();

                if (header) {
                    const subtitle = header.querySelector('p');
                    if (subtitle) subtitle.textContent = `${rides.length} rides available`;
                }

                if (rides.length === 0) {
                    const noRidesMsg = document.createElement('div');
                    noRidesMsg.style.textAlign = 'center';
                    noRidesMsg.style.padding = '40px';
                    noRidesMsg.style.color = 'var(--text-light)';
                    noRidesMsg.innerHTML = '<p>No rides found matching your criteria.</p>';
                    ridesList.appendChild(noRidesMsg);
                    return;
                }

                rides.forEach(ride => {
                    const card = document.createElement('div');
                    card.className = 'ride-card horizontal';

                    // Calculate duration (mock logic for now as we don't have arrival time)
                    const duration = '3h 00m';

                    card.innerHTML = `
                        <div class="ride-main">
                            <div class="ride-header">
                                <div class="driver-info">
                                    <div class="driver-avatar"></div>
                                    <div>
                                        <h4>${ride.driver_name || 'Driver'}</h4>
                                    </div>
                                </div>
                                <span class="seats-badge">${ride.seats_available} seats left</span>
                            </div>
                            
                            <div class="ride-times">
                                <div class="time-loc">
                                    <span class="time">${ride.departure_time.slice(0, 5)}</span>
                                    <span class="city">${ride.origin}</span>
                                </div>
                                <div class="duration-line">
                                    <span class="duration">${duration}</span>
                                    <div class="line"></div>
                                </div>
                                <div class="time-loc">
                                    <span class="time">--:--</span>
                                    <span class="city">${ride.destination}</span>
                                </div>
                            </div>
                        </div>
                        <div class="ride-price-action">
                            <span class="price-large">₹${ride.price}</span>
                            <button class="btn btn-primary book-btn">Book Seat</button>
                        </div>
                    `;
                    ridesList.appendChild(card);
                });

                // Re-attach book button listeners
                const newBookBtns = document.querySelectorAll('.book-btn');
                newBookBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        if (!isLoggedIn) {
                            alert('Please sign in to book a ride.');
                            window.location.href = 'login.html';
                        } else {
                            alert('Booking feature coming soon!');
                        }
                    });
                });

            } catch (error) {
                console.error('Error fetching rides:', error);
                if (header) {
                    const subtitle = header.querySelector('p');
                    if (subtitle) subtitle.textContent = 'Error loading rides.';
                }
            }
        };

        if (searchBtn) {
            searchBtn.addEventListener('click', loadRides);
        }

        // Initial load if on find-ride page
        if (window.location.pathname.includes('find-ride')) {
            // Wait a bit for DOM to be fully ready if needed, or just call it
            loadRides();
        }
    }
});
