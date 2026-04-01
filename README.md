# 📋 NSS SCE KIIT Registration Portal

[![Aesthetics](https://img.shields.io/badge/UI%2FUX-Premium-blueviolet?style=for-the-badge&logo=adobe-photoshop)](https://github.com/alsoankit/registration_form)
[![Tech Stack](https://img.shields.io/badge/Tech-Firebase%20|%20Tailwind-blue?style=for-the-badge&logo=firebase)](https://github.com/alsoankit/registration_form)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

A modern, high-performance registration portal built for the **National Service Scheme (NSS), SCE KIIT Chapter**. This application streamlines the recruitment process with a secure, multi-step workflow, real-time validation, and seamless Firebase integration.

---

## 🚀 Live Demo
> **Note:** The portal is currently in **Showcase Mode** (Mock Database Enabled).
> [View Live Project](https://nss-sce-registration.vercel.app/)

---

## ✨ Key Features

-   **🔐 Secure Google Authentication**
    -   Integrated with Firebase Auth for student verification.
    -   Domain-specific restrictions (KIIT University) can be toggled via backend config.
-   **📑 Multi-Step Intuitive Form**
    -   Divided into Personal, Academic, and Skills sections to reduce cognitive load.
    -   Dynamic progress tracking via CSS-based stepper logic.
-   **⚡ Real-Time Client-Side Validation**
    -   Regex-powered validation for Names, Emails, Roll Numbers, and Phone formats.
    -   Instant visual feedback (Success/Error states) using Tailwind CSS.
-   **🌍 Globalization Support**
    -   Dynamic Country Code selector (India, Nepal, Bangladesh, Sri Lanka).
    -   Support for "Other" international formats.
-   **📊 Firebase Cloud Integration**
    -   **Firestore:** Scalable NoSQL storage for student data.
    -   **Server Timestamps:** Precise tracking of submission times.
-   **📱 Fully Responsive Design**
    -   Optimized for Mobile, Tablet, and Desktop using Tailwind's mobile-first approach.

---

## 🛠️ Tech Stack (ATS-Friendly)

### **Frontend**
-   **HTML5 & CSS3:** Semantic markup and custom modern styling.
-   **JavaScript (ES6+):** Modular logic, async/await operations, and DOM manipulation.
-   **Tailwind CSS:** Utility-first framework for rapid, responsive UI development.
-   **Google Fonts:** Inter & Roboto for premium typography.

### **Backend & DevOps**
-   **Firebase Authentication:** Identity management and social login.
-   **Firestore Database:** Real-time NoSQL data management.
-   **Environment Management:** Secure credential handling via `.env`.
-   **Static Hosting:** Optimized for platforms like Vercel/Netlify.

---

## 📸 Screenshots (Mockups)

| Welcome & Auth | Form Step 1 | Success Screen |
| :---: | :---: | :---: |
| ![Welcome](https://via.placeholder.com/400x800?text=Welcome+Page) | ![Form](https://via.placeholder.com/400x800?text=Multi-step+Form) | ![Success](https://via.placeholder.com/400x800?text=Submission+Success) |

---

## ⚙️ Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/alsoankit/registration_form.git
    cd registration_form
    ```

2.  **Environment Configuration**
    -   Create a `.env` file in the root directory.
    -   Add your Firebase credentials (use `.env.example` as a template):
    ```env
    API_KEY=your_api_key
    AUTH_DOMAIN=your_auth_domain
    PROJECT_ID=your_project_id
    STORAGE_BUCKET=your_storage_bucket
    MESSAGING_SENDER_ID=your_messaging_sender_id
    APP_ID=your_app_id
    ```

3.  **Run Locally**
    -   Open `index.html` using a Live Server (VS Code Extension recommended).
    -   Ensure your Firebase Security Rules allow reads/writes to `showcase_submissions` (for demo purposes).

---

## 📂 Project Structure

```text
registration_form/
├── css/                # Custom Stylesheets
├── js/
│   ├── auth.js         # Firebase Auth Handlers
│   ├── firestore.js    # Database Operations
│   ├── form.js         # Core UI Logic & Validation
│   └── firebase-config.js
├── images/             # Optimized Assets & Icons
├── index.html          # Main Entry Point
├── .env.example        # Environment Template
└── .gitignore          # Repository Settings
```

---

## 🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📬 Contact

**Ankit Kumar** - [LinkedIn](https://www.linkedin.com/in/alsoankit/) - [GitHub](https://github.com/alsoankit)

Project Link: [https://github.com/alsoankit/registration_form](https://github.com/alsoankit/registration_form)

---

<p align="center">Made with ❤️ by <strong>Ankit Kumar</strong> for NSS SCE KIIT</p>
