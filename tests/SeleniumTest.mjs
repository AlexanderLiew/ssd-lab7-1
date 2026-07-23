import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert';

// Get the argument (default to 'local' if not provided)
const environment = process.argv[2] || 'local';

// URLs based on environment
// Obtain dev selenium server IP using: docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' selenium-server
const seleniumUrl = process.env.SELENIUM_HOST ?? (environment === 'github'
  ? 'http://selenium:4444/wd/hub'
  : 'http://localhost:4444/wd/hub');

// Note: Start the nodejs server before running the test locally
const serverUrl = process.env.TEST_BASE_URL ?? (environment === 'github'
  ? 'http://testserver:3000'
  : 'http://localhost:3000');

console.log(`Running tests in '${environment}' environment`);
console.log(`Selenium URL: ${seleniumUrl}`);
console.log(`Server URL: ${serverUrl}`);

const driver = await new Builder()
  .forBrowser('chrome')
  .usingServer(seleniumUrl)
  .build();

try {
  await driver.get(serverUrl);

  const timestampElement = await driver.wait(
    until.elementLocated(By.id('timestamp')),
    5000
  );

  // The element exists before fetch() finishes, so wait for its final content too.
  await driver.wait(
    until.elementTextMatches(timestampElement, /^Server timestamp:\s*.+/),
    5000
  );

  const timestampText = await timestampElement.getText();
  console.log(`Timestamp: ${timestampText}`);

  const timestampMatch = timestampText.match(/^Server timestamp:\s*(.*)$/);
  assert.ok(timestampMatch, 'Timestamp text does not match expected format');

  const timestampRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
  assert.match(timestampMatch[1], timestampRegex, 'Timestamp format is invalid');
  console.log('Selenium integration test passed.');
} finally {
  // Any assertion or WebDriver error now propagates and fails the process/CI job.
  await driver.quit();
}
