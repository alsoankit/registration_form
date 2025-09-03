// js/form.js
import { getRegistrationStatus } from "./firestore.js";
import { signInUser, signOutUser } from "./auth.js";
import { submitFormToDB } from "./firestore.js";
import { auth } from "./firebase-config.js";

document.addEventListener("DOMContentLoaded", () => {
  // --- ELEMENT SELECTORS ---
  const formStepper = document.getElementById("form-stepper");
  const signInButton = document.getElementById("google-signin-btn");
  const registrationsClosedMessage = document.getElementById(
    "registrations-closed-message"
  );
  const logoutButton = document.getElementById("logout-btn");
  const userHeader = document.getElementById("user-header");
  const userDisplayName = document.getElementById("user-display-name");
  const toast = {
    element: document.getElementById("toast"),
    icon: document.getElementById("toast-icon"),
    message: document.getElementById("toast-message"),
    closeBtn: document.getElementById("toast-close-btn"),
  };
  const navButtons = {
    next2: document.getElementById("next-btn-page2"),
    back2: document.getElementById("back-btn-page2"),
    next3: document.getElementById("next-btn-page3"),
    back3: document.getElementById("back-btn-page3"),
    submit: document.getElementById("submit-btn"),
    back4: document.getElementById("back-btn-page4"),
    finish: document.getElementById("finish-btn"),
  };
  const fields = {
    name: document.getElementById("name"),
    rollNumber: document.getElementById("roll-number"),
    kiitEmail: document.getElementById("kiit-email"),
    phone: document.getElementById("phone-input"),
    whatsapp: document.getElementById("whatsapp-input"),
    personalEmail: document.getElementById("personal-email"),
    gender: document.getElementById("gender"),
    branch: document.getElementById("branch"),
    hostel: document.getElementById("hostel"),
    languages: document.querySelectorAll('input[name="language"]'),
    otherLanguage: document.getElementById("other-language-input"),
    primaryCompetency: document.getElementById("primary-competency"),
    otherCompetency: document.getElementById("other-competency"),
    hobbies: document.getElementById("hobbies"),
  };
  const errors = {
    name: document.getElementById("name-error"),
    rollNumber: document.getElementById("roll-number-error"),
    kiitEmail: document.getElementById("kiit-email-error"),
    phone: document.getElementById("phone-input-error"),
    whatsapp: document.getElementById("whatsapp-input-error"),
    personalEmail: document.getElementById("personal-email-error"),
    gender: document.getElementById("gender-error"),
    branch: document.getElementById("branch-error"),
    languages: document.getElementById("languages-error"),
    otherLanguage: document.getElementById("other-language-input-error"),
    hostel: document.getElementById("hostel-error"),
    primaryCompetency: document.getElementById("primary-competency-error"),
    otherCompetency: document.getElementById("other-competency-error"),
    hobbies: document.getElementById("hobbies-error"),
  };
  const langCheckboxButton = document.getElementById(
    "language-checkbox-button"
  );
  const langCheckboxDropdown = document.getElementById(
    "language-checkbox-dropdown"
  );
  const otherLangCheckbox = document.getElementById("lang-other");
  const otherLanguageContainer = document.getElementById(
    "other-language-container"
  );

  // --- STATE MANAGEMENT ---
  const validationState = {
    page2: { name: false, phone: false, whatsapp: false },
    page3: {
      personalEmail: false,
      gender: false,
      branch: false,
      languages: false,
      otherLanguage: true,
      hostel: false,
    },
    page4: { primaryCompetency: false, otherCompetency: false, hobbies: false },
  };

  // --- REGEX ---
  const regex = {
    name: /^[a-zA-Z\s.'-]+$/,
    phone: /^\+\d{1,4}\s\d{10}$/, // ◀◀◀ meets "+<1–4 digits> <10 digits>"
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    hostel: /^(KP|QC)-\d{1,2}[A-Z]?$|^Day Boarder$/i,
  };

  // --- HELPER FUNCTIONS ---
  // Add this new function inside the DOMContentLoaded listener
  const checkAndInitializeForm = async () => {
    const isOpen = await getRegistrationStatus();
    if (isOpen) {
      signInButton.classList.remove("hidden");
      registrationsClosedMessage.classList.add("hidden");
    } else {
      signInButton.classList.add("hidden");
      registrationsClosedMessage.classList.remove("hidden");
    }
  };
  const goToPage = (pageNumber) =>
    (formStepper.style.transform = `translateX(${(pageNumber - 1) * -100}%)`);
  const titleCase = (str) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  let toastTimeout;

  /**
   * Show a toast notification.
   *
   * @param {string} message    – Text to display in the toast.
   * @param {"info"|"success"|"error"} [type="info"] – Style of toast.
   * @param {number} [duration=5000] – How long (in ms) before auto-hiding.
   */
  const showToast = (message, type = "info", duration = 5000) => {
    clearTimeout(toastTimeout);

    // set message & reset icon container
    toast.message.textContent = message;
    toast.icon.className =
      "inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg";

    // choose icon & colors
    if (type === "success") {
      toast.icon.classList.add("bg-green-100", "text-green-500");
      toast.icon.innerHTML = `<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20"><path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/></svg>`;
    } else if (type === "error") {
      toast.icon.classList.add("bg-red-100", "text-red-500");
      toast.icon.innerHTML = `<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20"><path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/></svg>`;
    } else {
      toast.icon.classList.add("bg-blue-100", "text-blue-500");
      toast.icon.innerHTML = `<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20"><path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/></svg>`;
    }

    // show it
    toast.element.classList.remove("hidden");

    // hide after `duration` milliseconds
    toastTimeout = setTimeout(
      () => toast.element.classList.add("hidden"),
      duration
    );
  };

  toast.closeBtn.addEventListener("click", () =>
    toast.element.classList.add("hidden")
  );

  const updateFieldUI = (field, errorElement, message, isValid) => {
    const elementToStyle =
      field instanceof NodeList ? langCheckboxButton : field;
    if (!errorElement) return;

    if (isValid) {
      elementToStyle.classList.remove("border-red-500");
      elementToStyle.classList.add("border-green-500");
      errorElement.classList.add("hidden");
    } else {
      elementToStyle.classList.remove("border-green-500");
      elementToStyle.classList.add("border-red-500");
      errorElement.textContent = message;
      errorElement.classList.remove("hidden");
    }
  };

  const checkPageValidity = (pageNumber) => {
    let isPageValid = false;
    if (pageNumber === 2) {
      isPageValid = Object.values(validationState.page2).every(Boolean);
      navButtons.next2.disabled = !isPageValid;
    } else if (pageNumber === 3) {
      isPageValid = Object.values(validationState.page3).every(Boolean);
      navButtons.next3.disabled = !isPageValid;
    } else if (pageNumber === 4) {
      isPageValid = Object.values(validationState.page4).every(Boolean);
      navButtons.submit.disabled = !isPageValid;
    }
  };

  const updateLanguageButtonText = () => {
    const checkedLanguages = Array.from(fields.languages)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);
    const buttonTextSpan = document.getElementById("language-button-text");
    if (!buttonTextSpan) return;
    if (checkedLanguages.length === 0) {
      buttonTextSpan.textContent = "Select languages";
      buttonTextSpan.classList.add("text-gray-500");
    } else if (checkedLanguages.length <= 2) {
      buttonTextSpan.textContent = checkedLanguages.join(", ");
      buttonTextSpan.classList.remove("text-gray-500");
    } else {
      buttonTextSpan.textContent = `${checkedLanguages.length} languages selected`;
      buttonTextSpan.classList.remove("text-gray-500");
    }
  };

  const countryList = [
    { name: "India", code: "+91", flagId: "in" },
    { name: "Nepal", code: "+977", flagId: "np" },
    { name: "Bangladesh", code: "+880", flagId: "bd" },
    { name: "Sri Lanka", code: "+975", flagId: "lk" },
    { name: "Other", code: "", flagId: "other" },
  ];

  function setupCountryDropdown(fieldKey, inputEl, btnEl, containerEl) {
    // grab the <img> in the main button
    const imgEl = btnEl.querySelector("img");

    // toggle menu on button click
    btnEl.addEventListener("click", (e) => {
      e.stopPropagation();
      containerEl.classList.toggle("hidden");
    });

    const menu = containerEl.querySelector("ul");
    // clear any existing items
    menu.innerHTML = "";

    countryList.forEach((country) => {
      const li = document.createElement("li");
      const optionBtn = document.createElement("button");
      optionBtn.type = "button";
      optionBtn.role = "menuitem";
      optionBtn.className =
        "inline-flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-[#2563EB] hover:text-white";

      optionBtn.dataset.dial = country.code;

      // inline <img> for each flag
      optionBtn.innerHTML = `
      <img
        src="/images/flags/${country.flagId}.svg"
        alt="${country.name} flag"
        class="h-4 w-4 me-2"
      />
      ${country.name}${country.code ? ` (${country.code})` : ""}
    `;

      optionBtn.addEventListener("click", () => {
        // swap the main button's flag img + alt
        imgEl.src = `/images/flags/${country.flagId}.svg`;
        imgEl.alt = `${country.name} flag`;
        // update dial text
        btnEl.querySelector(".dial").textContent = country.code;

        // adjust input type / placeholder / data-dial
        if (country.name === "Other") {
          inputEl.type = "text";
          inputEl.placeholder = "+XXX XXXXXXXXXX";
          inputEl.removeAttribute("data-dial");
        } else {
          inputEl.type = "tel";
          inputEl.placeholder = "XXXXXXXXXX";
          inputEl.dataset.dial = country.code;
        }

        containerEl.classList.add("hidden");
        validateField(fieldKey);
      });

      li.appendChild(optionBtn);
      menu.appendChild(li);
    });

    // default to first country (India)
    imgEl.src = `/images/flags/${countryList[0].flagId}.svg`;
    imgEl.alt = `${countryList[0].name} flag`;
    inputEl.dataset.dial = countryList[0].code;
  }

  setupCountryDropdown(
    "phone",
    fields.phone,
    document.getElementById("phone-country-btn"),
    document.getElementById("phone-country-menu")
  );
  setupCountryDropdown(
    "whatsapp",
    fields.whatsapp,
    document.getElementById("whatsapp-country-btn"),
    document.getElementById("whatsapp-country-menu")
  );

  // --- CORE VALIDATION LOGIC ---
  const validateField = (fieldName) => {
    const field = fields[fieldName];
    const errorEl = errors[fieldName];
    let isValid = false;
    let message = "";

    switch (fieldName) {
      case "name":
        const nameValue = field.value;
        if (!nameValue.trim()) {
          message = "Full name is required.";
        } else if (!regex.name.test(nameValue)) {
          message = "Please enter a valid name (letters and spaces only).";
        } else {
          isValid = true;
        }
        validationState.page2.name = isValid;
        break;

      case "phone":
      case "whatsapp":
        const raw = field.value.trim();
        const dial = field.dataset.dial || "";
        const combined = dial ? `${dial} ${raw}` : raw;

        if (!raw) {
          message = "This field is required.";
        } else if (!regex.phone.test(combined)) {
          message = "Invalid format. Use 10-digit number.";
        } else {
          isValid = true;
        }
        validationState.page2[fieldName] = isValid;
        break;

      case "personalEmail":
        const emailValue = field.value?.trim();
        if (!emailValue) {
          message = "Personal email is required.";
        } else if (!regex.email.test(emailValue)) {
          message = "Please enter a valid email address.";
        } else {
          isValid = true;
        }
        validationState.page3.personalEmail = isValid;
        break;

      case "gender":
      case "branch":
      case "primaryCompetency":
      case "otherCompetency":
        isValid = !!field.value;
        if (!isValid) message = "Please make a selection.";
        if (["gender", "branch"].includes(fieldName))
          validationState.page3[fieldName] = isValid;
        else validationState.page4[fieldName] = isValid;
        break;

      case "languages":
        isValid = Array.from(field).some((cb) => cb.checked);
        if (!isValid) message = "Please select at least one language.";
        validationState.page3.languages = isValid;
        validateField("otherLanguage");
        break;

      case "otherLanguage":
        const otherLangValue = field.value?.trim();
        isValid = !otherLangCheckbox.checked || !!otherLangValue;
        if (!isValid) message = "Please specify the language.";
        validationState.page3.otherLanguage = isValid;
        break;

      case "hostel":
        const hostelValue = field.value?.trim();
        if (!hostelValue) {
          message = "This field cannot be empty.";
        } else if (!regex.hostel.test(hostelValue)) {
          message = "Invalid format. Use KP-XX, QC-XX, or Day Boarder.";
        } else {
          isValid = true;
        }
        validationState.page3.hostel = isValid;
        break;

      case "hobbies":
        const hobbiesValue = field.value?.trim();
        isValid = !!hobbiesValue;
        if (!isValid) message = "This field cannot be empty.";
        validationState.page4.hobbies = isValid;
        break;
    }

    updateFieldUI(field, errorEl, message, isValid);
    if (validationState.page2.hasOwnProperty(fieldName)) checkPageValidity(2);
    if (
      validationState.page3.hasOwnProperty(fieldName) ||
      fieldName === "otherLanguage"
    )
      checkPageValidity(3);
    if (validationState.page4.hasOwnProperty(fieldName)) checkPageValidity(4);
  };

  // --- EVENT LISTENERS ---
  signInButton.addEventListener("click", async () => {
    const result = await signInUser();
    if (result.success) {
      userHeader.classList.remove("hidden");
      userDisplayName.textContent = result.user.displayName;
      fields.name.value = titleCase(result.user.displayName);
      fields.kiitEmail.value = result.user.email;
      fields.rollNumber.value = result.user.rollNumber;
      validateField("name");
      goToPage(2);
    } else {
      if (result.error === "invalid-email") {
        showToast("Only @kiit.ac.in emails are allowed.", "error");
      } else if (result.error === "ineligible-batch") {
        // extended to 10 seconds
        showToast(
          "This recruitment drive is only for 2nd year students of School of Computer Engineering. If you are an eligible student, contact us on the phone number given below.",
          "error",
          10000
        );
      } else if (result.error !== "auth/popup-closed-by-user") {
        showToast(`Sign-in failed: ${result.error}`, "error");
      }
    }
  });

  logoutButton.addEventListener("click", async () => {
    const result = await signOutUser();
    if (result.success) {
      userHeader.classList.add("hidden");
      goToPage(1);
      showToast("You have been logged out.", "info");
    } else {
      showToast("Logout failed. Please try again.", "error");
    }
  });

  // Main validation loop
  [
    "name",
    "phone",
    "whatsapp",
    "personalEmail",
    "gender",
    "branch",
    "hostel",
    "primaryCompetency",
    "otherCompetency",
    "hobbies",
    "otherLanguage",
  ].forEach((fieldName) => {
    const el = fields[fieldName];
    if (el) {
      const eventType = el.tagName === "SELECT" ? "change" : "input";
      el.addEventListener(eventType, () => validateField(fieldName));
      el.addEventListener("blur", () => {
        validateField(fieldName);
        if (fieldName === "name" && fields.name.value) {
          fields.name.value = titleCase(fields.name.value);
        }
      });
    }
  });

  // Language checkbox dropdown
  if (langCheckboxButton) {
    langCheckboxButton.addEventListener("click", (e) => {
      e.stopPropagation();
      langCheckboxDropdown.classList.toggle("hidden");
    });

    // Add a direct listener to each checkbox for immediate feedback
    fields.languages.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        validateField("languages");
        updateLanguageButtonText();
      });
    });

    // Prevent clicks inside the dropdown from closing it
    langCheckboxDropdown.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  if (otherLangCheckbox) {
    otherLangCheckbox.addEventListener("change", () => {
      otherLanguageContainer.classList.toggle(
        "hidden",
        !otherLangCheckbox.checked
      );
      validateField("languages");
    });
  }

  window.addEventListener("click", (e) => {
    if (langCheckboxDropdown && !langCheckboxButton.contains(e.target)) {
      langCheckboxDropdown.classList.add("hidden");
    }
  });

  // Navigation listeners
  navButtons.back2.addEventListener("click", () => goToPage(1));
  navButtons.next2.addEventListener("click", () => goToPage(3));
  navButtons.back3.addEventListener("click", () => goToPage(2));
  navButtons.next3.addEventListener("click", () => goToPage(4));
  navButtons.back4.addEventListener("click", () => goToPage(3));

  navButtons.submit.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) {
      showToast("You are not signed in.", "error");
      return;
    }
    navButtons.submit.textContent = "Submitting...";
    navButtons.submit.disabled = true;

    // ◀◀◀ Combine country code + raw before saving
    const makeFull = (fld) => {
      const raw = fld.value.trim();
      return fld.dataset.dial ? `${fld.dataset.dial} ${raw}` : raw;
    };
    const phoneFull = makeFull(fields.phone);
    const whatsappFull = makeFull(fields.whatsapp);

    const languagesKnown = Array.from(fields.languages)
      .filter((cb) => cb.checked)
      .map((cb) =>
        cb.value === "Other" && fields.otherLanguage.value.trim()
          ? fields.otherLanguage.value.trim()
          : cb.value
      )
      .filter(
        (value) =>
          value !== "Other" ||
          (value === "Other" && fields.otherLanguage.value.trim())
      );

    const formData = {
      name: fields.name.value,
      rollNumber: fields.rollNumber.value,
      kiitEmail: fields.kiitEmail.value,
      phone: phoneFull,
      whatsapp: whatsappFull,
      personalEmail: fields.personalEmail.value,
      gender: fields.gender.value,
      branch: fields.branch.value,
      languagesKnown: languagesKnown,
      hostel: fields.hostel.value,
      primaryCompetency: fields.primaryCompetency.value,
      otherCompetency: fields.otherCompetency.value,
      hobbies: fields.hobbies.value,
    };

    const result = await submitFormToDB(user.uid, formData);
    if (result.success) {
      goToPage(5);
    } else {
      if (result.error === "already-submitted") {
        showToast("You have already submitted the form.", "error");
      } else {
        showToast("Submission failed. Please try again.", "error");
      }
      navButtons.submit.textContent = "Submit";
      navButtons.submit.disabled = false;
    }
  });

  navButtons.finish.addEventListener("click", () => {
    showToast("Application process finished! Redirecting...", "success");
    setTimeout(() => {
      window.location.href = "https://nss-sce-website.vercel.app/";
    }, 1500);
  });

  // --- INITIAL STATE ---
  navButtons.next2.disabled = true;
  navButtons.next3.disabled = true;
  navButtons.submit.disabled = true;

  // Check status and initialize the form on page load
  checkAndInitializeForm();
  goToPage(1);
});
