from flask import Flask, render_template, request
import joblib
import re
import nltk
from nltk.corpus import stopwords

nltk.download('stopwords')
stop_words = set(stopwords.words('english'))

app = Flask(__name__)

# Load model and vectorizer
model = joblib.load('fake_news_model.pkl')
vectorizer = joblib.load('tfidf_vectorizer.pkl')

def clean_text(text):
    text = text.lower()
    text = re.sub(r'\[.*?\]', '', text)
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    text = re.sub(r'<.*?>+', '', text)
    text = re.sub(r'[^\w\s]', '', text)
    text = re.sub(r'\n', '', text)
    text = re.sub(r'\w*\d\w*', '', text)
    words = [word for word in text.split() if word not in stop_words]
    return ' '.join(words)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        news_text = request.form['news']
        cleaned = clean_text(news_text)
        vec = vectorizer.transform([cleaned])
        pred = model.predict(vec)[0]
        prob = model.predict_proba(vec)[0]
        
        if pred == 1:
            result_text = "Likely Real News"
            confidence = prob[1] * 100
            badge_class = "bg-success"
            icon = "fa-check-circle"
        else:
            result_text = "Likely Fake News"
            confidence = prob[0] * 100
            badge_class = "bg-danger"
            icon = "fa-exclamation-triangle"
        
        return render_template('index.html', 
                               prediction_text=result_text,
                               confidence=confidence,
                               badge_class=badge_class,
                               icon=icon,
                               news_text=news_text)
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)