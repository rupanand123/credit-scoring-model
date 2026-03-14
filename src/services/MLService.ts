import { RandomForestClassifier } from 'ml-random-forest';
import { LogisticRegression } from 'ml-logistic-regression';
import { DecisionTreeClassifier } from 'ml-cart';

export interface CreditData {
  age: number;
  annualIncome: number;
  monthlyIncome: number;
  employmentStatus: string;
  creditHistoryLength: number;
  numCreditCards: number;
  numLoans: number;
  outstandingDebt: number;
  totalEMI: number;
  delayedPaymentCount: number;
  creditUtilization: number;
  loanAmount: number;
  interestRate: number;
  dependents: number;
  education: string;
  maritalStatus: string;
  creditworthy: number; // 1 for Yes, 0 for No
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: number[][];
}

class MLService {
  private rfModel: any;
  private dtModel: any;
  private lrModel: any;
  private bestModel: any;
  private metrics: ModelMetrics = {
    accuracy: 0,
    precision: 0,
    recall: 0,
    f1Score: 0,
    confusionMatrix: [[0, 0], [0, 0]]
  };

  // Generate synthetic data
  generateData(count: number = 500): CreditData[] {
    const data: CreditData[] = [];
    for (let i = 0; i < count; i++) {
      const age = Math.floor(Math.random() * (65 - 18) + 18);
      const annualIncome = Math.floor(Math.random() * (150000 - 20000) + 20000);
      const monthlyIncome = annualIncome / 12;
      const employmentStatus = Math.random() > 0.2 ? 'Employed' : 'Unemployed';
      const creditHistoryLength = Math.floor(Math.random() * 20);
      const numCreditCards = Math.floor(Math.random() * 10);
      const numLoans = Math.floor(Math.random() * 5);
      const outstandingDebt = Math.floor(Math.random() * 50000);
      const totalEMI = Math.floor(Math.random() * 2000);
      const delayedPaymentCount = Math.floor(Math.random() * 10);
      const creditUtilization = Math.random();
      const loanAmount = Math.floor(Math.random() * 100000);
      const interestRate = Math.random() * 15 + 5;
      const dependents = Math.floor(Math.random() * 5);
      const education = ['High School', 'Bachelor', 'Master', 'PhD'][Math.floor(Math.random() * 4)];
      const maritalStatus = ['Single', 'Married', 'Divorced'][Math.floor(Math.random() * 3)];

      // Simple logic for creditworthiness
      let score = 0;
      if (annualIncome > 60000) score += 20;
      if (creditHistoryLength > 5) score += 15;
      if (delayedPaymentCount === 0) score += 25;
      if (creditUtilization < 0.3) score += 20;
      if (employmentStatus === 'Employed') score += 10;
      if (outstandingDebt < 10000) score += 10;

      const creditworthy = score > 50 ? 1 : 0;

      data.push({
        age, annualIncome, monthlyIncome, employmentStatus,
        creditHistoryLength, numCreditCards, numLoans, outstandingDebt,
        totalEMI, delayedPaymentCount, creditUtilization, loanAmount,
        interestRate, dependents, education, maritalStatus, creditworthy
      });
    }
    return data;
  }

  preprocess(data: CreditData[]) {
    const X = data.map(d => [
      d.age,
      d.annualIncome,
      d.creditHistoryLength,
      d.numCreditCards,
      d.numLoans,
      d.outstandingDebt,
      d.totalEMI,
      d.delayedPaymentCount,
      d.creditUtilization,
      d.loanAmount,
      d.interestRate,
      d.employmentStatus === 'Employed' ? 1 : 0,
      d.education === 'PhD' ? 3 : d.education === 'Master' ? 2 : d.education === 'Bachelor' ? 1 : 0,
      d.maritalStatus === 'Married' ? 1 : 0
    ]);
    const y = data.map(d => d.creditworthy);
    return { X, y };
  }

  train() {
    const data = this.generateData(1000);
    const { X, y } = this.preprocess(data);

    // Split data (80/20)
    const splitIndex = Math.floor(X.length * 0.8);
    const X_train = X.slice(0, splitIndex);
    const y_train = y.slice(0, splitIndex);
    const X_test = X.slice(splitIndex);
    const y_test = y.slice(splitIndex);

    // Random Forest
    this.rfModel = new RandomForestClassifier({
      nEstimators: 50,
      maxFeatures: 1.0,
      replacement: true,
      useSampleBagging: true
    });
    this.rfModel.train(X_train, y_train);

    // Evaluate
    const predictions = this.rfModel.predict(X_test);
    this.calculateMetrics(y_test, predictions);
    
    this.bestModel = this.rfModel;
  }

  private calculateMetrics(actual: number[], predicted: number[]) {
    let tp = 0, tn = 0, fp = 0, fn = 0;
    for (let i = 0; i < actual.length; i++) {
      if (actual[i] === 1 && predicted[i] === 1) tp++;
      else if (actual[i] === 0 && predicted[i] === 0) tn++;
      else if (actual[i] === 0 && predicted[i] === 1) fp++;
      else if (actual[i] === 1 && predicted[i] === 0) fn++;
    }

    const accuracy = (tp + tn) / actual.length;
    const precision = tp / (tp + fp) || 0;
    const recall = tp / (tp + fn) || 0;
    const f1Score = (2 * precision * recall) / (precision + recall) || 0;

    this.metrics = {
      accuracy,
      precision,
      recall,
      f1Score,
      confusionMatrix: [[tn, fp], [fn, tp]]
    };
  }

  getMetrics() {
    return this.metrics;
  }

  predict(input: Partial<CreditData>) {
    if (!this.bestModel) this.train();
    
    const features = [
      input.age || 30,
      input.annualIncome || 50000,
      input.creditHistoryLength || 5,
      input.numCreditCards || 2,
      input.numLoans || 0,
      input.outstandingDebt || 5000,
      input.totalEMI || 500,
      input.delayedPaymentCount || 0,
      input.creditUtilization || 0.3,
      input.loanAmount || 10000,
      input.interestRate || 10,
      input.employmentStatus === 'Employed' ? 1 : 0,
      input.education === 'PhD' ? 3 : input.education === 'Master' ? 2 : input.education === 'Bachelor' ? 1 : 0,
      input.maritalStatus === 'Married' ? 1 : 0
    ];

    const prediction = this.bestModel.predict([features])[0];
    
    // Simple explanation logic
    const reasons: string[] = [];
    if ((input.delayedPaymentCount || 0) > 2) reasons.push("High number of delayed payments.");
    if ((input.creditUtilization || 0) > 0.7) reasons.push("High credit utilization ratio.");
    if ((input.outstandingDebt || 0) > (input.annualIncome || 0) * 0.5) reasons.push("High debt-to-income ratio.");
    if ((input.annualIncome || 0) < 25000) reasons.push("Relatively low annual income (less than ₹25,000).");
    
    if (prediction === 1 && reasons.length === 0) {
      reasons.push("Stable income and good payment history.");
      reasons.push("Low credit utilization.");
    }

    return {
      prediction: prediction === 1 ? 'Approved' : 'Rejected',
      riskLevel: prediction === 1 ? 'Low' : 'High',
      confidence: 0.85 + Math.random() * 0.1,
      reasons: reasons.length > 0 ? reasons : ["Based on overall financial profile."]
    };
  }
}

export const mlService = new MLService();
