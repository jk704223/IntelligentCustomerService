# Web App Tester Skill

## Overview

The Web App Tester skill is a powerful tool for testing web applications. It can:

- Handle login processes automatically
- Explore web application pages to test functionality
- Run automated tests based on provided test cases
- Take screenshots after key successful actions
- Generate detailed test reports

## Installation

### Prerequisites

- Node.js (v14+)
- npm

### Setup

1. The skill is automatically available in the workspace
2. Dependencies are already installed

## Usage

### Basic Usage

To use this skill, provide the following information:

1. **Application URL**: The URL of the web application to test
2. **Login Credentials**: Username and password (if required)
3. **Test Cases**: Structured test cases (optional)

### Example Command

```bash
# Run the test script
node test.js
```

### Test Case Format

Test cases should be provided in JSON format:

```json
[
  {
    "name": "Test Case Name",
    "steps": [
      {
        "action": "navigate",
        "target": "/path"
      },
      {
        "action": "click",
        "selector": "#element-id"
      },
      {
        "action": "fill",
        "selector": "#input-id",
        "value": "test value"
      },
      {
        "action": "submit"
      }
    ],
    "expected": "Expected result description"
  }
]
```

### Supported Actions

- `navigate`: Navigate to a URL path
- `click`: Click on an element
- `fill`: Fill input field with value
- `submit`: Submit form
- `wait`: Wait for specified time (in ms)
- `assert`: Assert element exists or has specific content

## Output

### Screenshots

Screenshots are saved in the `screenshots/` directory with timestamps to ensure uniqueness.

### Test Reports

Test reports are generated as JSON files in the `screenshots/` directory, including:

- Test execution timestamp
- Total number of tests
- Number of passed/failed tests
- Detailed results for each test case

## Configuration

### Browser Settings

The skill uses Puppeteer with the following settings:

- Headless mode: `false` (visible browser)
- Default viewport: `null` (uses browser's default)
- Args: `["--start-maximized"]` (starts browser maximized)

## Troubleshooting

### Common Issues

1. **Browser not launching**: Ensure you have the required system dependencies for Puppeteer
2. **Login failed**: Check your login credentials and selector IDs
3. **Elements not found**: Verify the CSS selectors in your test cases
4. **Timeout errors**: Increase wait times for slower applications

### Debugging

To debug issues:

1. Check the console output for error messages
2. Review the generated screenshots to see the state of the application
3. Examine the test report for detailed failure information

## Examples

### Example 1: Login and Explore

```javascript
const WebAppTester = require('./test');

async function testLoginAndExplore() {
  const tester = new WebAppTester();
  
  try {
    await tester.initialize();
    
    // Login
    await tester.login('http://localhost:3000/login', {
      username: 'testuser',
      password: 'password123'
    });
    
    // Explore page
    const explorationResult = await tester.explorePage();
    console.log('Exploration result:', explorationResult);
    
  } finally {
    await tester.close();
  }
}

testLoginAndExplore();
```

### Example 2: Run Test Cases

```javascript
const WebAppTester = require('./test');

async function runTests() {
  const tester = new WebAppTester();
  
  try {
    await tester.initialize();
    
    // Login
    await tester.login('http://localhost:3000/login', {
      username: 'testuser',
      password: 'password123'
    });
    
    // Test cases
    const testCases = [
      {
        name: 'Dashboard Test',
        steps: [
          {
            action: 'navigate',
            target: 'http://localhost:3000/dashboard'
          },
          {
            action: 'wait',
            value: 2000
          },
          {
            action: 'assert',
            selector: '.dashboard-title'
          }
        ],
        expected: 'Dashboard should load successfully'
      }
    ];
    
    // Run tests
    const results = await tester.runTestCases(testCases);
    
    // Generate report
    const report = await tester.generateReport(results);
    console.log('Test report:', report);
    
  } finally {
    await tester.close();
  }
}

runTests();
```

## Limitations

- Requires valid CSS selectors for elements
- May need adjustments for complex authentication flows
- Performance depends on network speed and application responsiveness
- Screenshots are saved locally and not automatically uploaded

## Future Enhancements

- Support for more authentication methods (OAuth, SSO)
- Integration with test frameworks (Jest, Mocha)
- Video recording of test sessions
- Cloud storage for screenshots and reports
- Support for mobile device emulation
