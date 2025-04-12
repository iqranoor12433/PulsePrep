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

  // Form functionality for the Manage Questions page
  setupFormInteractions();
});

function setupFormInteractions() {
  // Toggle correct answer
  const answerOptions = document.querySelectorAll(
    '.answer-option input[type="radio"]'
  );

  answerOptions.forEach((radio) => {
    radio.addEventListener("change", function () {
      updateCorrectAnswerTags();
    });
  });

  // Initially set correct answer tag
  updateCorrectAnswerTags();

  // Add answer button functionality
  const addAnswerBtn = document.querySelector(".add-answer-btn");
  if (addAnswerBtn) {
    addAnswerBtn.addEventListener("click", function () {
      addNewAnswer();
    });
  }

  // Add button in the add answers row
  const btnAdd = document.querySelector(".btn-add");
  if (btnAdd) {
    btnAdd.addEventListener("click", function () {
      const addAnswerText = document.querySelector(".add-answer-text");
      if (addAnswerText.value.trim() !== "") {
        addAnswerFromInput(addAnswerText.value);
        addAnswerText.value = "";
      } else {
        showNotification("Please enter an answer text", "error");
      }
    });
  }

  // Remove button in the add answers row
  const btnRemove = document.querySelector(".btn-remove");
  if (btnRemove) {
    btnRemove.addEventListener("click", function () {
      document.querySelector(".add-answer-text").value = "";
    });
  }

  // Add delete buttons for existing answer options
  setupAnswerOptionDeleteButtons();

  // Add edit functionality to pencil icons
  const editBtns = document.querySelectorAll(".edit-btn");
  editBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Get the question item
      const questionItem = this.closest(".question-item");

      // Add editing class to highlight
      questionItem.classList.add("editing");

      // Get the question text
      const questionText = questionItem.querySelector(
        ".question-content span"
      ).textContent;

      // Set the question text in the editor
      document.getElementById("question-text").value = questionText;

      // Focus on the question type dropdown
      document.getElementById("question-type").focus();

      // Scroll to editor
      document
        .querySelector(".question-editor-card")
        .scrollIntoView({ behavior: "smooth" });
    });
  });

  // Add question button in header
  const addQuestionBtn = document.querySelector(".add-question-btn");
  if (addQuestionBtn) {
    addQuestionBtn.addEventListener("click", function () {
      // Clear previous inputs
      document.getElementById("question-text").value = "";

      // Reset radio selections
      const radioButtons = document.querySelectorAll(
        '.answer-option:not(.add-answer-input) input[type="radio"]'
      );
      radioButtons.forEach((radio) => {
        radio.checked = false;
      });

      // Hide all correct answer tags
      document.querySelectorAll(".correct-tag").forEach((tag) => {
        tag.style.display = "none";
      });

      // Clear the add answer input if it exists
      const addAnswerText = document.querySelector(".add-answer-text");
      if (addAnswerText) {
        addAnswerText.value = "";
      }

      // Focus on the question type dropdown
      const questionType = document.getElementById("question-type");

      // Scroll to the question editor
      const questionEditor = document.querySelector(".question-editor-card");
      if (questionEditor) {
        questionEditor.scrollIntoView({ behavior: "smooth" });

        // After scrolling, focus on the question type
        setTimeout(() => {
          questionType.focus();
        }, 500);
      }
    });
  }

  // Add question submit button functionality
  const addQuestionSubmit = document.querySelector(".add-question-submit");
  if (addQuestionSubmit) {
    addQuestionSubmit.addEventListener("click", function () {
      const questionText = document.getElementById("question-text").value;
      if (questionText.trim() === "") {
        showNotification("Please enter a question text", "error");
        return;
      }

      // Check if at least one answer is selected as correct
      const anyCorrect = Array.from(
        document.querySelectorAll(
          '.answer-option:not(.add-answer-input) input[type="radio"]'
        )
      ).some((radio) => radio.checked);
      if (!anyCorrect) {
        showNotification("Please select a correct answer", "error");
        return;
      }

      // Add the question to the questions list
      addQuestionToList(questionText);

      showNotification("Question added successfully!");

      // Clear the form for the next question
      document.getElementById("question-text").value = "";

      // Reset radio selections
      document
        .querySelectorAll('.answer-option input[type="radio"]')
        .forEach((radio) => {
          radio.checked = false;
        });

      // Hide all correct answer tags
      document.querySelectorAll(".correct-tag").forEach((tag) => {
        tag.style.display = "none";
      });

      // Scroll to questions list
      document
        .querySelector(".questions-list-card")
        .scrollIntoView({ behavior: "smooth" });
    });
  }

  // Add delete functionality to question delete buttons
  const questionDeleteBtns = document.querySelectorAll(
    ".question-item .delete-btn"
  );
  questionDeleteBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const questionItem = this.closest(".question-item");
      if (confirm("Are you sure you want to delete this question?")) {
        questionItem.style.opacity = "0";
        questionItem.style.height = "0";
        questionItem.style.overflow = "hidden";
        questionItem.style.padding = "0";
        questionItem.style.margin = "0";
        questionItem.style.border = "none";

        setTimeout(() => {
          questionItem.remove();
          renumberQuestions();
        }, 300);

        showNotification("Question deleted");
      }
    });
  });
}

// Add delete buttons to all answer options
function setupAnswerOptionDeleteButtons() {
  const answerOptions = document.querySelectorAll(
    ".answer-option:not(.add-answer-input)"
  );

  answerOptions.forEach((option) => {
    // Only add delete button if it doesn't already have one
    if (!option.querySelector(".delete-option-btn")) {
      const deleteButton = document.createElement("button");
      deleteButton.className = "delete-option-btn";
      deleteButton.innerHTML = '<i class="fas fa-times"></i>';
      deleteButton.addEventListener("click", function () {
        deleteAnswerOption(option);
      });

      option.appendChild(deleteButton);
    }
  });
}

// Delete an answer option
function deleteAnswerOption(option) {
  option.classList.add("deleting");

  setTimeout(() => {
    option.remove();

    // Renumber remaining answer options
    const options = document.querySelectorAll(
      ".answer-option:not(.add-answer-input)"
    );
    options.forEach((opt, index) => {
      const radio = opt.querySelector('input[type="radio"]');
      const label = opt.querySelector("label");

      if (radio && label) {
        radio.id = `answer${index + 1}`;
        label.setAttribute("for", `answer${index + 1}`);
      }
    });

    // Update correct answer tags
    updateCorrectAnswerTags();

    showNotification("Answer option deleted");
  }, 300);
}

// Update correct answer tags based on radio selection
function updateCorrectAnswerTags() {
  const answerOptions = document.querySelectorAll(
    ".answer-option:not(.add-answer-input)"
  );

  answerOptions.forEach((option) => {
    const radio = option.querySelector('input[type="radio"]');
    let tag = option.querySelector(".correct-tag");

    // If tag doesn't exist, create it
    if (!tag && radio && radio.checked) {
      tag = document.createElement("span");
      tag.className = "correct-tag";
      tag.textContent = "Correct answer";
      option.appendChild(tag);
    } else if (tag) {
      if (radio && radio.checked) {
        tag.style.display = "inline-block";
      } else {
        tag.style.display = "none";
      }
    }
  });
}

// Add a new answer option
function addNewAnswer() {
  const answerOptions = document.querySelector(".answer-options");
  const answerCount = document.querySelectorAll(
    ".answer-option:not(.add-answer-input)"
  ).length;
  const newIndex = answerCount + 1;

  // Create new answer option
  const newOption = document.createElement("div");
  newOption.className = "answer-option new-answer";

  // HTML for the new option
  newOption.innerHTML = `
        <input type="radio" name="correct-answer" id="answer${newIndex}">
        <label for="answer${newIndex}" class="radio-label">Answers ${newIndex}</label>
        <button class="delete-option-btn"><i class="fas fa-times"></i></button>
    `;

  // Get the add answers input row and insert before it
  const addAnswerInput = document.querySelector(
    ".answer-option.add-answer-input"
  );
  if (addAnswerInput) {
    answerOptions.insertBefore(newOption, addAnswerInput);
  } else {
    answerOptions.appendChild(newOption);
  }

  // Add event listener to the new radio button
  const newRadio = newOption.querySelector('input[type="radio"]');
  newRadio.addEventListener("change", function () {
    updateCorrectAnswerTags();
  });

  // Add event listener to the delete button
  const deleteBtn = newOption.querySelector(".delete-option-btn");
  deleteBtn.addEventListener("click", function () {
    deleteAnswerOption(newOption);
  });
}

// Add a new answer option
function addNewAnswer() {
  const answerOptions = document.querySelector(".answer-options");
  const answerCount = document.querySelectorAll(
    ".answer-option:not(.add-answer-input)"
  ).length;
  const newIndex = answerCount + 1;

  // Create new answer option
  const newOption = document.createElement("div");
  newOption.className = "answer-option new-answer";

  // HTML for the new option with correct tag positioned after the label
  newOption.innerHTML = `
        <input type="radio" name="correct-answer" id="answer${newIndex}">
        <label for="answer${newIndex}" class="radio-label">Answers ${newIndex}</label>
        <span class="correct-tag" style="display: none;">Correct answer</span>
        <button class="delete-option-btn"><i class="fas fa-times"></i></button>
    `;

  // Get the add answers input row and insert before it
  const addAnswerInput = document.querySelector(
    ".answer-option.add-answer-input"
  );
  if (addAnswerInput) {
    answerOptions.insertBefore(newOption, addAnswerInput);
  } else {
    answerOptions.appendChild(newOption);
  }

  // Add event listener to the new radio button
  const newRadio = newOption.querySelector('input[type="radio"]');
  newRadio.addEventListener("change", function () {
    updateCorrectAnswerTags();
  });

  // Add event listener to the delete button
  const deleteBtn = newOption.querySelector(".delete-option-btn");
  deleteBtn.addEventListener("click", function () {
    deleteAnswerOption(newOption);
  });
}

// Add answer from the input
function addAnswerFromInput(text) {
  const answerOptions = document.querySelector(".answer-options");
  const answerCount = document.querySelectorAll(
    ".answer-option:not(.add-answer-input)"
  ).length;
  const newIndex = answerCount + 1;

  // Create new answer option
  const newOption = document.createElement("div");
  newOption.className = "answer-option new-answer";

  // HTML for the new option with correct tag positioned after the label
  newOption.innerHTML = `
        <input type="radio" name="correct-answer" id="answer${newIndex}">
        <label for="answer${newIndex}" class="radio-label">${text}</label>
        <span class="correct-tag" style="display: none;">Correct answer</span>
        <button class="delete-option-btn"><i class="fas fa-times"></i></button>
    `;

  // Get the add answers input row and insert before it
  const addAnswerInput = document.querySelector(
    ".answer-option.add-answer-input"
  );
  if (addAnswerInput) {
    answerOptions.insertBefore(newOption, addAnswerInput);
  } else {
    answerOptions.appendChild(newOption);
  }

  // Add event listener to the new radio button
  const newRadio = newOption.querySelector('input[type="radio"]');
  newRadio.addEventListener("change", function () {
    updateCorrectAnswerTags();
  });

  // Add event listener to the delete button
  const deleteBtn = newOption.querySelector(".delete-option-btn");
  deleteBtn.addEventListener("click", function () {
    deleteAnswerOption(newOption);
  });
}

// Update correct answer tags based on radio selection
function updateCorrectAnswerTags() {
  const answerOptions = document.querySelectorAll(
    ".answer-option:not(.add-answer-input)"
  );

  answerOptions.forEach((option) => {
    const radio = option.querySelector('input[type="radio"]');
    let tag = option.querySelector(".correct-tag");

    // If tag doesn't exist, create it after the label
    if (!tag && radio && radio.checked) {
      const label = option.querySelector(".radio-label");
      tag = document.createElement("span");
      tag.className = "correct-tag";
      tag.textContent = "Correct answer";

      // Insert after the label
      if (label && label.nextSibling) {
        option.insertBefore(tag, label.nextSibling);
      } else {
        option.appendChild(tag);
      }
    } else if (tag) {
      if (radio && radio.checked) {
        tag.style.display = "inline-block";
      } else {
        tag.style.display = "none";
      }
    }
  });
}

// Add a question to the questions list
function addQuestionToList(questionText) {
  const questionsList = document.querySelector(".questions-table");
  const questionsCount = document.querySelectorAll(".question-item").length;
  const newQuestionNumber = questionsCount + 1;

  // Create new question item
  const newQuestion = document.createElement("div");
  newQuestion.className = "question-item";

  // Get the selected question type
  const questionType = document.getElementById("question-type");
  const selectedType = questionType ? questionType.value : "Multiple Choice";

  // Get the icon based on question type
  let typeIcon = "far fa-square-check";
  if (selectedType.includes("True/False")) {
    typeIcon = "fas fa-toggle-on";
  } else if (selectedType.includes("Short Answer")) {
    typeIcon = "fas fa-font";
  } else if (selectedType.includes("Essay")) {
    typeIcon = "fas fa-align-left";
  }

  // HTML for the new question
  newQuestion.innerHTML = `
        <div class="question-number">
            <i class="fas fa-grip-lines"></i>
            <span>Question ${newQuestionNumber}</span>
        </div>
        <div class="question-content">
            <div class="question-type">
                <i class="${typeIcon}"></i>
            </div>
            <span>${questionText}</span>
        </div>
        <div class="question-actions">
            <button class="edit-btn"><i class="fas fa-pencil"></i></button>
            <button class="delete-btn"><i class="fas fa-trash"></i></button>
        </div>
    `;

  // Add to the questions list
  questionsList.appendChild(newQuestion);

  // Add event listeners to the new buttons
  const editBtn = newQuestion.querySelector(".edit-btn");
  editBtn.addEventListener("click", function () {
    // Remove editing class from all items
    document.querySelectorAll(".question-item").forEach((item) => {
      item.classList.remove("editing");
    });

    // Add editing class to highlight
    newQuestion.classList.add("editing");

    // Set the question text in the editor
    document.getElementById("question-text").value = questionText;

    // Focus on the question type dropdown
    document.getElementById("question-type").focus();

    // Scroll to editor
    document
      .querySelector(".question-editor-card")
      .scrollIntoView({ behavior: "smooth" });
  });

  const deleteBtn = newQuestion.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", function () {
    if (confirm("Are you sure you want to delete this question?")) {
      newQuestion.style.opacity = "0";
      newQuestion.style.height = "0";
      newQuestion.style.overflow = "hidden";
      newQuestion.style.padding = "0";
      newQuestion.style.margin = "0";
      newQuestion.style.border = "none";

      setTimeout(() => {
        newQuestion.remove();
        renumberQuestions();
      }, 300);

      showNotification("Question deleted");
    }
  });
}

// Renumber questions after deletion
function renumberQuestions() {
  const questions = document.querySelectorAll(".question-item");
  questions.forEach((question, index) => {
    question.querySelector(".question-number span").textContent = `Question ${
      index + 1
    }`;
  });
}

// Show notification
// Show compact notification
function showNotification(message) {
  // Remove any existing notifications
  const existingNotifications = document.querySelectorAll(".notification");
  existingNotifications.forEach((notif) => notif.remove());

  // Create a new notification
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  document.body.appendChild(notification);

  // Show the notification
  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  // Automatically hide after 2.5 seconds (reduced time for faster feedback)
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 2500);
}
