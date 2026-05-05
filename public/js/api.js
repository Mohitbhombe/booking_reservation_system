const API_BASE = '/api/v1';

const api = {
    async request(endpoint, options = {}) {
        const token = localStorage.getItem('accessToken');
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers
        });

        if (response.status === 401 && localStorage.getItem('refreshToken')) {
            // Handle token refresh logic here if needed
            console.warn('Session expired. Please login again.');
            this.logout();
        }

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }
        return data;
    },

    // Auth
    async login(email, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        this.setSession(data.data);
        return data.data;
    },

    async register(name, email, password) {
        const data = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password })
        });
        this.setSession(data.data);
        return data.data;
    },

    setSession(session) {
        localStorage.setItem('accessToken', session.accessToken);
        localStorage.setItem('refreshToken', session.refreshToken);
        localStorage.setItem('user', JSON.stringify(session.user));
    },

    logout() {
        localStorage.clear();
        window.location.reload();
    },

    // Resources
    async getResources() {
        return await this.request('/resources');
    },

    // Bookings
    async createBooking(resourceId, startDate, endDate) {
        return await this.request('/bookings', {
            method: 'POST',
            body: JSON.stringify({ resourceId, startDate, endDate })
        });
    },

    async getMyBookings() {
        return await this.request('/bookings/my-bookings');
    },

    async cancelBooking(bookingId) {
        return await this.request(`/bookings/${bookingId}/cancel`, {
            method: 'PATCH'
        });
    }
};
