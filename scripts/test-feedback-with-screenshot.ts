#!/usr/bin/env npx tsx

/**
 * Test Feedback API with Real Screenshot
 * Tests screenshot upload to Google Drive via Apps Script
 */

const API_URL = 'http://localhost:3020/api/feedback';

// Generate a small test PNG image (100x100 red square)
function generateTestScreenshot(): string {
  // Create a simple PNG with a colored pattern
  // This is a base64 encoded 100x100 PNG with a gradient pattern
  const canvas = `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#FF6B35;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1E3A8A;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#grad)"/>
      <text x="200" y="120" font-family="Arial" font-size="24" fill="white" text-anchor="middle">
        Feedback Test Screenshot
      </text>
      <text x="200" y="160" font-family="Arial" font-size="16" fill="white" text-anchor="middle">
        ${new Date().toISOString()}
      </text>
      <text x="200" y="200" font-family="Arial" font-size="14" fill="white" text-anchor="middle">
        Bug Report: UI Component Issue
      </text>
      <rect x="50" y="230" width="300" height="40" fill="rgba(255,255,255,0.2)" rx="5"/>
      <text x="200" y="255" font-family="Arial" font-size="12" fill="white" text-anchor="middle">
        [Simulated UI Element]
      </text>
    </svg>
  `;

  // Convert SVG to base64 data URL
  const base64 = Buffer.from(canvas).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

// Alternative: Generate actual PNG using a simple bitmap
function generateSimplePNG(): string {
  // PNG header and IHDR chunk for a 100x100 RGB image
  // This creates a valid PNG with a simple red/blue gradient

  // For simplicity, use a pre-made small PNG
  // This is a 10x10 colorful test pattern PNG
  const testPNG = 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAeklEQVQYV2NkwA/+M1AD/v//z8jIyMgIEkNWyMTIyPgfJsDIyAhigOQZGRn/gwUZGRnBCkCCYIX//zOCFMAUghWCFDAyMoIZIE0gDSAKUBSCNIHkwBrBkmAFIE1gDcgKQZpAmsAaQApAahgZGRlBGv4zMjKCGCB1OMwHAOlIHf8q0rBVAAAAAElFTkSuQmCC';
  return `data:image/png;base64,${testPNG}`;
}

async function testWithScreenshot() {
  console.log('🖼️  Testing Feedback API with Screenshot Upload\n');
  console.log('=' .repeat(60));

  const testId = `screenshot-test-${Date.now()}`;

  const feedback = {
    id: testId,
    title: 'Screenshot Test - Verify Drive Upload',
    description: 'This is a test to verify that screenshots are being uploaded to Google Drive and the URL is saved to the spreadsheet.',
    category: 'bug',
    priority: 'high',
    screenshot: generateTestScreenshot(),
    annotations: [
      { type: 'rectangle', points: [[50, 50], [150, 100]], color: '#ef4444' },
      { type: 'arrow', points: [[100, 150], [200, 200]], color: '#22c55e' },
    ],
    taggedElements: [
      { selector: '.test-button', note: 'This button needs fixing' },
    ],
    url: 'http://localhost:3020/demo/c-level',
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Test Script) Screenshot Test',
    timestamp: Date.now(),
    persona: 'c-level',
    mode: 'atc',
    targetIntegrations: ['sheets'],
  };

  console.log('\n📤 Sending feedback with screenshot...');
  console.log(`   ID: ${testId}`);
  console.log(`   Screenshot size: ${Math.round(feedback.screenshot.length / 1024)}KB`);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedback),
    });

    const result = await response.json();

    console.log('\n📥 Response:');
    console.log(JSON.stringify(result, null, 2));

    if (result.success) {
      console.log('\n✅ SUCCESS! Screenshot should now be in Google Drive');
      console.log('\n🔗 Check:');
      console.log('   1. Google Sheet: https://docs.google.com/spreadsheets/d/1NMObkTP6JL9CTgS1rPv-DGDWM02MLtLxp96eT6FUMTg');
      console.log('   2. Google Drive folder: "AI Support Feedback Screenshots"');

      if (result.results?.sheets?.screenshotUrl) {
        console.log(`   3. Screenshot URL: ${result.results.sheets.screenshotUrl}`);
      }
    } else {
      console.log('\n❌ FAILED');
      console.log('Error:', result.error);
    }

  } catch (error) {
    console.error('\n❌ Request failed:', error);
  }

  console.log('\n' + '=' .repeat(60));
}

// Run multiple tests with different screenshot types
async function runMultipleTests() {
  console.log('🧪 Running Multiple Screenshot Tests\n');

  const tests = [
    { name: 'SVG Screenshot', screenshot: generateTestScreenshot(), category: 'bug' },
    { name: 'PNG Screenshot', screenshot: generateSimplePNG(), category: 'feature' },
    { name: 'Large SVG', screenshot: generateTestScreenshot(), category: 'improvement' },
  ];

  for (const test of tests) {
    console.log(`\n📸 Test: ${test.name}`);

    const feedback = {
      id: `multi-test-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: `${test.name} - ${new Date().toLocaleTimeString()}`,
      description: `Testing ${test.name.toLowerCase()} upload to Google Drive`,
      category: test.category,
      priority: 'medium',
      screenshot: test.screenshot,
      annotations: [],
      taggedElements: [],
      url: 'http://localhost:3020/test',
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Test Script',
      timestamp: Date.now(),
      persona: 'admin',
      mode: 'atc',
      targetIntegrations: ['sheets'],
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedback),
      });

      const result = await response.json();
      console.log(`   ${result.success ? '✅' : '❌'} ${test.name}: ${result.success ? 'Uploaded' : result.error}`);
    } catch (error) {
      console.log(`   ❌ ${test.name}: ${error}`);
    }

    // Small delay between tests
    await new Promise(r => setTimeout(r, 500));
  }

  console.log('\n🔗 Check Google Sheet for screenshot URLs:');
  console.log('https://docs.google.com/spreadsheets/d/1NMObkTP6JL9CTgS1rPv-DGDWM02MLtLxp96eT6FUMTg');
}

// Run single test first, then multiple
testWithScreenshot()
  .then(() => runMultipleTests())
  .catch(console.error);
