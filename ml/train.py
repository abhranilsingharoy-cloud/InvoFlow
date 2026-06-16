import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os

def generate_synthetic_data(num_samples=1000):
    """Generate synthetic invoice data for training."""
    np.random.seed(42)
    
    # Features: subtotal, tax_rate, discount, payment_terms_days
    subtotal = np.random.uniform(50, 10000, num_samples)
    tax_rate = np.random.choice([0, 5, 10, 15, 20], num_samples)
    discount = np.random.uniform(0, 500, num_samples)
    # Ensure discount doesn't exceed subtotal
    discount = np.minimum(discount, subtotal * 0.2) 
    payment_terms = np.random.choice([0, 15, 30, 45, 60], num_samples)
    
    # Target: Paid Late (0 = No, 1 = Yes)
    # Logic: Higher subtotals, longer payment terms -> slightly higher chance of late payment
    base_prob = 0.1
    late_prob = base_prob + (subtotal / 20000) + (payment_terms / 200)
    # Add some noise
    late_prob += np.random.normal(0, 0.05, num_samples)
    late_prob = np.clip(late_prob, 0, 1)
    
    paid_late = np.random.binomial(1, late_prob)
    
    return pd.DataFrame({
        'subtotal': subtotal,
        'tax_rate': tax_rate,
        'discount': discount,
        'payment_terms': payment_terms,
        'paid_late': paid_late
    })

def train():
    print("Generating synthetic data...")
    df = generate_synthetic_data(5000)
    
    X = df[['subtotal', 'tax_rate', 'discount', 'payment_terms']]
    y = df['paid_late']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training highly advanced RandomForest model...")
    model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    model.fit(X_train, y_train)
    
    print("Evaluating model...")
    y_pred = model.predict(X_test)
    print("Accuracy:", accuracy_score(y_test, y_pred))
    print(classification_report(y_test, y_pred))
    
    os.makedirs('models', exist_ok=True)
    model_path = 'models/late_payment_model.pkl'
    joblib.dump(model, model_path)
    print(f"Model successfully saved to {model_path}")

if __name__ == "__main__":
    train()
