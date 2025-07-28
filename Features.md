# TALENTO-AI Project Overview

## 1. Frontend

**Directory:**  
`TALENTO-AI/app/` (and its subfolders)

**Technologies Used:**  
- **React** (with functional components and hooks)  
- **Next.js** (App Router structure, file-based routing)  
- **Tailwind CSS** (utility-first CSS framework)  
- **Modern JavaScript (ES6+)**  
- **SVG/Images** for UI assets

**Key Features:**  
- User authentication (login, signup, social sign-in stubs)  
- Admin and user dashboards  
- Assessment modules (aptitude, communication, personality, technical)  
- Practice and career pages  
- Responsive, modern UI with dark theme  
- "Remember me" and password visibility toggle  
- Error handling and form validation  
- Navigation bar, footer, FAQ, testimonials, pricing, and more  
- Social sign-in buttons (Google, GitHub, LinkedIn, Phone – currently stubbed)  
- Forgot password and account creation flows

---

## 2. Backend

**Directory:**  
`TALENTO-AI/Models/Assessment models/` (Python scripts)

**Technologies Used:**  
- **Python** (for assessment logic and models)  
- Likely intended for use as an API backend (API server not shown)  
- **Dependencies** listed in `requirements.txt` (not included but assumed)

**Key Features:**  
- Logic for:
  - General aptitude assessments  
  - Communication skills evaluation  
  - Technical assessments  
  - Domain-specific questions  
  - Resume optimization and ATS scoring  
- PDF resume processing (`data/` folder contains sample resumes)  
- Modular Python scripts for each assessment type

---

## 3. Database

**Directory:**
_No explicit database directory or schema files available._

**Technologies Used:**  
- Not visible from current project structure  
- Possibly integrated via backend scripts or Next.js API routes  
- Likely candidates: MongoDB, PostgreSQL, SQLite (unconfirmed)

---

## 4. Model

**Directory:**  
`TALENTO-AI/Models/Assessment models/`

**Technologies Used:**  
- **Python**  
- Likely uses:
  - `scikit-learn`  
  - `pandas`, `numpy`  
  - Possibly NLP libraries for resume analysis

**Key Features:**  
- Automated resume scoring (ATS)  
- Resume optimization suggestions  
- Technical, aptitude, and communication assessment generation  
- Domain-specific question handling

---

## 5. Website Features (Summary List)

- User authentication (login, signup, forgot password, remember me)  
- Admin and user dashboards  
- Multiple assessment modules (aptitude, communication, technical, personality)  
- Resume upload and optimization  
- Social sign-in options (Google, GitHub, LinkedIn, Phone)  
- Practice and career guidance sections  
- Modern, responsive UI with dark mode  
- FAQ, testimonials, pricing, and feature highlights  
- Modular, scalable codebase (separated frontend, backend, and models)  
- Demo user and admin flows for testing
