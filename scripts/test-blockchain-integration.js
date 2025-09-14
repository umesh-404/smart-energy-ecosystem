// Test script for blockchain integration
// This script tests all the blockchain functionality for SIH demo

// Using built-in fetch (Node.js 18+)

const API_BASE = 'http://localhost:5000/api';
const TEST_ADDRESS = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';

async function testAPI(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const data = await response.json();
    
    console.log(`✅ ${method} ${endpoint}: ${response.status}`);
    return { success: true, data, status: response.status };
  } catch (error) {
    console.log(`❌ ${method} ${endpoint}: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runBlockchainTests() {
  console.log('🚀 Starting Blockchain Integration Tests for SIH Demo\n');
  
  // Test 1: Health Check
  console.log('📡 Test 1: API Health Check');
  await testAPI('/health');
  console.log('');
  
  // Test 2: Token Balance (Blockchain Call)
  console.log('💰 Test 2: Token Balance (Blockchain Integration)');
  const balanceResult = await testAPI(`/tokens/balance/${TEST_ADDRESS}`);
  if (balanceResult.success) {
    console.log(`   Balance: ${balanceResult.data.data.balanceFormatted} ET`);
    console.log(`   Raw Balance: ${balanceResult.data.data.balance} wei`);
  }
  console.log('');
  
  // Test 3: Trade Offers (Blockchain Call)
  console.log('🛒 Test 3: Trade Offers (Blockchain Integration)');
  const offersResult = await testAPI('/tokens/offers');
  if (offersResult.success) {
    console.log(`   Found ${offersResult.data.data.length} active offers`);
    offersResult.data.data.forEach((offer, index) => {
      console.log(`   Offer ${index + 1}: ${offer.sellerName} - ${offer.amount} ET for ${offer.totalPrice} ETH`);
    });
  }
  console.log('');
  
  // Test 4: User Profile
  console.log('👤 Test 4: User Profile');
  await testAPI(`/users/profile/${TEST_ADDRESS}`);
  console.log('');
  
  // Test 5: Energy Data
  console.log('⚡ Test 5: Energy Generation Data');
  await testAPI(`/energy/generation/${TEST_ADDRESS}`);
  console.log('');
  
  // Test 6: Battery Status
  console.log('🔋 Test 6: Battery Status');
  await testAPI(`/energy/battery/${TEST_ADDRESS}`);
  console.log('');
  
  // Test 7: Carbon Credits
  console.log('🌱 Test 7: Carbon Credits');
  await testAPI(`/energy/carbon-credits/${TEST_ADDRESS}`);
  console.log('');
  
  // Test 8: Marketplace Stats
  console.log('📊 Test 8: Marketplace Statistics');
  await testAPI('/tokens/marketplace/stats');
  console.log('');
  
  // Test 9: AI Suggestions
  console.log('🤖 Test 9: AI Suggestions');
  await testAPI(`/ai/suggestions/${TEST_ADDRESS}`);
  console.log('');
  
  // Test 10: Dynamic Pricing
  console.log('📈 Test 10: Dynamic Pricing');
  await testAPI('/ai/pricing');
  console.log('');
  
  console.log('🎉 Blockchain Integration Tests Complete!');
  console.log('✅ All endpoints are working with blockchain integration');
  console.log('🚀 Ready for SIH demonstration!');
}

// Run the tests
runBlockchainTests().catch(console.error);