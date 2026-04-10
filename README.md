# 🛡️ NexGen Workforce: Elite Employee Management System

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.1-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/Database-MySQL-orange.svg)](https://www.mysql.com/)
[![NexGen AI](https://img.shields.io/badge/AI-Gemini%202.0-blueviolet.svg)](https://aistudio.google.com/)

**NexGen Workforce** is a state-of-the-art Employee Management System (EMS) designed for elite organizations. Featuring a sleek, cinematic "Nighthawk Elite" aesthetic and real-time AI integration, it provides an unparalleled experience for both administrators and employees.

---

## ✨ Cutting-Edge Features  

### 🧠 NexGen AI Assistant
- **Context-Aware Intelligence:** Real-time analysis of workforce data (attendance, leaves, staff count).
- **Neural Link:** Integrated Gemini 2.0 Flash engine for professional, HR-centric responses.
- **Deep Sync Active:** Mobile-responsive chat interface with glassmorphism design.

### 🛡️ Secure Bi-Portal Architecture
- **Admin Command Center:** Secure access for management with mandatory Master PIN verification.
- **Employee Portal:** Personalized dashboards for standard personnel.
- **JWT Authentication:** Secure, stateless sessions for all mission-critical operations.

### 📊 Mission Control (Modules)
- **Personnel Management:** Full CRUD operations for employee records with secure data handling.
- **Attendance Tracking:** Real-time check-in/check-out system with daily status reporting.
- **Leave Operations:** Comprehensive request and approval workflow with status tracking.
- **Salary Management:** Automated calculation and management of workforce compensation.
- **Task Deployment:** Assign and track mission objectives for individual personnel.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Framer Motion (Animations), Bootstrap 5 |
| **Backend** | Java 21, Spring Boot 3.4, Spring Security, JWT |
| **Database** | MySQL 8.0 |
| **Intelligence** | Google Gemini API (2.0 Flash) |
| **Styling** | Vanilla CSS (Nighthawk Glassmorphism), Lucide Icons |

---

## 🚀 Deployment Guide

### Backend (Spring Boot)
1. **Database Setup:**
   - Create a MySQL database named `ems`.
   - Update `src/main/resources/application.properties` with your credentials.
2. **AI Configuration:**
   - Get a Gemini API key from [Google AI Studio](https://aistudio.google.com/).
   - Set `app.ai.api-key` in `application.properties`.
3. **Launch Mission:**
   ```bash
   mvn spring-boot:run
   ```

### Frontend (React)
1. **Initialize Commands:**
   ```bash
   cd ems
   npm install
   ```
2. **Sync Link:**
   - Ensure the `app.frontend.url` in the backend properties matches your local environment.
3. **Engage UI:**
   ```bash
   npm run dev
   ```

---

## 🔗 Project Connections

- **GitHub Repository:** [rohanmane7890/ems-backend](https://github.com/rohanmane7890/ems-backend)
- **LinkedIn:** [Rohan Mane](https://www.linkedin.com/in/rohan-mane-455640280/)
- **Live Demo (Internal):** [NexGen Workforce Portal](https://dull-catfish-78.loca.lt/)

---

> [!NOTE]
> *“Empowering the workforce of tomorrow, today.”* — **The NexGen Elite Team**
