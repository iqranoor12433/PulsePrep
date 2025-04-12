document.addEventListener("DOMContentLoaded", function () {
  // Sample data for users table
  const userData = [
    {
      id: 1,
      name: "markbrown",
      status: "active",
      category: "unpaid",
      type: "Male",
      email: "ashley_scott_1988@gmail.com",
      field: "MBBS",
      year: "1st",
      image: "https://i.pravatar.cc/100?img=3",
    },
    {
      id: 2,
      name: "markbrown",
      status: "active",
      category: "paid",
      type: "Male",
      email: "ashley_scott_1988@gmail.com",
      field: "BDS",
      year: "2nd",
      image: "https://i.pravatar.cc/100?img=4",
    },
    {
      id: 3,
      name: "markbrown",
      status: "active",
      category: "unpaid",
      type: "Male",
      email: "ashley_scott_1988@gmail.com",
      field: "MBBS",
      year: "3rd",
      image: "https://i.pravatar.cc/100?img=5",
    },
    {
      id: 4,
      name: "markbrown",
      status: "active",
      category: "paid",
      type: "Male",
      email: "ashley_scott_1988@gmail.com",
      field: "MBBS",
      year: "2nd",
      image: "https://i.pravatar.cc/100?img=6",
    },
    {
      id: 5,
      name: "markbrown",
      status: "active",
      category: "unpaid",
      type: "Male",
      email: "ashley_scott_1988@gmail.com",
      field: "BDS",
      year: "1st",
      image: "https://i.pravatar.cc/100?img=7",
    },
    {
      id: 6,
      name: "markbrown",
      status: "active",
      category: "paid",
      type: "Male",
      email: "ashley_scott_1988@gmail.com",
      field: "BDS",
      year: "4th",
      image: "https://i.pravatar.cc/100?img=8",
    },
    {
      id: 7,
      name: "markbrown",
      status: "active",
      category: "paid",
      type: "Male",
      email: "ashley_scott_1988@gmail.com",
      field: "BDS",
      year: "3rd",
      image: "https://i.pravatar.cc/100?img=9",
    },
    {
      id: 8,
      name: "markbrown",
      status: "active",
      category: "paid",
      type: "Male",
      email: "ashley_scott_1988@gmail.com",
      field: "MBBS",
      year: "2nd",
      image: "https://i.pravatar.cc/100?img=10",
    },
    {
      id: 9,
      name: "markbrown",
      status: "active",
      category: "paid",
      type: "Male",
      email: "ashley_scott_1988@gmail.com",
      field: "MBBS",
      year: "1st",
      image: "https://i.pravatar.cc/100?img=11",
    },
    {
      id: 10,
      name: "markbrown",
      status: "active",
      category: "paid",
      type: "Male",
      email: "ashley_scott_1988@gmail.com",
      field: "MBBS",
      year: "4th",
      image: "https://i.pravatar.cc/100?img=12",
    },
    {
      id: 11,
      name: "markbrown",
      status: "active",
      category: "paid",
      type: "Male",
      email: "ashley_scott_1988@gmail.com",
      field: "BDS",
      year: "3rd",
      image: "https://i.pravatar.cc/100?img=13",
    },
  ];

  // Populate table with data
  populateTable(userData);

  // Search functionality
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    const filteredData = userData.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm) ||
        item.email.toLowerCase().includes(searchTerm) ||
        item.field.toLowerCase().includes(searchTerm)
    );
    populateTable(filteredData);
  });

  // Filter dropdowns
  const filterLinks = document.querySelectorAll(".filter-dropdown-content a");
  filterLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const filterType = this.getAttribute("data-filter");
      const sortType = this.getAttribute("data-sort");

      // Update button text
      if (this.parentElement.previousElementSibling) {
        const buttonText = this.textContent;
        const button = this.parentElement.previousElementSibling;
        button.innerHTML = buttonText + ' <i class="fas fa-chevron-down"></i>';
      }

      // Apply filters
      let filteredData = [...userData];

      if (filterType && filterType !== "all") {
        filteredData = filteredData.filter(
          (item) => item.status.toLowerCase() === filterType.toLowerCase()
        );
      }

      // Apply sorting
      if (sortType) {
        if (sortType === "newest") {
          filteredData.sort((a, b) => b.id - a.id);
        } else if (sortType === "oldest") {
          filteredData.sort((a, b) => a.id - b.id);
        } else if (sortType === "name") {
          filteredData.sort((a, b) => a.name.localeCompare(b.name));
        }
      }

      populateTable(filteredData);
    });
  });

  // Select all checkbox
  const selectAllCheckbox = document.getElementById("select-all-checkbox");
  selectAllCheckbox.addEventListener("change", function () {
    const checkboxes = document.querySelectorAll(
      '.users-table tbody input[type="checkbox"]'
    );
    checkboxes.forEach((checkbox) => {
      checkbox.checked = this.checked;
    });
  });

  // Add user button
  const addUserBtn = document.querySelector(".add-user-btn");
  const userModal = document.getElementById("user-modal");
  const closeModal = document.querySelector(".close-modal");
  const cancelBtn = document.getElementById("cancel-user");
  const saveBtn = document.getElementById("save-user");

  addUserBtn.addEventListener("click", function () {
    userModal.style.display = "block";
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  });

  function closeUserModal() {
    userModal.style.display = "none";
    document.body.style.overflow = "auto";
    document.getElementById("user-form").reset();
  }

  closeModal.addEventListener("click", closeUserModal);
  cancelBtn.addEventListener("click", closeUserModal);

  // Close modal when clicking outside
  window.addEventListener("click", function (event) {
    if (event.target === userModal) {
      closeUserModal();
    }
  });

  // File upload preview
  const fileInput = document.getElementById("user-image");
  const fileName = document.querySelector(".file-name");

  fileInput.addEventListener("change", function () {
    if (this.files.length > 0) {
      fileName.textContent = this.files[0].name;
    } else {
      fileName.textContent = "No file chosen";
    }
  });

  // Toggle switch label update
  const statusToggle = document.getElementById("user-status");
  const toggleLabel = document.querySelector(".toggle-label");

  statusToggle.addEventListener("change", function () {
    toggleLabel.textContent = this.checked ? "Active" : "Inactive";
  });

  // Save user
  saveBtn.addEventListener("click", function () {
    const form = document.getElementById("user-form");

    // Basic form validation
    const name = document.getElementById("user-name").value;
    const email = document.getElementById("user-email").value;

    if (!name) {
      showNotification("Please enter a user name");
      return;
    }

    if (!email) {
      showNotification("Please enter an email address");
      return;
    }

    // Create new user object
    const newUser = {
      id: userData.length + 1,
      name: name,
      status: statusToggle.checked ? "active" : "inactive",
      category: document.getElementById("user-category").value,
      type: document.getElementById("user-type").value,
      email: email,
      field: document.getElementById("user-field").value,
      year: document.getElementById("user-year").value,
      image:
        "https://i.pravatar.cc/100?img=" + (Math.floor(Math.random() * 70) + 1),
    };

    // Add to data and update table
    userData.unshift(newUser);
    populateTable(userData);

    // Close modal and show success message
    closeUserModal();
    showNotification("User added successfully");
  });
});

// Function to populate table
function populateTable(data) {
  const tableBody = document.getElementById("users-table-body");
  tableBody.innerHTML = "";

  data.forEach((item) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td><input type="checkbox" class="row-checkbox"></td>
      <td><img src="${item.image}" alt="${item.name}" class="user-thumbnail"></td>
      <td>${item.name}</td>
      <td><span class="status-badge status-active">${item.status}</span></td>
      <td><span class="status-badge status-${item.category}">${item.category}</span></td>
      <td>${item.type}</td>
      <td>${item.email}</td>
      <td>${item.field}</td>
      <td>${item.year}</td>
    `;

    tableBody.appendChild(row);
  });

  // Add hover effect to rows
  const tableRows = document.querySelectorAll(".users-table tbody tr");
  tableRows.forEach((row) => {
    row.addEventListener("mouseover", function () {
      this.style.cursor = "pointer";
    });
  });
}

// Show compact notification
function showNotification(message) {
  // Remove any existing notifications
  const existingNotifications = document.querySelectorAll(".notification");
  existingNotifications.forEach((notif) => notif.remove());

  // Create a new notification
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.className = "notification";

  // Show the notification
  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  // Automatically hide after 2.5 seconds
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.textContent = "";
    }, 300);
  }, 2500);
}
