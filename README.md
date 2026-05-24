<div align="center">

# 📊 Probability Distributions

[![Frontend](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Backend](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Language](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Institution](https://img.shields.io/badge/ESCOM-IPN-B22222?style=for-the-badge)](https://www.escom.ipn.mx/)
[![Subject](https://img.shields.io/badge/Subject-Probability%20%26%20Statistics-2E8B57?style=for-the-badge)]()
[![Status](https://img.shields.io/badge/Status-In%20Development-yellow?style=for-the-badge)]()

<p><em>Interactive web application for probability distributions visualization and statistical calculations, developed for the Probability and Statistics course at ESCOM – IPN.</em></p>

</div>

---

## 📌 About

This repository contains an interactive web application developed for the **Probability and Statistics** course at [ESCOM – IPN](https://www.escom.ipn.mx/) (Escuela Superior de Cómputo, Instituto Politécnico Nacional), Bachelor's Degree in Computer Systems.

The project focuses on implementing and visualizing different **probability distributions** through an interactive interface using modern web technologies.

The application allows users to:

- Calculate probabilities
- Visualize distributions through graphs
- Analyze statistical behavior
- Interact dynamically with distribution parameters

---

## 📂 Repository Structure

```text
Distribuciones-de-Probabilidad/
│
├── Frontend/               # React + TypeScript frontend
│   ├── src/
│   └── ...
│
├── Backend/                # FastAPI backend (Python)
│   ├── main.py
│   └── ...
│
├── .gitignore
└── README.md
```

---

## 📈 Implemented Distributions

| Distribution | Description |
|---|---|
| Bernoulli | Models a single trial with two possible outcomes: success or failure |
| Binomial | Models the number of successes in a fixed number of independent Bernoulli trials |
| Poisson | Models the number of events occurring in a fixed interval of time or space |
| Geometric | Models the number of trials needed to get the first success |
| Normal | Continuous symmetric distribution defined by its mean and standard deviation |
| Exponential | Models the time between consecutive events in a Poisson process |
| Uniform | All outcomes in a given range are equally likely |

---

## 📦 Libraries Used

### Frontend
| Library | Purpose |
|---|---|
| [React](https://react.dev/) | UI component framework |
| [TypeScript](https://www.typescriptlang.org/) | Typed superset of JavaScript |
| [Axios](https://axios-http.com/) | HTTP client for API requests |
| [Plotly.js](https://plotly.com/javascript/) | Interactive distribution charts |

### Backend
| Library | Purpose |
|---|---|
| [FastAPI](https://fastapi.tiangolo.com/) | REST API framework |
| [NumPy](https://numpy.org/) | Numerical computations and array operations |
| [SciPy](https://scipy.org/) | Statistical distributions and probability functions |
| [Uvicorn](https://www.uvicorn.org/) | ASGI server to run the FastAPI app |

---

## 🧠 Topics & Concepts

- 📊 Probability Distributions
- 🎲 Discrete Random Variables
- 📈 Continuous Random Variables
- 📉 Statistical Visualization
- 🔢 Probability Mass Functions (PMF)
- 📐 Probability Density Functions (PDF)
- 📋 Cumulative Distribution Functions (CDF)
- 📏 Expected Value and Variance
- 🧪 Statistical Modeling

---

## ⚙️ Prerequisites

Make sure you have installed:

| Tool    | Min. Version | Download |
|---------|-------------|----------|
| Node.js | 18+         | [nodejs.org](https://nodejs.org/) |
| npm     | 9+          | Included with Node.js |
| Python  | 3.10+       | [python.org](https://www.python.org/) |
| pip     | Any         | Included with Python |

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/AlanRLG/Distribuciones-de-Probabilidad.git
cd Distribuciones-de-Probabilidad
```

---

### 2. Backend Setup

```bash
cd Backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux / macOS:
source venv/bin/activate
# On Windows (CMD):
venv\Scripts\activate.bat
# On Windows (PowerShell):
venv\Scripts\Activate.ps1

# Install dependencies
pip install fastapi uvicorn scipy numpy

# Start the server
uvicorn main:app --reload
```

The backend will be available at:

```
http://127.0.0.1:8000
```

> 💡 You can explore the automatic API documentation at `http://127.0.0.1:8000/docs`

---

### 3. Frontend Setup

Open **another terminal** (keep the backend running):

```bash
cd Frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at:

```
http://localhost:5173
```

---

## 🖥️ Usage

1. Make sure **both servers** (backend and frontend) are running simultaneously.
2. Open `http://localhost:5173` in your browser.
3. Select the probability distribution you want to analyze.
4. Adjust the distribution parameters using the interactive controls.
5. Observe the generated chart (PMF/PDF and CDF) and the calculated statistical values (mean, variance, etc.).

---

## 📊 Features

- Interactive probability calculations
- Dynamic graphical visualization with Plotly.js
- Modern responsive UI
- Real-time parameter updates
- REST API-based architecture
- Automatic API documentation (Swagger UI)

---

## 🎯 Future Improvements

- [ ] Export graphs as images
- [ ] Dark / Light mode
- [ ] Step-by-step calculations
- [ ] Distribution comparison tools
- [ ] Statistical simulations
- [ ] Confidence intervals
- [ ] Hypothesis testing

---

## 👨‍💻 Author

**Alan Leaños**

> Computer Systems student at ESCOM – IPN 

[![GitHub](https://img.shields.io/badge/GitHub-AlanRLG-181717?style=flat-square&logo=github)](https://github.com/AlanRLG)

**Omar Barron**

> Computer Systems student at ESCOM – IPN 

[![GitHub](https://img.shields.io/badge/GitHub-FairerFilly6-181717?style=flat-square&logo=github)](https://github.com/FairerFilly6)

**Christopher Gonzalez**

![Github](https://github.com/sierraGC1)

> Computer Systems student at ESCOM – IPN 

**Salomon Barrero**

> Computer Systems student at ESCOM – IPN

![Github](https://github.com/subparbard251)

---

## 📄 License

This repository is for **educational purposes**. Feel free to use it as a reference for learning.

---

<div align="center">
  <sub>Made with 💻 and 📊 at ESCOM – IPN · Computer Systems Engineering</sub>
</div>