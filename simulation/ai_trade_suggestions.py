#!/usr/bin/env python3
"""
AI Trade Suggestions Script
Generates intelligent trading recommendations based on market data and energy patterns
"""

import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
import json
import requests
from datetime import datetime, timedelta
import random

class AITradeAdvisor:
    def __init__(self):
        self.price_history = []
        self.demand_history = []
        self.supply_history = []
        self.weather_data = []
        self.model = LinearRegression()
        self.scaler = StandardScaler()
        
    def generate_market_data(self, days=30):
        """Generate synthetic market data for training"""
        data = []
        base_price = 0.05  # Base price in ETH
        
        for i in range(days * 24):  # Hourly data
            timestamp = datetime.now() - timedelta(hours=days*24-i)
            hour = timestamp.hour
            
            # Simulate price patterns
            time_factor = 1 + 0.1 * np.sin(2 * np.pi * hour / 24)
            demand_factor = 1 + 0.2 * np.sin(2 * np.pi * hour / 24 + np.pi/4)
            supply_factor = 1 + 0.15 * np.cos(2 * np.pi * hour / 24)
            
            # Add some randomness
            noise = random.uniform(0.95, 1.05)
            
            price = base_price * time_factor * noise
            demand = 100 * demand_factor * noise
            supply = 80 * supply_factor * noise
            
            data.append({
                'timestamp': timestamp.isoformat(),
                'price': round(price, 4),
                'demand': round(demand, 2),
                'supply': round(supply, 2),
                'hour': hour
            })
        
        return data
    
    def train_model(self, market_data):
        """Train the AI model on market data"""
        df = pd.DataFrame(market_data)
        
        # Prepare features
        features = ['hour', 'demand', 'supply']
        X = df[features].values
        y = df['price'].values
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Train model
        self.model.fit(X_scaled, y)
        
        print("🤖 AI model trained successfully!")
        return self.model.score(X_scaled, y)
    
    def predict_price(self, hour, demand, supply):
        """Predict energy token price based on current conditions"""
        features = np.array([[hour, demand, supply]])
        features_scaled = self.scaler.transform(features)
        prediction = self.model.predict(features_scaled)[0]
        return max(0.01, round(prediction, 4))  # Ensure positive price
    
    def analyze_market_trends(self, market_data):
        """Analyze market trends and patterns"""
        df = pd.DataFrame(market_data)
        
        # Calculate moving averages
        df['price_ma_24h'] = df['price'].rolling(window=24).mean()
        df['demand_ma_24h'] = df['demand'].rolling(window=24).mean()
        
        # Calculate volatility
        price_volatility = df['price'].std()
        demand_volatility = df['demand'].std()
        
        # Trend analysis
        recent_prices = df['price'].tail(24).values
        price_trend = np.polyfit(range(len(recent_prices)), recent_prices, 1)[0]
        
        return {
            'price_volatility': round(price_volatility, 4),
            'demand_volatility': round(demand_volatility, 2),
            'price_trend': round(price_trend, 6),
            'current_price': round(df['price'].iloc[-1], 4),
            'avg_price_24h': round(df['price_ma_24h'].iloc[-1], 4)
        }
    
    def generate_trade_suggestions(self, user_address, market_data):
        """Generate personalized trade suggestions"""
        current_time = datetime.now()
        hour = current_time.hour
        
        # Get current market conditions
        current_data = market_data[-1]
        current_price = current_data['price']
        current_demand = current_data['demand']
        current_supply = current_data['supply']
        
        # Analyze trends
        trends = self.analyze_market_trends(market_data)
        
        # Generate predictions for next 24 hours
        predictions = []
        for i in range(24):
            future_hour = (hour + i) % 24
            # Simulate future demand/supply
            future_demand = current_demand * (1 + random.uniform(-0.1, 0.1))
            future_supply = current_supply * (1 + random.uniform(-0.1, 0.1))
            
            predicted_price = self.predict_price(future_hour, future_demand, future_supply)
            predictions.append({
                'hour': future_hour,
                'predicted_price': predicted_price,
                'demand': future_demand,
                'supply': future_supply
            })
        
        # Determine trading strategy
        avg_predicted_price = np.mean([p['predicted_price'] for p in predictions])
        price_change = (avg_predicted_price - current_price) / current_price
        
        if price_change > 0.05:  # Price expected to increase by >5%
            action = 'buy'
            confidence = min(0.95, 0.6 + abs(price_change) * 2)
        elif price_change < -0.05:  # Price expected to decrease by >5%
            action = 'sell'
            confidence = min(0.95, 0.6 + abs(price_change) * 2)
        else:
            action = 'hold'
            confidence = 0.5
        
        # Calculate optimal amount
        if action == 'buy':
            optimal_amount = random.randint(50, 200)  # 50-200 tokens
        elif action == 'sell':
            optimal_amount = random.randint(30, 150)  # 30-150 tokens
        else:
            optimal_amount = 0
        
        # Generate reasoning
        reasoning = []
        if trends['price_trend'] > 0:
            reasoning.append("Price trend is upward")
        elif trends['price_trend'] < 0:
            reasoning.append("Price trend is downward")
        
        if trends['price_volatility'] > 0.01:
            reasoning.append("High market volatility detected")
        
        if current_demand > current_supply * 1.2:
            reasoning.append("High demand relative to supply")
        elif current_supply > current_demand * 1.2:
            reasoning.append("High supply relative to demand")
        
        # Risk assessment
        if trends['price_volatility'] > 0.02:
            risk_level = 'high'
        elif trends['price_volatility'] > 0.01:
            risk_level = 'medium'
        else:
            risk_level = 'low'
        
        return {
            'user_address': user_address,
            'recommended_action': action,
            'confidence': round(confidence, 2),
            'optimal_amount': optimal_amount,
            'current_price': current_price,
            'predicted_price_24h': round(avg_predicted_price, 4),
            'price_change_percent': round(price_change * 100, 2),
            'reasoning': reasoning,
            'risk_level': risk_level,
            'market_analysis': trends,
            'predictions': predictions[:6],  # Next 6 hours
            'timestamp': current_time.isoformat()
        }
    
    def send_suggestions_to_api(self, suggestions, api_url="http://localhost:5000/api/ai/suggestions"):
        """Send AI suggestions to the backend API"""
        try:
            response = requests.post(f"{api_url}/{suggestions['user_address']}", json=suggestions)
            
            if response.status_code == 200:
                print(f"✅ AI suggestions sent to API successfully")
                return True
            else:
                print(f"❌ API request failed: {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Error connecting to API: {e}")
            return False

def main():
    """Main function to run AI trade suggestions"""
    print("🤖 Starting AI Trade Suggestions...")
    
    advisor = AITradeAdvisor()
    
    # Generate market data
    print("📊 Generating market data...")
    market_data = advisor.generate_market_data(30)
    
    # Train the model
    print("🧠 Training AI model...")
    accuracy = advisor.train_model(market_data)
    print(f"📈 Model accuracy: {accuracy:.3f}")
    
    # Generate suggestions for a test user
    test_user = "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
    print(f"💡 Generating suggestions for {test_user}...")
    
    suggestions = advisor.generate_trade_suggestions(test_user, market_data)
    
    # Print results
    print(f"\n🎯 AI Trade Recommendations:")
    print(f"   Action: {suggestions['recommended_action'].upper()}")
    print(f"   Confidence: {suggestions['confidence']*100:.1f}%")
    print(f"   Optimal Amount: {suggestions['optimal_amount']} ET")
    print(f"   Current Price: {suggestions['current_price']} ETH")
    print(f"   Predicted Price (24h): {suggestions['predicted_price_24h']} ETH")
    print(f"   Expected Change: {suggestions['price_change_percent']:+.2f}%")
    print(f"   Risk Level: {suggestions['risk_level'].upper()}")
    
    print(f"\n💭 Reasoning:")
    for reason in suggestions['reasoning']:
        print(f"   • {reason}")
    
    # Save to file
    filename = f"ai_suggestions_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(filename, 'w') as f:
        json.dump(suggestions, f, indent=2)
    print(f"💾 Suggestions saved to {filename}")
    
    # Send to API (optional)
    send_to_api = input("\n📡 Send suggestions to API? (y/n): ").lower() == 'y'
    if send_to_api:
        advisor.send_suggestions_to_api(suggestions)
    
    print("✅ AI analysis completed!")

if __name__ == "__main__":
    main()