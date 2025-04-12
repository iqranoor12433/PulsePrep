document.addEventListener("DOMContentLoaded", function () {
  // Toggle sidebar
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const sidebar = document.querySelector(".sidebar");
  const mainContent = document.querySelector(".main-content");

  // Handle sidebar toggle
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", function (e) {
      e.stopPropagation(); // Prevent click from triggering document click
      sidebar.classList.toggle("active");
    });
  }

  // Close sidebar when clicking outside
  document.addEventListener("click", function (e) {
    // Only if we're on mobile and sidebar is open
    if (window.innerWidth <= 768 && sidebar.classList.contains("active")) {
      // Check if click is outside the sidebar
      if (!sidebar.contains(e.target) && e.target !== sidebarToggle) {
        sidebar.classList.remove("active");
      }
    }
  });

  // Prevent clicks inside sidebar from closing it
  sidebar.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  // Handle media query changes
  const mediaQuery = window.matchMedia("(max-width: 768px)");

  function handleMediaChange(e) {
    if (e.matches) {
      sidebar.classList.remove("active");
      mainContent.classList.remove("expanded");
    } else {
      sidebar.classList.remove("collapsed");
      mainContent.classList.remove("expanded");
    }
  }

  mediaQuery.addEventListener("change", handleMediaChange);
  handleMediaChange(mediaQuery);

  // Reset all counters to zero on page load
  resetCounters();

  // Start counter animations
  startCounters();

  // Initialize charts
  initializeCharts();

  // Add event listener to run counter animations on scroll
  window.addEventListener("scroll", handleScroll);

  // Reset and restart counters on visibility change
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) {
      resetCounters();
      startCounters();
    }
  });
});

// Reset all counters to zero
function resetCounters() {
  const countElements = document.querySelectorAll(".count-up");
  countElements.forEach((element) => {
    element.textContent = "0";
    element.setAttribute("data-counted", "false");
  });
}

// Start all counter animations
function startCounters() {
  const countElements = document.querySelectorAll(".count-up");
  countElements.forEach((element) => {
    animateCounter(element);
  });
}

// Handle scroll to trigger counter animations if in viewport
function handleScroll() {
  const countElements = document.querySelectorAll(
    '.count-up[data-counted="false"]'
  );

  countElements.forEach((element) => {
    if (isElementInViewport(element)) {
      animateCounter(element);
    }
  });
}

// Check if element is in viewport
function isElementInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Animate counter
function animateCounter(element) {
  if (element.getAttribute("data-counted") === "true") return;

  element.setAttribute("data-counted", "true");

  const target = parseInt(element.getAttribute("data-value"));
  const duration = 2000; // ms
  const start = 0;
  const startTime = performance.now();

  function updateCount(currentTime) {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    const value = Math.floor(progress * (target - start) + start);

    element.textContent = value;

    if (progress < 1) {
      requestAnimationFrame(updateCount);
    } else {
      element.textContent = target;
    }
  }

  requestAnimationFrame(updateCount);
}

// Initialize all charts
function initializeCharts() {
  // MBBS Chart
  initDonutChart("mbbs-chart", [72, 28], ["#8e2841", "#f1d7dc"]);

  // BDS Chart
  initDonutChart("bds-chart", [72, 28], ["#8e2841", "#f1d7dc"]);

  // Revenue Chart - With smaller size
  initDonutChart(
    "revenue-chart",
    [30, 35, 35],
    ["#8e2841", "#13406a", "#f1d7dc"]
  );

  // Attempts Chart
  initLineChart();
}

// Initialize donut chart
function initDonutChart(canvasId, data, colors) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  new Chart(ctx, {
    type: "doughnut",
    data: {
      datasets: [
        {
          data: data,
          backgroundColor: colors,
          borderWidth: 0,
          cutout: "80%",
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
        tooltip: {
          enabled: false,
        },
      },
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 2000,
      },
    },
  });
}

// Initialize line chart for attempt statistics
function initLineChart() {
  const canvas = document.getElementById("attempts-chart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  const lineChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [
        "8am",
        "9am",
        "10am",
        "11am",
        "12pm",
        "1pm",
        "2pm",
        "3pm",
        "4pm",
        "5pm",
      ],
      datasets: [
        {
          label: "MBBS 1",
          data: [250, 300, 200, 350, 400, 250, 300, 450, 350, 300],
          borderColor: "#8e2841",
          backgroundColor: "rgba(142, 40, 65, 0.1)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "BDS 2",
          data: [150, 200, 300, 250, 200, 350, 400, 300, 400, 450],
          borderColor: "#13406a",
          backgroundColor: "rgba(19, 64, 106, 0.1)",
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
          position: "top",
          align: "end",
          labels: {
            usePointStyle: true,
            boxWidth: 8,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            display: true,
            drawBorder: false,
          },
          ticks: {
            font: {
              size: 10,
            },
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 10,
            },
          },
        },
      },
      elements: {
        point: {
          radius: 0,
          hoverRadius: 6,
        },
      },
      interaction: {
        mode: "index",
        intersect: false,
      },
      animation: {
        duration: 2000,
      },
    },
  });

  // Add marker point at value 300
  const markerPlugin = {
    id: "marker",
    afterDraw(chart) {
      const xAxis = chart.scales.x;
      const yAxis = chart.scales.y;
      const ctx = chart.ctx;

      // Position for marker (at index 5 with value 300)
      const xPos = xAxis.getPixelForValue(5);
      const yPos = yAxis.getPixelForValue(300);

      // Draw marker
      ctx.save();
      ctx.beginPath();
      ctx.arc(xPos, yPos, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#8e2841";
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Draw value
      ctx.save();
      ctx.fillStyle = "#333";
      ctx.font = "bold 12px Arial";
      ctx.textAlign = "center";
      ctx.fillText("300", xPos, yPos - 15);
      ctx.restore();
    },
  };

  lineChart.config.plugins.push(markerPlugin);
  lineChart.update();
}
