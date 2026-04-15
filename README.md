# 🛡️ NexGen Workforce: Elite Employee Management System

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.1-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/Database-MySQL-orange.svg)](https://www.mysql.com/)


**NexGen Workforce** is a state-of-the-art Employee Management System (EMS) designed for elite organizations. Featuring a sleek, cinematic "Nighthawk Elite" aesthetic, it provides an unparalleled experience for both administrators and employees.

---

## ✨ Cutting-Edge Features  


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
| **Styling** | Vanilla CSS (Nighthawk Glassmorphism), Lucide Icons |

---

## 🚀 Deployment Guide

### Option 1: Local Development (Separate Servers)
Run the React frontend and Spring Boot backend separately for active development:
1. **Database Setup:** Create a MySQL database and update `src/main/resources/application.properties` with local credentials.
2. **Launch Backend:**
   ```bash
   mvn spring-boot:run
   ```
3. **Launch Frontend:**
   ```bash
   cd ems
   npm install
   npm run dev
   ```

### Option 2: Production Deployment (Unified Cloud Server)
The application is pre-configured to bundle the React frontend *inside* the Spring Boot backend, resulting in a single deployment file. The app is set up to automatically deploy on platforms like **Render.com** and **Aiven MySQL**.

**Required Cloud Environment Variables:**
| Key | Example Value | Description |
| :--- | :--- | :--- |
| `DB_URL` | `jdbc:mysql://[aiven-host]:[port]/[db]?useSSL=true` | JDBC Connection String |
| `DB_USERNAME` | `avnadmin` | MySQL Username |
| `DB_PASSWORD` | `[SUPER_SECRET]` | MySQL Password |
| `UPLOAD_DIR` | `./uploads/` | App-level folder to securely save uploaded images on Linux |

**Cloud Build & Run Commands:**
If hosting on Render, use the `Java` environment and provide these exact commands:
* **Build Command:** `./mvnw clean package -DskipTests`
* **Start Command:** `java -jar target/ems-backend-0.0.1-SNAPSHOT.jar`

*(Once the build executes, the server automatically serves the embedded React UI and your JSON APIs simultaneously on Render's dynamic `$PORT` environment variable!)*

---

## 🔗 Project Connections

- **GitHub Repository:** [rohanmane7890/ems-backend](https://github.com/rohanmane7890/ems-backend)
- **LinkedIn:** [Rohan Mane](https://www.linkedin.com/in/rohan-mane-455640280/)
- **Live Demo (Internal):** [NexGen Workforce Portal](https://dull-catfish-78.loca.lt/)

---

> [!NOTE]
> *“Empowering the workforce of tomorrow, today.”* — **The NexGen Elite Team**
