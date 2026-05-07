<div align="center">
  
  <!-- Animated Typing SVG -->
  <a href="https://opsisai.netlify.app/">
    <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=40&pause=1000&color=00E5FF&center=true&vCenter=true&width=600&height=80&lines=OPSIS+AI&repeat=false" alt="Typing SVG" />
  </a>

  <p align="center">
    Bridging the gap between complex medical jargon and everyday users using Generative AI.
    <br />
    <a href="https://opsisai.netlify.app/"><strong>Explore the Live App »</strong></a>
    <br />
    <br />
    <a href="#features">Features</a> ·
    <a href="#tech-stack">Tech Stack</a> ·
    <a href="#engineering-highlights">Engineering Highlights</a>
  </p>

  <!-- Badges -->
  <p align="center">
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="NodeJS" />
    <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="ExpressJS" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  </p>
</div>

---

## 💡 About The Project

**Opsis AI** is a full-stack web application designed to act as a personal triage and medical analysis assistant. When patients receive lab results, the reports are often filled with intimidating medical jargon. Opsis AI securely processes these reports, communicates with a Generative AI model, and returns a structured, simplified explanation of the user's health status. 

*(**Tip:** Add a highly compressed, high-quality GIF of your dashboard in action right here!)*
<!-- <img src="assets/demo.gif" alt="Opsis AI Demo" width="100%"> -->

### ✨ Key Features
* 🩺 **AI Symptom Checker (Triage):** Categorizes urgency (Emergency to Low), suggests possible conditions, and provides immediate self-care actions.
* 📄 **Smart Report Analyzer:** Upload lab PDFs locally via the browser. The system flags abnormal biomarkers (e.g., Low Vitamin D) and simplifies the findings.
* 📊 **Interactive Health Dashboard:** Clean, minimalistic UI powered by Framer Motion, displaying a calculated out-of-100 "Health Score" with circular progress rings.
* 📥 **One-Click Export:** Instantly download the simplified AI report as a beautifully formatted PDF.

---

## 🛠️ Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | React.js, Vite, Tailwind CSS, Framer Motion |
| **Backend** | Node.js, Express.js, JSONWebToken |
| **Database** | MongoDB |
| **Parsing & Export** | `pdfjs-dist`, `html2canvas`, `jspdf` |
| **Deployment** | Netlify (Frontend), Render (Backend) |

---

## 🧠 Engineering Highlights 

Building Opsis AI involved solving several real-world architectural and deployment challenges:

* **Mitigating Server Cold Starts:** Prevented the 50-second latency caused by Render's free-tier spin-down by implementing a dedicated `/api/health` endpoint pinged via UptimeRobot, ensuring 24/7 high availability.
* **Robust Client-Side PDF Parsing:** Offloaded PDF text extraction to the client using `pdfjs-dist` to save backend bandwidth. Solved font-extraction crashes by dynamically injecting `standardFontDataUrl` during the parsing process to handle non-standard embedded fonts on the fly.
* **SPA Routing & CORS Security:** Resolved SPA routing "404 Errors" on Netlify using custom `_redirects` and strictly configured backend CORS middleware to exclusively trust requests from the custom production domain.

---

## 🚀 Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites
* Node.js (v18 or higher)
* MongoDB URI
* An active API Key for your Generative AI model

### Installation

1. **Clone the repository**
   ```sh
   git clone [https://github.com/yourusername/opsis-ai.git](https://github.com/yourusername/opsis-ai.git)
   ```
2. **Install Frontend Dependencies**
```
cd client
npm install
```
3. **Install Backend Dependencies**
```
cd ../server
npm install
```
4. **Environment Variables**
   Create a .env file in the server directory:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
AI_API_KEY=your_generative_ai_key
```
5. **Run the Application**
```
# Terminal 1 (Backend)
cd server && npm start

# Terminal 2 (Frontend)
cd client && npm run dev
```
## @Soumya || 2026 
