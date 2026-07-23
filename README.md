# ICT2216 Lab 7 - GitHub Actions with Automated Testing

This project demonstrates unit testing with Mocha/Chai, integration and UI testing with
Selenium, and automated execution of both test types in GitHub Actions.

## Install and run the unit tests

```powershell
npm install
npm test
```

The unit tests verify that `getCurrentTimestamp()` returns a current ISO 8601 timestamp.

## Run the application locally

```powershell
node src/server.js
```

Open <http://localhost:3000/>. Stop the server with `Ctrl+C` when finished.

## Run the Selenium test locally

Start a Selenium Chrome container:

```powershell
docker run -d -p 4444:4444 --name selenium-server selenium/standalone-chrome
```

With the application still running in another terminal, execute:

```powershell
$env:TEST_BASE_URL = 'http://host.docker.internal:3000'
npm run test:selenium
Remove-Item Env:TEST_BASE_URL
```

The test opens the application in Chrome, waits for the timestamp returned by the server,
and validates its ISO 8601 format. `host.docker.internal` lets Chrome inside the Docker
container reach the Node.js server on Windows. Remove the container afterward with:

```powershell
docker rm -f selenium-server
```

## GitHub Actions

`.github/workflows/selenium-tests.yml` runs for pushes and pull requests targeting
`main`. Its build job packages the application as an artifact. Its test job restores the
artifact, runs the unit tests, starts the application and Selenium service, and runs the
browser test.
