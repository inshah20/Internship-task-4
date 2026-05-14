const steps = document.querySelectorAll(".form-step");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const progressFill = document.getElementById("progressFill");
const stepIndicators = document.querySelectorAll(".step");

let currentStep = 0;

window.addEventListener("DOMContentLoaded", () => {
  loadSavedData();
  showStep(currentStep);
});

function saveToLocalStorage() {

  const formData = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    username: document.getElementById("username").value,
    password: document.getElementById("password").value,
  };

  localStorage.setItem(
    "multiStepFormData",
    JSON.stringify(formData)
  );
}

function loadSavedData() {

  const savedData = JSON.parse(
    localStorage.getItem("multiStepFormData")
  );

  if (savedData) {

    document.getElementById("firstName").value =
      savedData.firstName || "";

    document.getElementById("lastName").value =
      savedData.lastName || "";

    document.getElementById("email").value =
      savedData.email || "";

    document.getElementById("phone").value =
      savedData.phone || "";

    document.getElementById("username").value =
      savedData.username || "";

    document.getElementById("password").value =
      savedData.password || "";

  }

}

function showStep(stepIndex) {

  steps.forEach((step, index) => {
    step.classList.toggle("active", index === stepIndex);
  });

  stepIndicators.forEach((step, index) => {
    step.classList.toggle("active", index <= stepIndex);
  });

  prevBtn.style.display =
    stepIndex === 0 ? "none" : "block";

  nextBtn.textContent =
    stepIndex === steps.length - 1
      ? "Submit"
      : "Next";

  updateProgressBar();
}

function updateProgressBar() {

  const progress =
    (currentStep / (steps.length - 1)) * 100;

  progressFill.style.width = `${progress}%`;
}

function validateStep() {

  let valid = true;

  const currentInputs =
    steps[currentStep].querySelectorAll("input");

  currentInputs.forEach((input) => {

    const error =
      input.parentElement.querySelector(".error");

    const value = input.value.trim();

    // Empty field validation
    if (value === "") {

      error.textContent =
        `${input.previousElementSibling.textContent} is required`;

      valid = false;
    }

    // Email validation
    else if (
      input.id === "email" &&
      !value.includes("@")
    ) {

      error.textContent =
        "Email must contain @";

      valid = false;
    }

    // Phone validation
    else if (
      input.id === "phone" &&
      !/^[0-9]+$/.test(value)
    ) {

      error.textContent =
        "Only numbers are allowed";

      valid = false;
    }

    else {

      error.textContent = "";

    }

  });

  return valid;
}

nextBtn.addEventListener("click", () => {

  if (!validateStep()) return;

  saveToLocalStorage();

  if (currentStep < steps.length - 1) {

    currentStep++;
    showStep(currentStep);

  } else {

    alert("Form Submitted Successfully!");

    localStorage.removeItem("multiStepFormData");

    document.getElementById("multiStepForm").reset();

    currentStep = 0;

    showStep(currentStep);

  }

});

prevBtn.addEventListener("click", () => {

  if (currentStep > 0) {

    currentStep--;
    showStep(currentStep);

  }

});

// Save data automatically
document.querySelectorAll("input").forEach((input) => {

  input.addEventListener("input", saveToLocalStorage);

});

// Phone input only numbers
document.getElementById("phone").addEventListener("input", function () {

  this.value = this.value.replace(/[^0-9]/g, "");

});

localStorage.clear();