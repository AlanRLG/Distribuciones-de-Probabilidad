<div align="center">

# 📊 Probability-Distributions

[![Frontend](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Backend](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Language](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Institution](https://img.shields.io/badge/ESCOM-IPN-B22222?style=for-the-badge)](https://www.escom.ipn.mx/)
[![Subject](https://img.shields.io/badge/Subject-Probability%20%26%20Statistics-2E8B57?style=for-the-badge)]()
[![Status](https://img.shields.io/badge/Status-In%20Development-yellow?style=for-the-badge)]()

<p><em>Interactive web application for probability distributions visualization and statistical calculations developed for the Probability and Statistics course at ESCOM – IPN.</em></p>

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
Probability-Distributions/
│
├── frontend/               # React + TypeScript frontend
│   ├── src/
│   └── ...
│
├── backend/                # FastAPI backend
│   ├── main.py
│   └── ...
│
├── .gitignore
└── README.md
```

---

## 📈 Implemented Distributions

| Distribution | Description | Status |
|---|---|---|
| Binomial | Discrete probability distribution | 🚧 |
| Poisson | Event occurrence modeling | 🚧 |
| Hypergeometric | Sampling without replacement | 🚧 |
| Normal | Continuous probability distribution | 🔜 |
| Exponential | Time between events modeling | 🔜 |

> More statistical distributions and features will be added as the project evolves.

---

## 🛠️ Technologies Used

### Frontend
- ⚛️ React
- 🔷 TypeScript
- 📡 Axios
- 📊 Plotly.js

### Backend
- ⚡ FastAPI
- 🐍 Python
- 🔢 NumPy
- 📉 SciPy

---

## 🧠 Topics & Concepts

The following Probability & Statistics concepts are explored throughout this project:

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

## ⚙️ Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- Python 3.10+
- pip
- npm

---

# 🚀 Installation

## Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/Probability-Distributions.git
cd Probability-Distributions
```

---

## 🔧 Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn scipy numpy

# Run backend server
uvicorn main:app --reload
```

Backend will run on:

```text
http://127.0.0.1:8000
```

---

## 💻 Frontend Setup

Open another terminal:

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will run on:

```text
http://localhost:5173
```

---

## 📊 Features

- Interactive probability calculations
- Dynamic graphical visualization
- Modern responsive UI
- Real-time parameter updates
- API-based architecture
- Statistical analysis tools

---

## 🎯 Future Improvements

- Export graphs as images
- Dark/Light mode
- Step-by-step calculations
- Distribution comparison tools
- Statistical simulations
- Confidence intervals
- Hypothesis testing

---

## 👨‍💻 Author

**AlanRLG**

> Computer Systems student at ESCOM – IPN

[![GitHub](https://img.shields.io/badge/GitHub-AlanRLG-181717?style=flat-square&logo=github)](https://github.com/AlanRLG)

---

## 📄 License

This repository is for **educational purposes**. Feel free to use it as reference for learning.

---

<div align="center">
  <sub>Made with 💻 and 📊 at ESCOM – IPN · Computational Systems</sub>
</div>