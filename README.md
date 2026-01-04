# Supply Chain Intelligence System (SCIS)

**Status:** 🚧 Development

A **Supply Chain Intelligence System** that sits *on top of* inventory and logistics data to provide **risk insights, predictions, and simulations** for operational decision-making.

This is **not** an execution system (ERP/WMS/TMS).  
This is an **intelligence layer** focused on analysis, forecasting, and scenario planning.

---

## 🚀 What This Project Is

SCIS helps operations teams answer questions like:
- Which products are at risk of stockout?
- Which warehouses are overstocked?
- Which shipments are likely to be delayed — and why?
- What happens if demand spikes or a warehouse goes down?

The goal is to move supply chain decisions from **reactive** to **predictive and strategic**.

---

## 🧠 Core Capabilities

### 1️⃣ Inventory Risk Intelligence
The system analyzes inventory data to identify **risk**, not to manage stock.

**It tells you:**
- Which products are at **stockout risk**
- Which warehouses are **overstocked**
- Which SKUs are **fast-moving vs slow-moving**
- Which products show **abnormal demand behavior** (spikes or drops)

**It explicitly does NOT do:**
- Purchase orders  
- SKU CRUD operations  
- Supplier onboarding  

This is **analysis**, not execution.

---

### 2️⃣ Product Behavior & Demand Signals
Understanding product behavior is foundational.

The system analyzes:
- Repeat demand patterns  
- Seasonality effects  
- Demand volatility  
- Region-specific demand behavior  

These signals directly power:
- Inventory risk assessment  
- Distribution decisions  
- Scenario simulations  

---

### 3️⃣ Logistics & Delivery Intelligence
The system predicts shipment outcomes *before* they happen.

**Capabilities:**
- Predict whether a shipment will be **early, on-time, or late**
- Provide **delay probability** (not binary outcomes)
- Surface **root-cause signals** behind delays  

Example:
> *“Shipment likely late (72%) due to route congestion and historical carrier delays.”*

Explainability is non-negotiable.

---

### 4️⃣ What-If Scenario Engine
This is a **core pillar**, not a feature.

The system can simulate:
- Demand surges  
- Warehouse shutdowns  
- Supplier delays  
- Route failures  

And visualize:
- Inventory depletion over time  
- Cascading delivery delays  
- Emerging risk hotspots  

This enables **strategic planning under uncertainty**.

---

### 5️⃣ Explicit Non-Goals
To keep scope clean and realistic, SCIS is **not**:
- ❌ ERP  
- ❌ Order Management System  
- ❌ Warehouse Management System  
- ❌ Transport Management System  

SCIS **consumes data from these systems** and adds an intelligence layer on top.

---

## 🛠️ Tech Stack

### Full-Stack Web (Next.js)
![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-JS-61DAFB?logo=react)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?logo=javascript)

### UI & Visualization
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwindcss)
![shadcn/ui](https://img.shields.io/badge/shadcn-ui-black)
![Recharts](https://img.shields.io/badge/Recharts-DataViz-22b5bf)

### Data Layer
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)
![Mongoose](https://img.shields.io/badge/Mongoose-ODM-800)

### Intelligence & Simulation
![Python](https://img.shields.io/badge/Python-ML-3776AB?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-ML%20Service-009688?logo=fastapi)

### Deployment
![Vercel](https://img.shields.io/badge/Vercel-Full--Stack-black?logo=vercel)
![Render](https://img.shields.io/badge/Render-FastAPI-46E3B7)

---

## ⚙️ Installation & Running Locally

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- MongoDB Atlas connection

---

### Full-Stack App (Next.js)
```bash
git clone https://github.com/chiragRane-Projects/scis.git
cd scis

npm install
npm run dev

#Python(Machine Learning)
git clone https://github.com/chiragRane-Projects/scis_ml.git
cd scis_ml
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

pip install -r requirements.txt
uvicorn main:app --reload
```