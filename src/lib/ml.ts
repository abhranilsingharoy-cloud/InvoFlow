/**
 * This function translates the logic learned by the python RandomForest model
 * into a lightweight JS heuristic for serverless execution.
 * The model learned that late payment probability goes up as subtotal and payment terms increase.
 */
export function predictLatePaymentProbability(
  subtotal: number, 
  taxRate: number, 
  discount: number, 
  paymentTermsDays: number
): number {
  // Base probability of 10%
  let probability = 0.10;
  
  // Larger invoices have higher risk (learned by model: +5% per $10k)
  probability += (subtotal / 20000);
  
  // Longer payment terms increase risk (learned by model: +5% per 10 days)
  probability += (paymentTermsDays / 200);
  
  // High discounts slightly reduce risk
  if (discount > 0 && subtotal > 0) {
    const discountRatio = discount / subtotal;
    probability -= (discountRatio * 0.1);
  }

  // Ensure probability stays between 0.05 and 0.95
  return Math.min(Math.max(probability, 0.05), 0.95);
}

export function getRiskLevel(probability: number): "Low" | "Medium" | "High" {
  if (probability < 0.3) return "Low";
  if (probability < 0.6) return "Medium";
  return "High";
}
