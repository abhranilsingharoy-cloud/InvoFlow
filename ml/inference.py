import joblib
import pandas as pd
import os

def load_model():
    model_path = os.path.join(os.path.dirname(__file__), 'models/late_payment_model.pkl')
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model not found at {model_path}. Please run train.py first.")
    return joblib.load(model_path)

def predict_late_payment(subtotal, tax_rate, discount, payment_terms):
    """
    Predicts the probability of an invoice being paid late.
    """
    model = load_model()
    
    # Create input dataframe matching training features
    input_data = pd.DataFrame([{
        'subtotal': subtotal,
        'tax_rate': tax_rate,
        'discount': discount,
        'payment_terms': payment_terms
    }])
    
    prediction = model.predict(input_data)[0]
    probabilities = model.predict_proba(input_data)[0]
    
    return {
        'will_be_late': bool(prediction == 1),
        'probability_late': float(probabilities[1]),
        'probability_on_time': float(probabilities[0])
    }

if __name__ == "__main__":
    # Test inference
    print("Testing inference with a sample $5000 invoice (30 day terms)...")
    result = predict_late_payment(subtotal=5000, tax_rate=10, discount=0, payment_terms=30)
    
    print("\n--- Inference Result ---")
    print(f"Will be late? {'Yes' if result['will_be_late'] else 'No'}")
    print(f"Probability of late payment: {result['probability_late']:.1%}")
