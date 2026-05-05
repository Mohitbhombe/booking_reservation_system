document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const resourceGrid = document.getElementById('resourceGrid');
    const bookingsList = document.getElementById('bookingsList');
    const authModal = document.getElementById('authModal');
    const bookingModal = document.getElementById('bookingModal');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    // Auth UI State
    const updateAuthUI = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const authOnly = document.querySelectorAll('.auth-only');
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        const logoutBtn = document.getElementById('logoutBtn');

        if (user) {
            authOnly.forEach(el => el.classList.remove('hide'));
            loginBtn.classList.add('hide');
            registerBtn.classList.add('hide');
            logoutBtn.classList.remove('hide');
            loadBookings();
        } else {
            authOnly.forEach(el => el.classList.add('hide'));
            loginBtn.classList.remove('hide');
            registerBtn.classList.remove('hide');
            logoutBtn.classList.add('hide');
        }
    };

    // Load Resources
    const loadResources = async () => {
        try {
            const response = await api.getResources();
            const resources = response.resources;
            resourceGrid.innerHTML = resources.map(res => `
                <div class="card">
                    <h3>${res.name}</h3>
                    <p>${res.description || 'No description available.'}</p>
                    <div class="card-footer">
                        <div class="price">$${res.price}<span>/day</span></div>
                        <button class="btn btn-primary" onclick="openBookingModal('${res.id}', '${res.name}', '${res.description || ''}', ${res.price})">Book Now</button>
                    </div>
                </div>
            `).join('');
        } catch (err) {
            resourceGrid.innerHTML = `<p class="error">Error loading resources: ${err.message}</p>`;
        }
    };

    // Load User Bookings
    const loadBookings = async () => {
        try {
            const response = await api.getMyBookings();
            const bookings = response.data;
            if (bookings.length === 0) {
                bookingsList.innerHTML = '<p class="text-muted">You have no reservations yet.</p>';
                return;
            }
            bookingsList.innerHTML = bookings.map(b => `
                <div class="booking-card">
                    <div class="booking-info">
                        <h4>${b.resource.name}</h4>
                        <p>${new Date(b.startDate).toLocaleDateString()} - ${new Date(b.endDate).toLocaleDateString()}</p>
                        <p>Total: $${b.totalPrice}</p>
                    </div>
                    <div class="booking-actions">
                        <span class="status-badge status-${b.status.toLowerCase()}">${b.status}</span>
                        ${b.status !== 'CANCELLED' ? `<button class="btn btn-outline" style="margin-left:1rem" onclick="cancelBooking('${b.id}')">Cancel</button>` : ''}
                    </div>
                </div>
            `).join('');
        } catch (err) {
            console.error(err);
        }
    };

    // Global Event Listeners
    window.openBookingModal = (id, name, desc, price) => {
        if (!localStorage.getItem('user')) {
            showModal('login');
            return;
        }
        document.getElementById('modalResourceId').value = id;
        document.getElementById('modalResourceName').innerText = name;
        document.getElementById('modalResourceDesc').innerText = desc;
        document.getElementById('modalResourcePrice').innerText = price;
        bookingModal.classList.remove('hide');
    };

    window.cancelBooking = async (id) => {
        if (confirm('Are you sure you want to cancel this booking?')) {
            try {
                await api.cancelBooking(id);
                loadBookings();
            } catch (err) {
                alert(err.message);
            }
        }
    };

    const showModal = (type) => {
        authModal.classList.remove('hide');
        if (type === 'login') {
            loginForm.classList.remove('hide');
            registerForm.classList.add('hide');
        } else {
            loginForm.classList.add('hide');
            registerForm.classList.remove('hide');
        }
    };

    // Event Bindings
    document.getElementById('loginBtn').addEventListener('click', () => showModal('login'));
    document.getElementById('registerBtn').addEventListener('click', () => showModal('register'));
    document.getElementById('logoutBtn').addEventListener('click', () => api.logout());
    document.getElementById('switchToRegister').addEventListener('click', (e) => { e.preventDefault(); showModal('register'); });
    document.getElementById('switchToLogin').addEventListener('click', (e) => { e.preventDefault(); showModal('login'); });

    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            authModal.classList.add('hide');
            bookingModal.classList.add('hide');
        });
    });

    // Auth Forms
    document.getElementById('loginFormEl').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            await api.login(document.getElementById('loginEmail').value, document.getElementById('loginPassword').value);
            authModal.classList.add('hide');
            updateAuthUI();
        } catch (err) {
            alert(err.message);
        }
    });

    document.getElementById('registerFormEl').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            await api.register(
                document.getElementById('registerName').value,
                document.getElementById('registerEmail').value,
                document.getElementById('registerPassword').value
            );
            authModal.classList.add('hide');
            updateAuthUI();
        } catch (err) {
            alert(err.message);
        }
    });

    // Booking Form logic
    const calculateTotal = () => {
        const start = new Date(document.getElementById('bookingStart').value);
        const end = new Date(document.getElementById('bookingEnd').value);
        const price = parseFloat(document.getElementById('modalResourcePrice').innerText);
        
        if (start && end && end > start) {
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
            document.getElementById('summaryDays').innerText = diffDays;
            document.getElementById('summaryTotal').innerText = (diffDays * price).toFixed(2);
        }
    };

    document.getElementById('bookingStart').addEventListener('change', calculateTotal);
    document.getElementById('bookingEnd').addEventListener('change', calculateTotal);

    document.getElementById('bookingFormEl').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            await api.createBooking(
                document.getElementById('modalResourceId').value,
                new Date(document.getElementById('bookingStart').value).toISOString(),
                new Date(document.getElementById('bookingEnd').value).toISOString()
            );
            bookingModal.classList.add('hide');
            loadBookings();
            alert('Booking successful!');
        } catch (err) {
            alert(err.message);
        }
    });

    // Initial Load
    updateAuthUI();
    loadResources();
});
