const localUserData = JSON.parse(localStorage.getItem("userData")) || {};
const token = localUserData?.data?.token || "";
const currentUserId = localUserData?.data?.userId || "";

let notifications = [];

async function fetchNotifications() {
  try {
    const res = await fetch(
      `https://talentloop-backend.onrender.com/requests/?userId=${currentUserId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) throw new Error("Failed to load requests");
    const data = await res.json();
    notifications = data?.data || [];
    renderNotifications("all");
  } catch (err) {
    console.error("Error:", err);
  }
}

function renderNotifications(filter = "all") {
  const container = document.getElementById("notificationList");
  container.innerHTML = "";

  const filtered = notifications.filter((req) => {
    if (req.status === "PENDING") {
      return req.receiverId.id === currentUserId;
    }

    if (req.status === "APPROVED") {
      return req.sender.id === currentUserId;
    }

    return false;
  });

  filtered.forEach((req) => {
    const card = document.createElement("div");
    card.className = "notification-card";

    let message = "";

    if (req.status === "PENDING") {
      message = `From - ${req.sender.realUsername}: ${
        req.message || "No message"
      }`;
    } else if (req.status === "APPROVED") {
      message = `From - ${req.sender.realUsername}: ${
        req.message || "No message"
      } | Receiver: ${req.receiverId.email}`;
    } else {
      message = `${req.message || "No message"}`;
    }

    card.innerHTML = `<p>${message}</p>`;

    if (req.status === "PENDING" && req.receiverId.id === currentUserId) {
      const actions = document.createElement("div");
      actions.className = "actions";

      const acceptBtn = document.createElement("button");
      acceptBtn.className = "accept-btn";
      acceptBtn.textContent = "Accept";
      acceptBtn.onclick = () =>
        handleApprove(req.id, req.receiverId.id, acceptBtn, declineBtn);

      const declineBtn = document.createElement("button");
      declineBtn.className = "decline-btn";
      declineBtn.textContent = "Decline";
      declineBtn.onclick = () =>
        handleDecline(req.id, req.receiverId.id, acceptBtn, declineBtn);

      actions.appendChild(acceptBtn);
      actions.appendChild(declineBtn);
      card.appendChild(actions);
    }

    container.appendChild(card);
  });

  if (filtered.length === 0) {
    container.innerHTML = "<p>No notifications to show.</p>";
  }
}

async function handleApprove(requestId, receiverId, acceptBtn, declineBtn) {
  acceptBtn.disabled = true;
  declineBtn.disabled = true;

  try {
    const res = await fetch(
      `https://talentloop-backend.onrender.com/requests/approve?requestId=${requestId}&receiverId=${receiverId}`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) throw new Error("Approval failed");
    alert("Request approved!");
    fetchNotifications();
  } catch (err) {
    console.error(err);
    acceptBtn.disabled = false;
    declineBtn.disabled = false;
  }
}

async function handleDecline(senderId, receiverId, acceptBtn, declineBtn) {
  acceptBtn.disabled = true;
  declineBtn.disabled = true;

  try {
    const res = await fetch(
      `https://talentloop-backend.onrender.com/requests/decline?senderId=${senderId}&receiverId=${receiverId}`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) throw new Error("Decline failed");
    alert("Request declined.");
    fetchNotifications();
  } catch (err) {
    console.error(err);
    acceptBtn.disabled = false;
    declineBtn.disabled = false;
  }
}

document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".tab-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderNotifications(btn.dataset.tab);
  });
});

function goBack() {
  window.location.href = "explore.html";
}

document.addEventListener("DOMContentLoaded", fetchNotifications);
