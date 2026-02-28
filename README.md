# 🛡️ Fake News Detector - AI Powered Truth Verification

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-2.0+-green.svg)
![Machine Learning](https://img.shields.io/badge/ML-Logistic%20Regression-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 📌 Overview

An advanced AI-powered web application that detects fake news articles using Machine Learning. The model is trained on 44,000+ real and fake news articles with **98.5% accuracy**. Users can paste any news article and get instant verification with confidence scores.

### ✨ Features

- ✅ **Real-time News Analysis** - Get results in under 2 seconds
- ✅ **High Accuracy** - 98.5% accurate on test data
- ✅ **User-friendly Interface** - Clean, responsive design
- ✅ **Dark Mode** - Toggle between light and dark themes
- ✅ **History Tracking** - Last 10 checks saved locally
- ✅ **Share Results** - Share on Twitter, Facebook, LinkedIn
- ✅ **Sample News** - Pre-loaded examples for testing
- ✅ **Mobile Responsive** - Works on all devices

## 🖥️ Live Demo

[Click here to view live demo](https://your-app-name.onrender.com)

## 📸 Screenshots

| Light Mode | Dark Mode |
|------------|-----------|
| <img src="https://github.com/user-attachments/assets/b3050f88-56fb-48f6-b175-e0abc3b43760" width="500" style="border-radius: 10px; border: 1px solid #ddd;"> | <img src="https://github.com/user-attachments/assets/02cddf1e-5cb9-4342-ac83-25111e8f9990" width="500" style="border-radius: 10px; border: 1px solid #ddd;"> |

## 🛠️ Technologies Used

### Frontend
- HTML5, CSS3, JavaScript
- Bootstrap 5
- Font Awesome Icons
- Google Fonts (Inter)

### Backend
- Python Flask
- Gunicorn (WSGI server)

### Machine Learning
- Scikit-learn
- NLTK for text preprocessing
- Pandas & NumPy
- TF-IDF Vectorization
- Logistic Regression

### Deployment
- Render Cloud Platform

## 📊 Dataset

- **Source:** [Fake and real news dataset](https://www.kaggle.com/datasets/clmentbisaillon/fake-and-real-news-dataset) from Kaggle
- **Size:** 44,000+ articles
- **Classes:** Real News (1) and Fake News (0)
- **Features:** News title and text

## 🚀 Installation & Setup

### Prerequisites
- Python 3.8 or higher
- pip package manager

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/fake-news-detector.git
cd fake-news-detector
