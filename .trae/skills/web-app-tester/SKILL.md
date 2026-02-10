---
name: "web-app-tester"
description: "Tests web applications by handling login, performing page exploration, running automated tests based on test cases, and taking screenshots after key successful actions. Invoke when user needs to test web applications or run automated test scenarios."
---

# Web App Tester

This skill helps you test web applications with the following capabilities:

## Features

1. **Login Handling**: Automatically handles login processes for web applications
2. **Page Exploration**: Navigates through web application pages to test functionality
3. **Test Case Execution**: Runs automated tests based on provided test cases
4. **Screenshot Capture**: Takes screenshots after key successful actions
5. **Test Reporting**: Generates reports of test results

## How to Use

### Basic Usage

To test a web application, provide:
1. The application URL
2. Login credentials (if required)
3. Test cases (optional)

### Test Case Format

Test cases should be provided in a structured format:

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

## Examples

### Example 1: Basic Login Test

```json
[
  {
    "name": "Login Test",
    "steps": [
      {
        "action": "fill",
        "selector": "#username",
        "value": "testuser"
      },
      {
        "action": "fill",
        "selector": "#password",
        "value": "password123"
      },
      {
        "action": "submit"
      }
    ],
    "expected": "User should be logged in successfully"
  }
]
```

### Example 2: Page Navigation Test

```json
[
  {
    "name": "Navigation Test",
    "steps": [
      {
        "action": "navigate",
        "target": "/dashboard"
      },
      {
        "action": "click",
        "selector": ".menu-item"
      },
      {
        "action": "wait",
        "value": 2000
      }
    ],
    "expected": "Should navigate to menu item page"
  }
]
```

## Output

After running tests, the skill will provide:
1. Test execution status
2. Screenshots of key successful actions
3. Detailed test report with passed/failed cases

## Notes

- Ensure the web application is accessible
- Provide valid login credentials if authentication is required
- Test cases should be well-structured for best results
- Screenshots will be saved in the `.trae/skills/web-app-tester/screenshots/` directory
