# Automated Dependency Updates

This document outlines the automated dependency update strategy for the Thiasil project, ensuring security, stability, and up-to-date dependencies.

## Overview

Automated dependency updates help maintain the project by:
- Keeping dependencies secure and up-to-date
- Reducing maintenance overhead
- Ensuring compatibility with latest features
- Automating security vulnerability patches

## Dependabot Configuration

### Setup Dependabot
Create `.github/dependabot.yml` for automated dependency updates:

```yaml
version: 2
updates:
  # Enable version updates for npm
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
      timezone: "Asia/Kolkata"
    open-pull-requests-limit: 10
    reviewers:
      - "sharanggupta"
    assignees:
      - "sharanggupta"
    commit-message:
      prefix: "deps"
      include: "scope"
    labels:
      - "dependencies"
      - "automated"
    
    # Group related updates
    groups:
      react-ecosystem:
        patterns:
          - "react*"
          - "@types/react*"
      next-ecosystem:
        patterns:
          - "next*"
          - "@next/*"
      testing-tools:
        patterns:
          - "*jest*"
          - "@testing-library/*"
          - "cypress*"
      storybook:
        patterns:
          - "@storybook/*"
          - "storybook"
      linting-tools:
        patterns:
          - "eslint*"
          - "@typescript-eslint/*"
          - "prettier*"
    
    # Ignore specific packages that require manual updates
    ignore:
      - dependency-name: "node"
        update-types: ["version-update:semver-major"]
      - dependency-name: "react"
        update-types: ["version-update:semver-major"]
      - dependency-name: "next"
        update-types: ["version-update:semver-major"]

  # Enable version updates for GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
      timezone: "Asia/Kolkata"
    commit-message:
      prefix: "ci"
    labels:
      - "github-actions"
      - "automated"
```

## Update Categories

### 1. Security Updates (High Priority)
- **Frequency**: Immediate
- **Auto-merge**: Enabled for patch versions
- **Review required**: For major versions

### 2. Feature Updates (Medium Priority)
- **Frequency**: Weekly
- **Auto-merge**: Disabled
- **Review required**: Always

### 3. Development Dependencies (Low Priority)
- **Frequency**: Bi-weekly
- **Auto-merge**: Enabled for minor versions
- **Review required**: For major versions

## Automated Workflows

### 1. Dependency Update Workflow
Create `.github/workflows/dependency-updates.yml`:

```yaml
name: Dependency Updates

on:
  pull_request:
    paths:
      - 'package.json'
      - 'package-lock.json'
    labels:
      - 'dependencies'

jobs:
  test-updates:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run type checking
        run: npm run type-check
        
      - name: Run tests
        run: npm test
        
      - name: Run build
        run: npm run build
        
      - name: Run security audit
        run: npm audit --audit-level=moderate
        
      - name: Check bundle size
        run: |
          npm run build
          npx bundlesize
          
  auto-merge:
    needs: test-updates
    runs-on: ubuntu-latest
    if: github.actor == 'dependabot[bot]'
    
    steps:
      - name: Auto-merge security updates
        uses: pascalgn/merge-action@v0.15.6
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          merge_method: squash
        env:
          MERGE_LABELS: "dependencies,security"
          MERGE_DELETE_BRANCH: true
```

### 2. Security Audit Workflow
Create `.github/workflows/security-audit.yml`:

```yaml
name: Security Audit

on:
  schedule:
    - cron: '0 9 * * 1'  # Every Monday at 9 AM
  workflow_dispatch:

jobs:
  security-audit:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run npm audit
        run: npm audit --audit-level=moderate
        
      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=medium
          
      - name: Upload security scan results
        uses: github/codeql-action/upload-sarif@v2
        if: always()
        with:
          sarif_file: snyk.sarif
```

## Manual Review Process

### Review Checklist
When reviewing dependency updates:

1. **Check Changelog**
   - Review breaking changes
   - Understand new features
   - Note deprecation warnings

2. **Test Compatibility**
   - Run full test suite
   - Check TypeScript compilation
   - Verify build process
   - Test critical user flows

3. **Security Assessment**
   - Review vulnerability reports
   - Check dependency tree for conflicts
   - Verify no malicious packages

4. **Performance Impact**
   - Compare bundle sizes
   - Run performance benchmarks
   - Check for memory leaks

### Major Version Updates

For major version updates, follow this process:

1. **Create Feature Branch**
   ```bash
   git checkout -b update/package-name-v2
   ```

2. **Update Gradually**
   - Update one major dependency at a time
   - Fix breaking changes incrementally
   - Update related dependencies together

3. **Comprehensive Testing**
   - Run extended test suite
   - Perform manual testing
   - Check cross-browser compatibility

4. **Documentation Updates**
   - Update README if needed
   - Revise API documentation
   - Note breaking changes

## Package Management

### Lock File Management
- Always commit `package-lock.json`
- Use `npm ci` in production
- Regenerate lock file for major updates

### Version Pinning Strategy
```json
{
  "dependencies": {
    "react": "^18.2.0",           // Allow minor updates
    "next": "15.3.4",             // Pin exact version for framework
    "@types/react": "^19.1.8"     // Allow minor updates for types
  },
  "devDependencies": {
    "eslint": "^9.30.0",          // Allow minor updates
    "typescript": "^5.8.3",       // Allow minor updates
    "jest": "~30.0.3"             // Allow patch updates only
  }
}
```

## Monitoring and Notifications

### Slack Integration
Configure Slack notifications for dependency updates:

```yaml
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    channel: '#development'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
    text: 'Dependency update failed for ${{ github.repository }}'
  if: failure()
```

### Email Notifications
Set up email alerts for security vulnerabilities:

```yaml
- name: Send security alert
  uses: dawidd6/action-send-mail@v3
  if: contains(github.event.pull_request.labels.*.name, 'security')
  with:
    server_address: smtp.gmail.com
    server_port: 587
    username: ${{ secrets.EMAIL_USERNAME }}
    password: ${{ secrets.EMAIL_PASSWORD }}
    subject: 'Security update available for ${{ github.repository }}'
    body: 'A security update is available and requires review.'
    to: admin@thiasil.com
```

## Best Practices

### 1. Staged Rollout
- Test updates in development first
- Deploy to staging environment
- Monitor for issues before production

### 2. Rollback Strategy
- Keep previous version tags
- Maintain rollback scripts
- Monitor post-deployment metrics

### 3. Communication
- Notify team of major updates
- Document breaking changes
- Share update schedules

### 4. Testing Strategy
```bash
# Pre-update testing
npm run test:all
npm run type-check
npm run build
npm run lint

# Post-update verification
npm run test:integration
npm run test:e2e
npm run audit
```

## Troubleshooting

### Common Issues

1. **Dependency Conflicts**
   ```bash
   npm ls --depth=0
   npm audit fix
   npm update --save
   ```

2. **TypeScript Errors**
   ```bash
   npm install @types/package-name
   npm run type-check
   ```

3. **Build Failures**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

### Emergency Procedures

For critical security vulnerabilities:

1. **Immediate Response**
   - Stop deployments
   - Assess impact
   - Apply hotfix if available

2. **Communication**
   - Alert team immediately
   - Document incident
   - Plan remediation

3. **Recovery**
   - Test emergency patch
   - Deploy to production
   - Monitor for issues

## Maintenance Schedule

### Weekly Tasks
- Review Dependabot PRs
- Merge approved updates
- Run security audits

### Monthly Tasks
- Review update strategy
- Update documentation
- Plan major version updates

### Quarterly Tasks
- Review dependencies for alternatives
- Update Node.js version
- Audit unused dependencies

This automated approach ensures dependencies stay current while maintaining stability and security.