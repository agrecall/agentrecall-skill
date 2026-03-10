/**
 * AgentRecall Sanitize - Test
 */

const { sanitize } = require('./sanitize.js');

const tests = [
  {
    name: 'API Key',
    input: 'Error: sk-abc123def456',
    expect: '{API_KEY}'
  },
  {
    name: 'Email',
    input: 'Contact: test@example.com',
    expect: '{EMAIL}'
  },
  {
    name: 'IP Address',
    input: 'Server: 192.168.1.100',
    expect: '{IP_ADDRESS}'
  },
  {
    name: 'Password',
    input: 'password=secret123',
    expect: '{REDACTED}'
  },
  {
    name: 'JWT Token',
    input: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U',
    expect: '{JWT_TOKEN}'
  },
  {
    name: 'Multiple',
    input: 'API Key: sk-abc123, Email: test@example.com, IP: 10.0.0.1',
    expect: '{API_KEY}.*{EMAIL}.*{IP_ADDRESS}'
  }
];

let passed = 0;
let failed = 0;

console.log('=== AgentRecall Sanitize Tests ===\n');

tests.forEach(test => {
  const result = sanitize(test.input);
  const success = result.includes(test.expect.replace('.*', ''));
  
  if (success) {
    console.log(`✅ ${test.name}`);
    passed++;
  } else {
    console.log(`❌ ${test.name}`);
    console.log(`   Input: ${test.input}`);
    console.log(`   Output: ${result}`);
    console.log(`   Expect: ${test.expect}`);
    failed++;
  }
});

console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
process.exit(failed > 0 ? 1 : 0);