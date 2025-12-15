# UI Testing

## Installation

### 1. Clone the repository

```
git clone <repository-url>
cd <project-folder>
```

### 2. Install dependencies

```
npm install
```

### 3. Install Playwright browsers

```
npx playwright install
```

## Running Tests

### Run all tests

```
npm test
```

<img width="1795" height="668" alt="image" src="https://github.com/user-attachments/assets/cd72de1d-4595-4a26-85f3-be9b6666fb40" />
<img width="1099" height="856" alt="image" src="https://github.com/user-attachments/assets/4170e275-3901-48e1-8955-c697b777f3d6" />



### Cross-Browser Testing

```
# Chrome only
npm run test:chrome

# Firefox only
npm run test:firefox

# All browsers and resolutions (default)
npm test
```

### Screen Resolutions

```
# Run on specific resolution
npx playwright test --project=chromium-1920x1080
npx playwright test --project=chromium-1366x768
npx playwright test --project=firefox-1920x1080
npx playwright test --project=firefox-1366x768
```

### Parallel Execution

```
# 4 workers (default)
npx playwright test --workers=4

# Sequential execution
npx playwright test --workers=1

# 2 workers
npx playwright test --workers=2
```

### Run Specific Tests by Keyword (--grep)

```
# Run tests containing "Test 1"
npx playwright test --grep "Test 1"

# Run all Positive tests
npx playwright test --grep "Positive"
```

### Run Specific Test File

```
# Practice Form tests only
npx playwright test tests/practiceFormPage.spec.js

# Alerts tests only
npx playwright test tests/alertsPage.spec.js

# With specific browser
npx playwright test tests/practiceFormPage.spec.js --project=chromium-1920x1080
```

### View Reports

```
# After test completion
npx playwright show-report
```
## CI/CD

Tests run automatically:

- **Daily**: Every day at 9:00 AM UTC
- **Pull Request**: On PR creation/update to `main` or `develop`
- **Push**: On push to `main` branch

<img width="1855" height="655" alt="image" src="https://github.com/user-attachments/assets/f378b91e-a0d1-4d6f-b4fb-5ea1ce7fc3e4" />
<img width="1321" height="715" alt="image" src="https://github.com/user-attachments/assets/1ef701aa-1952-4fd8-b548-9935626a1d4c" />
<img width="1038" height="875" alt="image" src="https://github.com/user-attachments/assets/0247edd4-e14e-45ce-b789-7fc61d8c3805" />



### CI Configuration:

- **Browsers**: Chromium, Firefox
- **Resolutions**: 1920x1080, 1366x768
- **Workers**: 2 (configurable)
- **Retries**: 2 attempts on failure
- **Artifacts**: HTML reports, screenshots, JSON (30 days retention)

## Reports

### Locally

```
npx playwright show-report
```

### In CI/CD

Artifacts available in GitHub Actions:
1. Go to Actions tab ---> select workflow run
2. Download:
   - `playwright-report` - HTML report
   - `test-results` - JSON/JUnit results
   - `failed-test-screenshots` - Error screenshots
