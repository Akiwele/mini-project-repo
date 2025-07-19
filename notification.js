let notifications = [
  { id: 1, type: 'unread', message: 'George Grey sent you a connection request.', category: 'request', requester: 'George Grey' },
  { id: 2, type: 'read', message: 'Lordina Roberts approved your request.', category: 'approval' },
  { id: 3, type: 'unread', message: 'New match: Algebra & Economics', category: 'unread' }
];

function renderNotifications(filter = 'all') {
  const container = document.getElementById('notificationList');
  container.innerHTML = '';

  const filtered = filter === 'all'
    ? notifications
    : notifications.filter(n => n.category === filter);

  filtered.forEach(notif => {
    const card = document.createElement('div');
    card.className = 'notification-card';

    // Faded if read
    if (notif.type === 'read') {
      card.style.opacity = '0.6';
      card.style.backgroundColor = '#eaeaea';
    }

    card.innerHTML = `<p>${notif.message}</p>`;

    if (notif.category === 'request') {
      const actions = document.createElement('div');
      actions.className = 'actions';

      const acceptBtn = document.createElement('button');
      acceptBtn.className = 'accept-btn';
      acceptBtn.textContent = 'Accept';
      acceptBtn.onclick = () => markAsRead(notif.id, 'accepted');

      const declineBtn = document.createElement('button');
      declineBtn.className = 'decline-btn';
      declineBtn.textContent = 'Decline';
      declineBtn.onclick = () => markAsRead(notif.id, 'declined');

      actions.appendChild(acceptBtn);
      actions.appendChild(declineBtn);
      card.appendChild(actions);
    }

    container.appendChild(card);
  });
}

function markAsRead(id, action) {
  const notif = notifications.find(n => n.id === id);
  if (notif) {
    notif.type = 'read';

    if (action === 'accepted') {
      notif.message += ' (You accepted the request)';

      // Simulated current user
      const currentUser = JSON.parse(localStorage.getItem('userProfile')) || {
        name: 'You',
        email: 'your.email@example.com'
      };

      // Add approval notification to the other user (simulated)
      notifications.push({
        id: notifications.length + 1,
        type: 'unread',
        message: `${currentUser.name} approved your request. Contact them at: ${currentUser.email}`,
        category: 'approval'
      });

    } else if (action === 'declined') {
      notif.message += ' (You declined the request)';
    }

    renderNotifications(document.querySelector('.tab-btn.active').dataset.tab);
  }
}

// Tab button logic
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderNotifications(btn.dataset.tab);
  });
});

// Go back button
function goBack() {
  window.location.href = 'explore.html';
}

// Load saved theme
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    const toggle = document.getElementById('themeToggle');
    if (toggle) toggle.checked = true;
  }

  renderNotifications(); // Render after DOM is ready
});
