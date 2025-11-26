document.addEventListener('DOMContentLoaded', () => {
    // --- Auth Logic ---
    const authButtonsContainer = document.getElementById('auth-buttons');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userEmail = localStorage.getItem('userEmail');

    // Update Header based on Auth State
    if (authButtonsContainer) {
        if (isLoggedIn) {
            authButtonsContainer.innerHTML = `
                <div class="user-menu" style="display: flex; align-items: center; gap: 15px;">
                    <a href="profile.html" style="font-weight: 500; color: var(--text-color); display: flex; align-items: center; gap: 8px;">
                        <span>Hello, ${userEmail ? userEmail.split('@')[0] : 'User'}</span>
                    </a>
                    <button id="logout-btn" class="btn btn-outline btn-sm">Sign Out</button>
                </div>
            `;
            // Add Logout Listener
            document.getElementById('logout-btn').addEventListener('click', () => {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userEmail');
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
                    window.location.reload();
                });
                signInBtn.parentNode.insertBefore(logoutBtn, signInBtn.nextSibling);
            } else {
                signInBtn.href = 'login.html';
            }
        }
    }

    // Profile Page Logic
    if (window.location.pathname.includes('profile.html')) {
        if (!isLoggedIn) {
            window.location.href = 'login.html';
        } else {
            const profileName = document.getElementById('profile-name');
            const profileEmail = document.getElementById('profile-email');
            if (profileName && userEmail) profileName.textContent = userEmail.split('@')[0];
            if (profileEmail && userEmail) profileEmail.textContent = userEmail;

            const profileLogoutBtn = document.getElementById('profile-logout-btn');
            if (profileLogoutBtn) {
                profileLogoutBtn.addEventListener('click', () => {
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('userEmail');
                    window.location.href = 'index.html';
                });
            }
        }
    }

    // Route Protection (Offer Ride)
    if (window.location.pathname.includes('offer-ride.html')) {
        if (!isLoggedIn) {
            alert('You must be signed in to offer a ride.');
            window.location.href = 'login.html';
        }
    }

    // Login Form Handling
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            window.location.href = 'index.html';
        });
    }

    // Register Form Handling
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            window.location.href = 'index.html';
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
        offerRideForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Ride published successfully!');
            window.location.href = 'find-ride.html';
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
});
