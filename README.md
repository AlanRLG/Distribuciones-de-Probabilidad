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
│   │   ├── api/            # HTTP client and response types
│   │   ├── components/     # Distribution components and shared UI
│   │   ├── hooks/          # Reusable simulation and export logic
│   │   ├── types/          # TypeScript interfaces
│   │   └── utils/          # Statistics helpers and export utilities
│   └── ...
│
├── Backend/                # FastAPI backend (Python)
│   ├── main.py             # API endpoints
│   ├── models/
│   │   └── parametros.py   # Pydantic parameter schemas
│   └── services/
│       └── distribuciones.py  # Statistical calculation logic
│
├── .gitignore
└── README.md
```

---

## 📈 Implemented Distributions

| Distribution | Type | Description |
|---|---|---|
| Bernoulli | Discrete | Models a single trial with two possible outcomes: success or failure |
| Binomial | Discrete | Models the number of successes in a fixed number of independent Bernoulli trials |
| Geometric | Discrete | Models the number of trials needed to get the first success |
| Poisson | Discrete | Models the number of events occurring in a fixed interval of time or space |
| Normal | Continuous | Symmetric bell-shaped distribution defined by mean and standard deviation |
| Exponential | Continuous | Models the time between consecutive events in a Poisson process |
| Uniform | Continuous | All outcomes in a given range are equally likely |

---

## 📦 Libraries Used

### Frontend
| Library | Purpose |
|---|---|
| [React](https://react.dev/) | UI component framework with functional components and hooks |
| [TypeScript](https://www.typescriptlang.org/) | Static typing over JavaScript |
| [Recharts](https://recharts.org/) | Interactive charts (BarChart for PMF, LineChart for PDF/CDF) |
| [html2canvas](https://html2canvas.hertzen.com/) | Export charts as downloadable PNG images |
| [Vite](https://vitejs.dev/) | Frontend bundler and development server |

### Backend
| Library | Purpose |
|---|---|
| [FastAPI](https://fastapi.tiangolo.com/) | REST API framework with automatic validation |
| [NumPy](https://numpy.org/) | Random data generation and empirical statistics |
| [SciPy](https://scipy.org/) | Theoretical PDF curves for continuous distributions |
| [Pydantic](https://docs.pydantic.dev/) | Parameter validation schemas |
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
- 🧪 Law of Large Numbers

---

## ⚙️ Prerequisites

Make sure you have installed:

| Tool    | Min. Version | Download |
|---------|-------------|----------|
| Node.js | 20+         | [nodejs.org](https://nodejs.org/) |
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
3. Select the probability distribution you want to analyze from the top navigation bar.
4. Adjust the distribution parameters using the interactive controls.
5. Click **▶ Simular** to generate random data and compute statistics.
6. Observe the generated chart (PMF or PDF/CDF) and the comparison table between simulated and theoretical values.
7. Use the **Exportar CSV** or **Exportar PNG** buttons to save the results.

---

## 📊 Features

- Interactive probability simulations via REST API
- Dynamic graphical visualization with Recharts (bar charts for discrete, line charts for continuous)
- Comparison table: empirical vs. theoretical mean, variance and standard deviation
- Configurable sample size to observe the Law of Large Numbers
- Export results as CSV or PNG
- Parameter validation on both frontend and backend
- Automatic API documentation (Swagger UI at `/docs`)

---

## 🎯 Future Improvements

- [ ] Complete Hypergeometric distribution frontend interface
- [ ] Add histogram with adjustable bins for continuous distributions
- [ ] Simultaneous comparison of two distributions
- [ ] Central Limit Theorem simulation
- [ ] Goodness-of-fit tests (Chi-square, Kolmogorov-Smirnov)
- [ ] Confidence intervals

---

## 👨‍💻 Authors

**Alan Rodrigo Leaños Gutiérrez**
> Computer Systems student at ESCOM – IPN

[![GitHub](https://img.shields.io/badge/GitHub-AlanRLG-181717?style=flat-square&logo=github)](https://github.com/AlanRLG)

**Omar Barron**
> Computer Systems student at ESCOM – IPN

[![GitHub](https://img.shields.io/badge/GitHub-FairerFilly6-181717?style=flat-square&logo=github)](https://github.com/FairerFilly6)

**Christopher Gonzalez**
> Computer Systems student at ESCOM – IPN

[![GitHub](https://img.shields.io/badge/GitHub-sierraGC1-181717?style=flat-square&logo=github)](https://github.com/sierraGC1)

**Salomon Barrero**
> Computer Systems student at ESCOM – IPN

[![GitHub](https://img.shields.io/badge/GitHub-subparbard251-181717?style=flat-square&logo=github)](https://github.com/subparbard251)

---

## 📄 License

This repository is for **educational purposes**. Feel free to use it as a reference for learning.

---

<div align="center">
  <sub>Made   at ESCOM – IPN · Computer Systems Engineering · Group 4CM2</sub>
</div>