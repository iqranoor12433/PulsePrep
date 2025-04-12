document.addEventListener("DOMContentLoaded", function () {
  // Initialize charts
  initializeCharts();

  // Mobile menu toggle
  const menuToggle = document.createElement("div");
  menuToggle.className = "mobile-menu-toggle";
  menuToggle.innerHTML = "☰";
  document.querySelector(".header").prepend(menuToggle);

  menuToggle.addEventListener("click", function () {
    document.getElementById("sidebar").classList.toggle("active");
  });

  // Close sidebar when clicking outside on mobile
  document.addEventListener("click", function (event) {
    const sidebar = document.getElementById("sidebar");
    const menuToggle = document.querySelector(".mobile-menu-toggle");

    if (
      window.innerWidth <= 768 &&
      !sidebar.contains(event.target) &&
      !menuToggle.contains(event.target) &&
      sidebar.classList.contains("active")
    ) {
      sidebar.classList.remove("active");
    }
  });

  // Progress circles animation
  const progressCircles = document.querySelectorAll(".progress-circle");
  progressCircles.forEach((circle) => {
    const percent = circle.getAttribute("data-percent");
    circle.style.background = `conic-gradient(#B03060 0%, #B03060 ${percent}%, #f3f3f3 ${percent}%, #f3f3f3 100%)`;
  });

  // Responsive adjustments
  window.addEventListener("resize", handleResize);
  handleResize();

  // Add hover effects and animations
  addInteractivity();
});

function handleResize() {
  const width = window.innerWidth;

  // Adjust layout based on screen size
  if (width <= 768) {
    // Mobile layout adjustments
    document.querySelectorAll(".stat-card").forEach((card) => {
      card.style.flexDirection = width <= 576 ? "column" : "row";
    });
  }
}

function addInteractivity() {
  // Add hover effects to cards
  document
    .querySelectorAll(".stat-card, .module-btn, .action-btn, .client-item")
    .forEach((item) => {
      item.addEventListener("mouseenter", function () {
        this.style.transform = "translateY(-5px)";
        this.style.boxShadow = "0 8px 15px rgba(0, 0, 0, 0.1)";
      });

      item.addEventListener("mouseleave", function () {
        this.style.transform = "";
        this.style.boxShadow = "";
      });
    });

  // Add click effects for buttons
  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", function (e) {
      // Create ripple effect
      const ripple = document.createElement("span");
      ripple.classList.add("ripple");
      this.appendChild(ripple);

      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);

      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

      ripple.classList.add("active");

      setTimeout(() => {
        ripple.remove();
      }, 500);
    });
  });
}

function initializeCharts() {
  // Revenue Breakdown Chart (Donut Chart)
  const revenueCanvas = document.createElement("canvas");
  revenueCanvas.id = "revenueCanvas";
  document.getElementById("revenue-chart").appendChild(revenueCanvas);

  new Chart(revenueCanvas, {
    type: "doughnut",
    data: {
      labels: ["Subscriptions", "Mock Test Sales", "Referral Earnings"],
      datasets: [
        {
          data: [30, 35, 35],
          backgroundColor: ["#B03060", "#1F4F8F", "#F7CAC9"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "70%",
      plugins: {
        legend: {
          display: false,
        },
      },
      animation: {
        animateRotate: true,
        animateScale: true,
      },
    },
  });

  // Test Attempts Chart (Line Chart)
  const testCanvas = document.createElement("canvas");
  testCanvas.id = "testCanvas";
  document.getElementById("test-chart").appendChild(testCanvas);

  new Chart(testCanvas, {
    type: "line",
    data: {
      labels: ["0", "100", "200", "300", "400", "500", "600"],
      datasets: [
        {
          label: "MBBS 1",
          data: [100, 200, 150, 300, 200, 100, 250],
          borderColor: "#B03060",
          backgroundColor: "rgba(176, 48, 96, 0.1)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "BDS 2",
          data: [150, 250, 200, 350, 300, 400, 300],
          borderColor: "#1F4F8F",
          backgroundColor: "rgba(31, 79, 143, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          max: 500,
        },
      },
      animation: {
        duration: 2000,
        easing: "easeOutQuart",
      },
      elements: {
        point: {
          radius: 0,
          hoverRadius: 6,
        },
      },
    },
  });

  // Add annotation for the main data point
  const testChart = Chart.getChart("testCanvas");
  testChart.options.plugins.annotation = {
    annotations: {
      point1: {
        type: "point",
        xValue: 3,
        yValue: 300,
        backgroundColor: "#B03060",
        radius: 5,
        borderWidth: 2,
        borderColor: "white",
      },
    },
  };
  testChart.update();

  // Add the "300" text annotation
  const pointContainer = document.createElement("div");
  pointContainer.className = "point-annotation";
  pointContainer.innerHTML = '<div class="point-value">300</div>';
  pointContainer.style.position = "absolute";
  pointContainer.style.left = "50%";
  pointContainer.style.top = "35%";
  pointContainer.style.transform = "translate(-50%, -50%)";
  pointContainer.style.backgroundColor = "#333";
  pointContainer.style.color = "white";
  pointContainer.style.padding = "5px 10px";
  pointContainer.style.borderRadius = "4px";
  pointContainer.style.fontSize = "14px";
  pointContainer.style.fontWeight = "bold";
  document.getElementById("test-chart").style.position = "relative";
  document.getElementById("test-chart").appendChild(pointContainer);
}

// Add window resize event handling for responsiveness
window.addEventListener("resize", function () {
  const charts = Chart.instances;
  for (let chart of charts) {
    chart.resize();
  }
});
