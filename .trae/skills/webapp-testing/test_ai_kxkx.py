from playwright.sync_api import sync_playwright
import time
import os

# Create screenshots directory if it doesn't exist
screenshots_dir = os.path.join(os.path.dirname(__file__), 'screenshots')
os.makedirs(screenshots_dir, exist_ok=True)

def test_ai_kxkx_login():
    """Test AI快销 login and sales order process"""
    with sync_playwright() as p:
        # Launch browser
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        try:
            # Navigate to login page
            print("Navigating to AI快销 login page...")
            page.goto('https://sys.ai.kxkx888.com/pc-main/work/login.html#/')
            page.wait_for_load_state('networkidle')
            
            # Take initial screenshot
            initial_screenshot = os.path.join(screenshots_dir, f'ai_kxkx_initial_{int(time.time())}.png')
            page.screenshot(path=initial_screenshot, full_page=True)
            print(f"Initial screenshot saved to: {initial_screenshot}")
            
            # Try different username selectors
            username_selectors = ['#username', 'input[name="username"]', 'input[type="text"]']
            password_selectors = ['#password', 'input[name="password"]', 'input[type="password"]']
            submit_selectors = ['button[type="submit"]', '.login-btn', '#login-btn']
            
            # Find and fill username
            username_found = False
            for selector in username_selectors:
                try:
                    print(f"Trying username selector: {selector}")
                    page.wait_for_selector(selector, timeout=5000)
                    page.fill(selector, '13851690453')
                    username_found = True
                    print("Username filled successfully")
                    break
                except Exception as e:
                    print(f"Username selector not found: {selector}")
            
            # Find and fill password
            password_found = False
            for selector in password_selectors:
                try:
                    print(f"Trying password selector: {selector}")
                    page.wait_for_selector(selector, timeout=5000)
                    page.fill(selector, 'Ai123456')
                    password_found = True
                    print("Password filled successfully")
                    break
                except Exception as e:
                    print(f"Password selector not found: {selector}")
            
            # Find and click submit button
            submit_found = False
            for selector in submit_selectors:
                try:
                    print(f"Trying submit selector: {selector}")
                    page.wait_for_selector(selector, timeout=5000)
                    page.click(selector)
                    submit_found = True
                    print("Submit button clicked successfully")
                    break
                except Exception as e:
                    print(f"Submit selector not found: {selector}")
            
            if not submit_found:
                print("No submit selector found, trying Enter key")
                page.keyboard.press('Enter')
            
            # Wait for navigation
            try:
                page.wait_for_navigation(timeout=15000)
                print("Navigation successful")
            except Exception as e:
                print("Navigation timeout, continuing")
            
            # Take login screenshot
            login_screenshot = os.path.join(screenshots_dir, f'ai_kxkx_login_{int(time.time())}.png')
            page.screenshot(path=login_screenshot, full_page=True)
            print(f"Login screenshot saved to: {login_screenshot}")
            
            # Explore page
            print("Exploring page...")
            page.wait_for_load_state('networkidle')
            
            # Get page title
            title = page.title()
            print(f"Page title: {title}")
            
            # Get all buttons
            buttons = page.locator('button').all()
            print(f"Found buttons: {len(buttons)}")
            for i, button in enumerate(buttons[:5]):  # Show first 5 buttons
                try:
                    button_text = button.text_content().strip()
                    print(f"Button {i+1}: {button_text}")
                except Exception as e:
                    print(f"Error getting button text: {e}")
            
            # Take exploration screenshot
            explore_screenshot = os.path.join(screenshots_dir, f'ai_kxkx_explore_{int(time.time())}.png')
            page.screenshot(path=explore_screenshot, full_page=True)
            print(f"Exploration screenshot saved to: {explore_screenshot}")
            
            # Test sales order process
            print("Testing sales order process...")
            
            # Try to find business menu
            try:
                # Try different selectors for business menu
                business_selectors = ['.business-menu', 'text=业务', '#business-menu']
                for selector in business_selectors:
                    try:
                        print(f"Trying business menu selector: {selector}")
                        page.wait_for_selector(selector, timeout=5000)
                        page.click(selector)
                        print("Business menu clicked successfully")
                        break
                    except Exception as e:
                        print(f"Business menu selector not found: {selector}")
                
                # Wait for menu to expand
                time.sleep(1)
                
                # Try to find sales menu
                sales_selectors = ['.sales-menu', 'text=销售', '#sales-menu']
                for selector in sales_selectors:
                    try:
                        print(f"Trying sales menu selector: {selector}")
                        page.wait_for_selector(selector, timeout=5000)
                        page.click(selector)
                        print("Sales menu clicked successfully")
                        break
                    except Exception as e:
                        print(f"Sales menu selector not found: {selector}")
                
                # Wait for menu to expand
                time.sleep(1)
                
                # Try to find create order menu
                create_order_selectors = ['.create-order', 'text=开单', '#create-order']
                for selector in create_order_selectors:
                    try:
                        print(f"Trying create order selector: {selector}")
                        page.wait_for_selector(selector, timeout=5000)
                        page.click(selector)
                        print("Create order clicked successfully")
                        break
                    except Exception as e:
                        print(f"Create order selector not found: {selector}")
                
                # Wait for page to load
                time.sleep(2)
                
                # Take create order screenshot
                create_order_screenshot = os.path.join(screenshots_dir, f'ai_kxkx_create_order_{int(time.time())}.png')
                page.screenshot(path=create_order_screenshot, full_page=True)
                print(f"Create order screenshot saved to: {create_order_screenshot}")
                
                # Test order query
                print("Testing order query...")
                
                # Try to find business menu again
                for selector in business_selectors:
                    try:
                        print(f"Trying business menu selector: {selector}")
                        page.wait_for_selector(selector, timeout=5000)
                        page.click(selector)
                        print("Business menu clicked successfully")
                        break
                    except Exception as e:
                        print(f"Business menu selector not found: {selector}")
                
                # Wait for menu to expand
                time.sleep(1)
                
                # Try to find sales menu again
                for selector in sales_selectors:
                    try:
                        print(f"Trying sales menu selector: {selector}")
                        page.wait_for_selector(selector, timeout=5000)
                        page.click(selector)
                        print("Sales menu clicked successfully")
                        break
                    except Exception as e:
                        print(f"Sales menu selector not found: {selector}")
                
                # Wait for menu to expand
                time.sleep(1)
                
                # Try to find order query menu
                print("Looking for order query menu...")
                order_query_selectors = ['text=订单查询', '.order-query', '#order-query', '//*[contains(text(), "订单查询")]']
                for selector in order_query_selectors:
                    try:
                        print(f"Trying order query selector: {selector}")
                        page.wait_for_selector(selector, timeout=8000)
                        # Click the selector
                        if selector.startswith('//'):
                            # XPath selector
                            page.locator(selector).click()
                        else:
                            # CSS selector
                            page.click(selector)
                        print("Order query clicked successfully")
                        break
                    except Exception as e:
                        print(f"Order query selector not found: {selector}, error: {e}")
                
                # Wait for page to navigate and load completely
                print("Waiting for order query page to load...")
                
                # Wait for network idle
                page.wait_for_load_state('networkidle', timeout=30000)
                print("Network idle achieved")
                
                # Check current URL
                current_url = page.url
                print(f"Current URL: {current_url}")
                
                # Wait for data to load
                print("Waiting for order data to load...")
                time.sleep(5)  # Increased wait time
                
                # Try to find order list elements - look for the actual order table
                try:
                    print("Looking for order list elements...")
                    # Try different selectors for order list - more specific to the actual table
                    order_list_selectors = [
                        'table.order-table', 
                        '#orderTable', 
                        '.order-list-table', 
                        '//table[@class="order-table"]',
                        '//table[contains(@class, "order")]',
                        '//div[contains(@class, "order-list")]//table',
                        '//*[@id="orderTable"]',
                        '//*[contains(@id, "order")]//table'
                    ]
                    for selector in order_list_selectors:
                        try:
                            print(f"Trying order list selector: {selector}")
                            page.wait_for_selector(selector, timeout=15000)
                            print("Order list found successfully")
                            break
                        except Exception as e:
                            print(f"Order list selector not found: {selector}")
                except Exception as e:
                    print(f"Error finding order list: {e}")
                
                # Try to find page title element - look for the actual page title
                try:
                    print("Looking for page title element...")
                    # Look for common page title selectors - more specific
                    title_selectors = [
                        '.page-header h1', 
                        '#pageTitle', 
                        '.page-title', 
                        '//div[@class="page-header"]//h1',
                        '//h1[contains(text(), "订单")]',
                        '//*[@class="page-title"]',
                        '//*[@id="pageTitle"]'
                    ]
                    for selector in title_selectors:
                        try:
                            print(f"Trying page title selector: {selector}")
                            page.wait_for_selector(selector, timeout=10000)
                            title_element = page.locator(selector).first
                            title_text = title_element.text_content().strip()
                            print(f"Found page title: {title_text}")
                            break
                        except Exception as e:
                            print(f"Page title selector not found: {selector}")
                except Exception as e:
                    print(f"Error finding page title: {e}")
                
                # Wait a bit more to ensure everything is loaded
                time.sleep(3)
                
                # Take order query screenshot with full page
                order_query_screenshot = os.path.join(screenshots_dir, f'ai_kxkx_order_query_{int(time.time())}.png')
                page.screenshot(path=order_query_screenshot, full_page=True)
                print(f"Order query screenshot saved to: {order_query_screenshot}")
                
                # Take another screenshot - focus on the main content area
                time.sleep(1)
                # Try to find the main content area and take screenshot of that
                try:
                    print("Looking for main content area...")
                    content_selectors = ['.main-content', '#mainContent', '//div[@class="main-content"]']
                    for selector in content_selectors:
                        try:
                            page.wait_for_selector(selector, timeout=5000)
                            # Take screenshot of just the content area
                            content_element = page.locator(selector)
                            content_screenshot = os.path.join(screenshots_dir, f'ai_kxkx_order_query_content_{int(time.time())}.png')
                            content_element.screenshot(path=content_screenshot)
                            print(f"Content area screenshot saved to: {content_screenshot}")
                            break
                        except Exception as e:
                            print(f"Content area selector not found: {selector}")
                except Exception as e:
                    print(f"Error taking content screenshot: {e}")
                
                # Take final full page screenshot
                order_query_screenshot2 = os.path.join(screenshots_dir, f'ai_kxkx_order_query_final_{int(time.time())}.png')
                page.screenshot(path=order_query_screenshot2, full_page=True)
                print(f"Final order query screenshot saved to: {order_query_screenshot2}")
                
                # Try to scroll down to capture more content
                try:
                    print("Scrolling down to capture more content...")
                    page.mouse.wheel(0, 2000)  # Scroll more
                    time.sleep(2)
                    order_query_screenshot3 = os.path.join(screenshots_dir, f'ai_kxkx_order_query_scrolled_{int(time.time())}.png')
                    page.screenshot(path=order_query_screenshot3, full_page=True)
                    print(f"Scrolled order query screenshot saved to: {order_query_screenshot3}")
                except Exception as e:
                    print(f"Error scrolling: {e}")
                
                # Test print template
                print("Testing print template...")
                
                # Try to find archives menu
                archives_selectors = ['.archives-menu', 'text=档案', '#archives-menu']
                for selector in archives_selectors:
                    try:
                        print(f"Trying archives menu selector: {selector}")
                        page.wait_for_selector(selector, timeout=5000)
                        page.click(selector)
                        print("Archives menu clicked successfully")
                        break
                    except Exception as e:
                        print(f"Archives menu selector not found: {selector}")
                
                # Wait for menu to expand
                time.sleep(1)
                
                # Try to find print template menu
                print_template_selectors = ['.print-template', 'text=打印模板', '#print-template']
                for selector in print_template_selectors:
                    try:
                        print(f"Trying print template selector: {selector}")
                        page.wait_for_selector(selector, timeout=5000)
                        page.click(selector)
                        print("Print template clicked successfully")
                        break
                    except Exception as e:
                        print(f"Print template selector not found: {selector}")
                
                # Wait for page to load
                time.sleep(2)
                
                # Take print template screenshot
                print_template_screenshot = os.path.join(screenshots_dir, f'ai_kxkx_print_template_{int(time.time())}.png')
                page.screenshot(path=print_template_screenshot, full_page=True)
                print(f"Print template screenshot saved to: {print_template_screenshot}")
                
            except Exception as e:
                print(f"Error during sales order process: {e}")
                # Take error screenshot
                error_screenshot = os.path.join(screenshots_dir, f'ai_kxkx_error_{int(time.time())}.png')
                page.screenshot(path=error_screenshot, full_page=True)
                print(f"Error screenshot saved to: {error_screenshot}")
            
            print("\nTest completed successfully!")
            print(f"Total screenshots taken: {len(os.listdir(screenshots_dir))}")
            
        finally:
            # Close browser
            browser.close()
            print("Browser closed")

if __name__ == "__main__":
    test_ai_kxkx_login()
