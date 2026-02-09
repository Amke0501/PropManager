#!/usr/bin/env node

/**
 * Deployment Validation Script for PropManager
 * Tests key endpoints and configuration
 * 
 * Usage: node deployment-test.js
 */

const BACKEND_URL = 'https://propmanager-1.onrender.com';
const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'testpassword123';

console.log('🚀 PropManager Deployment Tests\n');
console.log('=' .repeat(60));

let testResults = {
  passed: [],
  failed: []
};

async function testEndpoint(name, url, options = {}) {
  try {
    console.log(`\n⏳ Testing: ${name}`);
    console.log(`   URL: ${url}`);
    
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: options.headers || {},
      body: options.body ? JSON.stringify(options.body) : undefined,
      timeout: 10000
    });

    const data = await response.json().catch(() => ({}));
    
    if (response.ok) {
      console.log(`✅ PASSED - Status: ${response.status}`);
      if (data.count !== undefined) {
        console.log(`   Count: ${data.count}`);
      }
      testResults.passed.push(name);
      return { success: true, data, status: response.status };
    } else {
      console.log(`❌ FAILED - Status: ${response.status}`);
      console.log(`   Error: ${data.error || data.message || 'Unknown error'}`);
      testResults.failed.push(name);
      return { success: false, data, status: response.status };
    }
  } catch (error) {
    console.log(`❌ FAILED - ${error.message}`);
    testResults.failed.push(name);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  // Test 1: Basic connectivity
  console.log('\n📡 CONNECTIVITY TESTS');
  console.log('-'.repeat(60));
  
  await testEndpoint(
    'Backend API Health',
    `${BACKEND_URL}/api`
  );

  // Test 2: Database connection
  console.log('\n🗄️  DATABASE TESTS');
  console.log('-'.repeat(60));
  
  const supabaseTest = await testEndpoint(
    'Supabase Connection',
    `${BACKEND_URL}/api/test-supabase`
  );

  // Test 3: Properties endpoint
  console.log('\n🏠 PROPERTIES ENDPOINT TESTS');
  console.log('-'.repeat(60));
  
  const propertiesTest = await testEndpoint(
    'Properties (No Auth)',
    `${BACKEND_URL}/api/test/properties`
  );

  if (propertiesTest.success && propertiesTest.data.count === 0) {
    console.log('\n⚠️  WARNING: No properties found in database');
    console.log('   → You may need to create test properties in Supabase');
  }

  // Test 4: Frontend deployment
  console.log('\n🖥️  FRONTEND TESTS');
  console.log('-'.repeat(60));
  
  await testEndpoint(
    'Frontend Deployment',
    'https://propmanager.vercel.app'
  );

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${testResults.passed.length}`);
  console.log(`❌ Failed: ${testResults.failed.length}`);
  
  if (testResults.passed.length > 0) {
    console.log('\n✅ Passed Tests:');
    testResults.passed.forEach(test => console.log(`   • ${test}`));
  }

  if (testResults.failed.length > 0) {
    console.log('\n❌ Failed Tests:');
    testResults.failed.forEach(test => console.log(`   • ${test}`));
  }

  // Recommendations
  console.log('\n' + '='.repeat(60));
  console.log('💡 NEXT STEPS');
  console.log('='.repeat(60));

  if (propertiesTest.success && propertiesTest.data.count === 0) {
    console.log('1. Properties table is empty');
    console.log('   → Create properties via admin dashboard');
    console.log('   → Or insert directly in Supabase');
  }

  if (supabaseTest.failed) {
    console.log('2. Cannot connect to Supabase');
    console.log('   → Check environment variables on Render');
    console.log('   → Verify SUPABASE_URL and SUPABASE_SERVICE_KEY');
  }

  if (testResults.failed.length === 0) {
    console.log('✅ All deployment checks passed!');
    console.log('🎉 Your application is ready for use');
  }

  console.log('\n' + '='.repeat(60) + '\n');
}

// Run tests
runTests().catch(console.error);
