const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class WebAppTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.screenshotsDir = path.join(__dirname, 'screenshots');
  }

  async initialize() {
    console.log('Initializing browser...');
    this.browser = await puppeteer.launch({
      headless: true, // Use headless mode for better performance
      defaultViewport: { width: 1366, height: 768 },
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--remote-debugging-port=9222'
      ],
      timeout: 60000 // Increase timeout
    });
    console.log('Browser initialized successfully');
    this.page = await this.browser.newPage();
    console.log('New page created');
    
    // Set page timeout
    await this.page.setDefaultTimeout(60000);
    console.log('Page timeout set');
  }

  async login(url, credentials) {
    console.log('Logging in to:', url);
    await this.page.goto(url);
    
    // Take initial screenshot for debugging
    const initialScreenshotPath = path.join(this.screenshotsDir, `login_initial_${Date.now()}.png`);
    await this.page.screenshot({ path: initialScreenshotPath });
    console.log('Initial login page screenshot saved to:', initialScreenshotPath);

    try {
      // Try different username selectors
      let usernameSelectors = ['#username', 'input[name="username"]', 'input[type="text"]'];
      let passwordSelectors = ['#password', 'input[name="password"]', 'input[type="password"]'];
      let submitSelectors = ['button[type="submit"]', '.login-btn', '#login-btn'];

      // Find and fill username
      if (credentials.username) {
        let usernameFound = false;
        for (const selector of usernameSelectors) {
          try {
            console.log('Trying username selector:', selector);
            await this.page.waitForSelector(selector, { timeout: 5000 });
            await this.page.type(selector, credentials.username);
            usernameFound = true;
            console.log('Username filled successfully');
            break;
          } catch (error) {
            console.log('Username selector not found:', selector);
          }
        }
        if (!usernameFound) {
          console.log('No username selector found, continuing');
        }
      }

      // Find and fill password
      if (credentials.password) {
        let passwordFound = false;
        for (const selector of passwordSelectors) {
          try {
            console.log('Trying password selector:', selector);
            await this.page.waitForSelector(selector, { timeout: 5000 });
            await this.page.type(selector, credentials.password);
            passwordFound = true;
            console.log('Password filled successfully');
            break;
          } catch (error) {
            console.log('Password selector not found:', selector);
          }
        }
        if (!passwordFound) {
          console.log('No password selector found, continuing');
        }
      }

      // Find and click submit button
      let submitFound = false;
      for (const selector of submitSelectors) {
        try {
          console.log('Trying submit selector:', selector);
          await this.page.waitForSelector(selector, { timeout: 5000 });
          await this.page.click(selector);
          submitFound = true;
          console.log('Submit button clicked successfully');
          break;
        } catch (error) {
          console.log('Submit selector not found:', selector);
        }
      }
      if (!submitFound) {
        console.log('No submit selector found, trying Enter key');
        await this.page.keyboard.press('Enter');
      }

      // Wait for navigation with timeout
      try {
        await this.page.waitForNavigation({ timeout: 15000 });
        console.log('Navigation successful');
      } catch (error) {
        console.log('Navigation timeout, continuing');
      }

      const screenshotPath = path.join(this.screenshotsDir, `login_${Date.now()}.png`);
      await this.page.screenshot({ path: screenshotPath });
      console.log('Login screenshot saved to:', screenshotPath);

      return screenshotPath;
    } catch (error) {
      console.error('Login error:', error);
      const errorScreenshotPath = path.join(this.screenshotsDir, `login_error_${Date.now()}.png`);
      await this.page.screenshot({ path: errorScreenshotPath });
      console.log('Error screenshot saved to:', errorScreenshotPath);
      throw error;
    }
  }

  async explorePage() {
    console.log('Exploring page...');
    
    // Get page title
    const title = await this.page.title();
    console.log('Page title:', title);

    // Get all links
    const links = await this.page.evaluate(() => {
      return Array.from(document.querySelectorAll('a')).map(a => ({
        text: a.textContent.trim(),
        href: a.href
      }));
    });
    console.log('Found links:', links.length);

    // Get all buttons
    const buttons = await this.page.evaluate(() => {
      return Array.from(document.querySelectorAll('button')).map(button => ({
        text: button.textContent.trim(),
        id: button.id,
        className: button.className
      }));
    });
    console.log('Found buttons:', buttons.length);

    const screenshotPath = path.join(this.screenshotsDir, `explore_${Date.now()}.png`);
    await this.page.screenshot({ path: screenshotPath });
    console.log('Exploration screenshot saved to:', screenshotPath);

    return {
      title,
      links: links.slice(0, 10), // Limit to first 10 links
      buttons: buttons.slice(0, 10), // Limit to first 10 buttons
      screenshot: screenshotPath
    };
  }

  async runTestCases(testCases) {
    const results = [];

    for (const testCase of testCases) {
      console.log(`Running test case: ${testCase.name}`);
      const testResult = {
        name: testCase.name,
        steps: [],
        expected: testCase.expected,
        status: 'pass',
        screenshots: []
      };

      try {
        for (const step of testCase.steps) {
          console.log(`  Executing step: ${step.action}`);
          const stepResult = {
            action: step.action,
            status: 'pass'
          };

          try {
            switch (step.action) {
              case 'navigate':
                await this.page.goto(step.target);
                break;
              case 'click':
                await this.page.waitForSelector(step.selector);
                await this.page.click(step.selector);
                break;
              case 'fill':
                await this.page.waitForSelector(step.selector);
                await this.page.type(step.selector, step.value);
                break;
              case 'submit':
                await this.page.keyboard.press('Enter');
                await this.page.waitForNavigation();
                break;
              case 'wait':
                await this.page.waitForTimeout(step.value);
                break;
              case 'assert':
                await this.page.waitForSelector(step.selector);
                if (step.content) {
                  const elementContent = await this.page.$eval(step.selector, el => el.textContent);
                  if (!elementContent.includes(step.content)) {
                    throw new Error(`Assertion failed: Content not found`);
                  }
                }
                break;
            }

            // Take screenshot after successful step
            const screenshotPath = path.join(this.screenshotsDir, `${testCase.name}_${step.action}_${Date.now()}.png`);
            await this.page.screenshot({ path: screenshotPath });
            testResult.screenshots.push(screenshotPath);

          } catch (error) {
            stepResult.status = 'fail';
            stepResult.error = error.message;
            testResult.status = 'fail';
          }

          testResult.steps.push(stepResult);
        }
      } catch (error) {
        testResult.status = 'fail';
        testResult.error = error.message;
      }

      results.push(testResult);
    }

    return results;
  }

  async generateReport(results) {
    const report = {
      timestamp: new Date().toISOString(),
      totalTests: results.length,
      passedTests: results.filter(r => r.status === 'pass').length,
      failedTests: results.filter(r => r.status === 'fail').length,
      results
    };

    const reportPath = path.join(this.screenshotsDir, `test_report_${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log('Test report generated at:', reportPath);

    return report;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Example usage
async function main() {
  const tester = new WebAppTester();
  
  try {
    await tester.initialize();

    // Test AI快销 login
    await tester.login('https://sys.ai.kxkx888.com/pc-main/work/login.html#/', {
      username: '13851690453',
      password: 'Ai123456'
    });

    // Explore page
    await tester.explorePage();

    // Test cases for AI快销 - 销售开单完整流程
    const testCases = [
      {
        name: 'Dashboard Navigation',
        steps: [
          {
            action: 'wait',
            value: 2000
          }
        ],
        expected: 'Should load dashboard after login'
      },
      {
        name: '销售开单完整流程 (SALE-CORE-01)',
        steps: [
          {
            action: 'click',
            selector: '.business-menu'
          },
          {
            action: 'wait',
            value: 1000
          },
          {
            action: 'click',
            selector: '.sales-menu'
          },
          {
            action: 'wait',
            value: 1000
          },
          {
            action: 'click',
            selector: '.create-order'
          },
          {
            action: 'wait',
            value: 2000
          },
          {
            action: 'wait',
            value: 2000
          },
          {
            action: 'click',
            selector: '.business-menu'
          },
          {
            action: 'wait',
            value: 1000
          },
          {
            action: 'click',
            selector: '.sales-menu'
          },
          {
            action: 'wait',
            value: 1000
          },
          {
            action: 'click',
            selector: '.order-query'
          },
          {
            action: 'wait',
            value: 2000
          },
          {
            action: 'click',
            selector: '.archives-menu'
          },
          {
            action: 'wait',
            value: 1000
          },
          {
            action: 'click',
            selector: '.print-template'
          },
          {
            action: 'wait',
            value: 2000
          }
        ],
        expected: '销售开单完整流程测试通过'
      }
    ];

    const results = await tester.runTestCases(testCases);
    await tester.generateReport(results);

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await tester.close();
  }
}

if (require.main === module) {
  main();
}

module.exports = WebAppTester;