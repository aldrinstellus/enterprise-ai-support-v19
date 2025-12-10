#!/usr/bin/env npx tsx

/**
 * Full Coverage Test Script for Feedback API
 * Tests all categories, priorities, and integration targets
 */

const API_URL = 'http://localhost:3020/api/feedback';

interface FeedbackEntry {
  id: string;
  title: string;
  description: string;
  category: 'bug' | 'feature' | 'improvement' | 'question' | 'other';
  priority: 'critical' | 'high' | 'medium' | 'low';
  screenshot: string;
  annotations: Array<{ type: string; points: number[][]; color: string }>;
  taggedElements: Array<{ selector: string; note: string }>;
  url: string;
  viewport: { width: number; height: number };
  userAgent: string;
  timestamp: number;
  persona?: string;
  mode?: string;
  targetIntegrations: string[];
}

// Test data generators
const randomId = () => `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const bugTitles = [
  'Button not clickable on mobile',
  'Dropdown menu flickers on hover',
  'Form validation error message missing',
  'Chart data not loading correctly',
  'Modal overlay not covering full screen',
  'Search results showing duplicates',
  'Date picker showing wrong timezone',
  'Sidebar collapse animation stutters',
  'Dark mode toggle not persisting',
  'API timeout on large data sets',
];

const featureTitles = [
  'Add keyboard shortcuts for common actions',
  'Export data to CSV format',
  'Add bulk selection for items',
  'Implement drag-and-drop reordering',
  'Add notification preferences',
  'Support for dark/light mode scheduling',
  'Add dashboard customization options',
  'Implement real-time collaboration',
  'Add activity history log',
  'Support for multiple languages',
];

const improvementTitles = [
  'Improve loading state animations',
  'Optimize table rendering performance',
  'Better error messages for users',
  'Cleaner navigation breadcrumbs',
  'More intuitive onboarding flow',
  'Faster search autocomplete',
  'Better mobile responsive design',
  'Improved accessibility for screen readers',
  'Cleaner form layout design',
  'More descriptive tooltips',
];

const questionTitles = [
  'How to reset password?',
  'What file formats are supported?',
  'How to configure notifications?',
  'Where to find API documentation?',
  'How to export reports?',
  'What are the permission levels?',
  'How to connect external services?',
  'Where are logs stored?',
  'How to schedule automated tasks?',
  'What is the data retention policy?',
];

const otherTitles = [
  'General UI feedback',
  'Color scheme suggestion',
  'Content typo found',
  'Documentation update needed',
  'Accessibility suggestion',
  'Performance observation',
  'UX flow feedback',
  'Branding inconsistency',
  'Layout suggestion',
  'Misc usability note',
];

const descriptions = [
  'This issue occurs consistently when using the feature. Steps to reproduce: 1) Navigate to the page 2) Click the button 3) Observe the unexpected behavior.',
  'I noticed this while testing on Chrome v120. The behavior seems related to recent changes in the UI.',
  'This would significantly improve workflow efficiency. Many users have requested similar functionality.',
  'The current implementation works but could be optimized for better user experience.',
  'This is a minor issue but affects the overall polish of the application.',
  'Observed during QA testing. Priority based on user impact assessment.',
  'This has been reported by multiple users in the past week.',
  'Edge case discovered during stress testing.',
  'Regression from previous release. Was working correctly before.',
  'New requirement from stakeholder meeting.',
];

const personas = ['c-level', 'cs-manager', 'support-agent', 'admin'];
const modes = ['atc', 'government', 'project'];
const categories: FeedbackEntry['category'][] = ['bug', 'feature', 'improvement', 'question', 'other'];
const priorities: FeedbackEntry['priority'][] = ['critical', 'high', 'medium', 'low'];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getTitleForCategory(category: FeedbackEntry['category']): string {
  switch (category) {
    case 'bug': return getRandomItem(bugTitles);
    case 'feature': return getRandomItem(featureTitles);
    case 'improvement': return getRandomItem(improvementTitles);
    case 'question': return getRandomItem(questionTitles);
    case 'other': return getRandomItem(otherTitles);
  }
}

function generateRandomAnnotations(): FeedbackEntry['annotations'] {
  const count = Math.floor(Math.random() * 4); // 0-3 annotations
  const types = ['arrow', 'rectangle', 'highlight', 'freehand'];
  const colors = ['#ef4444', '#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6'];

  return Array.from({ length: count }, () => ({
    type: getRandomItem(types),
    points: [[Math.random() * 1000, Math.random() * 800], [Math.random() * 1000, Math.random() * 800]],
    color: getRandomItem(colors),
  }));
}

function generateRandomTaggedElements(): FeedbackEntry['taggedElements'] {
  const count = Math.floor(Math.random() * 3); // 0-2 tagged elements
  const selectors = [
    'button.primary-action',
    '#main-navigation',
    '.sidebar-menu',
    '[data-testid="submit-btn"]',
    '.modal-overlay',
    '#user-profile',
    '.notification-badge',
    '.search-input',
    '.table-row:first-child',
    '.card-container',
  ];
  const notes = [
    'This element is problematic',
    'Clicking here causes the issue',
    'This area needs attention',
    'User struggles with this',
    'Potential improvement here',
    '',
  ];

  return Array.from({ length: count }, () => ({
    selector: getRandomItem(selectors),
    note: getRandomItem(notes),
  }));
}

function generateFeedback(overrides: Partial<FeedbackEntry> = {}): FeedbackEntry {
  const category = overrides.category || getRandomItem(categories);

  return {
    id: randomId(),
    title: overrides.title || getTitleForCategory(category),
    description: overrides.description || getRandomItem(descriptions),
    category,
    priority: overrides.priority || getRandomItem(priorities),
    screenshot: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', // 1x1 pixel
    annotations: generateRandomAnnotations(),
    taggedElements: generateRandomTaggedElements(),
    url: `http://localhost:3020/demo/${getRandomItem(personas)}`,
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Test Script',
    timestamp: Date.now(),
    persona: overrides.persona || getRandomItem(personas),
    mode: overrides.mode || getRandomItem(modes),
    targetIntegrations: overrides.targetIntegrations || ['sheets'],
    ...overrides,
  };
}

async function submitFeedback(entry: FeedbackEntry): Promise<{ success: boolean; data?: unknown; error?: string }> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });

    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function runFullCoverageTest() {
  console.log('🧪 Starting Full Coverage Test for Feedback API\n');
  console.log('=' .repeat(60));

  const results: { test: string; success: boolean; details?: string }[] = [];

  // Test 1: All Categories
  console.log('\n📂 Test 1: All Categories');
  for (const category of categories) {
    const feedback = generateFeedback({ category });
    const result = await submitFeedback(feedback);
    const testName = `Category: ${category}`;
    results.push({ test: testName, success: result.success, details: result.success ? 'OK' : result.error });
    console.log(`  ${result.success ? '✅' : '❌'} ${testName}`);
  }

  // Test 2: All Priorities
  console.log('\n🎯 Test 2: All Priorities');
  for (const priority of priorities) {
    const feedback = generateFeedback({ priority });
    const result = await submitFeedback(feedback);
    const testName = `Priority: ${priority}`;
    results.push({ test: testName, success: result.success, details: result.success ? 'OK' : result.error });
    console.log(`  ${result.success ? '✅' : '❌'} ${testName}`);
  }

  // Test 3: All Personas
  console.log('\n👤 Test 3: All Personas');
  for (const persona of personas) {
    const feedback = generateFeedback({ persona });
    const result = await submitFeedback(feedback);
    const testName = `Persona: ${persona}`;
    results.push({ test: testName, success: result.success, details: result.success ? 'OK' : result.error });
    console.log(`  ${result.success ? '✅' : '❌'} ${testName}`);
  }

  // Test 4: All Modes
  console.log('\n🔄 Test 4: All Modes');
  for (const mode of modes) {
    const feedback = generateFeedback({ mode });
    const result = await submitFeedback(feedback);
    const testName = `Mode: ${mode}`;
    results.push({ test: testName, success: result.success, details: result.success ? 'OK' : result.error });
    console.log(`  ${result.success ? '✅' : '❌'} ${testName}`);
  }

  // Test 5: Edge Cases
  console.log('\n⚠️ Test 5: Edge Cases');

  // Empty description
  const emptyDesc = generateFeedback({ description: '' });
  let result = await submitFeedback(emptyDesc);
  results.push({ test: 'Empty description', success: result.success });
  console.log(`  ${result.success ? '✅' : '❌'} Empty description`);

  // Very long title
  const longTitle = generateFeedback({ title: 'A'.repeat(200) });
  result = await submitFeedback(longTitle);
  results.push({ test: 'Long title (200 chars)', success: result.success });
  console.log(`  ${result.success ? '✅' : '❌'} Long title (200 chars)`);

  // Special characters
  const specialChars = generateFeedback({
    title: 'Test with "quotes" & <special> chars',
    description: "Line 1\nLine 2\n\tTabbed content"
  });
  result = await submitFeedback(specialChars);
  results.push({ test: 'Special characters', success: result.success });
  console.log(`  ${result.success ? '✅' : '❌'} Special characters`);

  // Multiple annotations
  const manyAnnotations = generateFeedback({
    annotations: Array.from({ length: 10 }, () => ({
      type: 'rectangle',
      points: [[100, 100], [200, 200]],
      color: '#ff0000',
    })),
  });
  result = await submitFeedback(manyAnnotations);
  results.push({ test: 'Many annotations (10)', success: result.success });
  console.log(`  ${result.success ? '✅' : '❌'} Many annotations (10)`);

  // Test 6: Random Bulk Test
  console.log('\n🎲 Test 6: Random Bulk Test (10 entries)');
  for (let i = 0; i < 10; i++) {
    const feedback = generateFeedback();
    result = await submitFeedback(feedback);
    results.push({ test: `Random #${i + 1}`, success: result.success });
    console.log(`  ${result.success ? '✅' : '❌'} Random #${i + 1}: [${feedback.category}/${feedback.priority}] ${feedback.title.substring(0, 40)}...`);
    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 200));
  }

  // Summary
  console.log('\n' + '=' .repeat(60));
  console.log('📊 TEST SUMMARY\n');

  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const total = results.length;

  console.log(`Total Tests: ${total}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

  if (failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.test}: ${r.details || 'Unknown error'}`);
    });
  }

  console.log('\n🔗 Check Google Sheet for results:');
  console.log('https://docs.google.com/spreadsheets/d/1NMObkTP6JL9CTgS1rPv-DGDWM02MLtLxp96eT6FUMTg\n');

  return { passed, failed, total };
}

// Run the test
runFullCoverageTest().catch(console.error);
