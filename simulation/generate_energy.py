#!/usr/bin/env python3
"""
Energy Generation Simulation Script
Simulates real-time energy generation data for the Smart Energy Ecosystem
"""

import random
import time
import json
import requests
from datetime import datetime, timedelta
import numpy as np

class EnergyGenerator:
    def __init__(self):
        self.base_generation = 0
        self.weather_factor = 1.0
        self.equipment_efficiency = 0.85
        self.location = "Mumbai, India"
        
    def get_weather_factor(self):
        """Simulate weather conditions affecting solar generation"""
        # Simulate different weather conditions
        weather_conditions = {
            'sunny': 1.0,
            'partly_cloudy': 0.7,
            'cloudy': 0.4,
            'rainy': 0.1
        }
        
        # Random weather selection with weighted probabilities
        weather = random.choices(
            list(weather_conditions.keys()),
            weights=[0.4, 0.3, 0.2, 0.1]
        )[0]
        
        return weather_conditions[weather]
    
    def get_time_factor(self, hour):
        """Get generation factor based on time of day"""
        if 6 <= hour <= 18:  # Daylight hours
            # Peak generation around noon
            peak_hour = 12
            distance_from_peak = abs(hour - peak_hour)
            return max(0, 1 - (distance_from_peak / 6))
        else:
            return 0  # No solar generation at night
    
    def generate_solar_energy(self, timestamp):
        """Generate solar energy based on time and weather"""
        dt = datetime.fromtimestamp(timestamp)
        hour = dt.hour
        
        # Base generation capacity (kW)
        base_capacity = 5.0
        
        # Apply time factor
        time_factor = self.get_time_factor(hour)
        
        # Apply weather factor
        weather_factor = self.get_weather_factor()
        
        # Calculate generation
        generation = base_capacity * time_factor * weather_factor * self.equipment_efficiency
        
        # Add some randomness
        generation += random.uniform(-0.2, 0.2)
        
        return max(0, round(generation, 2))
    
    def generate_wind_energy(self, timestamp):
        """Generate wind energy (simplified model)"""
        # Wind generation is more consistent but varies with time
        base_capacity = 3.0
        
        # Wind patterns (higher at night and early morning)
        dt = datetime.fromtimestamp(timestamp)
        hour = dt.hour
        
        if 22 <= hour or hour <= 6:  # Night/early morning
            wind_factor = 0.8
        elif 7 <= hour <= 9 or 18 <= hour <= 21:  # Morning/evening
            wind_factor = 0.6
        else:  # Daytime
            wind_factor = 0.4
        
        generation = base_capacity * wind_factor * self.equipment_efficiency
        generation += random.uniform(-0.3, 0.3)
        
        return max(0, round(generation, 2))
    
    def generate_energy_data(self, duration_hours=24):
        """Generate energy data for specified duration"""
        data = []
        current_time = time.time()
        
        for i in range(duration_hours):
            timestamp = current_time + (i * 3600)  # Add hours
            
            solar = self.generate_solar_energy(timestamp)
            wind = self.generate_wind_energy(timestamp)
            total = solar + wind
            
            data.append({
                'timestamp': timestamp,
                'datetime': datetime.fromtimestamp(timestamp).isoformat(),
                'solar_generation': solar,
                'wind_generation': wind,
                'total_generation': total,
                'location': self.location
            })
        
        return data
    
    def send_to_api(self, data, api_url="http://localhost:5000/api/energy/simulate"):
        """Send generated data to the backend API"""
        try:
            response = requests.post(api_url, json={
                'address': '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
                'duration': len(data),
                'data': data
            })
            
            if response.status_code == 200:
                print(f"✅ Successfully sent {len(data)} data points to API")
                return True
            else:
                print(f"❌ API request failed: {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Error connecting to API: {e}")
            return False

def main():
    """Main function to run the energy generation simulation"""
    print("🌞 Starting Energy Generation Simulation...")
    
    generator = EnergyGenerator()
    
    # Generate 24 hours of data
    print("📊 Generating 24 hours of energy data...")
    data = generator.generate_energy_data(24)
    
    # Print summary
    total_solar = sum(point['solar_generation'] for point in data)
    total_wind = sum(point['wind_generation'] for point in data)
    total_generation = sum(point['total_generation'] for point in data)
    
    print(f"\n📈 Generation Summary:")
    print(f"   Solar: {total_solar:.2f} kWh")
    print(f"   Wind: {total_wind:.2f} kWh")
    print(f"   Total: {total_generation:.2f} kWh")
    print(f"   Average: {total_generation/24:.2f} kW")
    
    # Save to file
    filename = f"energy_data_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(filename, 'w') as f:
        json.dump(data, f, indent=2)
    print(f"💾 Data saved to {filename}")
    
    # Send to API (optional)
    send_to_api = input("\n📡 Send data to API? (y/n): ").lower() == 'y'
    if send_to_api:
        generator.send_to_api(data)
    
    print("✅ Simulation completed!")

if __name__ == "__main__":
    main()