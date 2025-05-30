# GitHub Actions Setup Guide

## Setup for Public Package

This package is configured for public distribution and uses simplified authentication with GitHub's built-in tokens.

## Required Configuration

### 1. GitHub Packages

- No additional secrets required! The workflows use the built-in `GITHUB_TOKEN`
- The package will be published to GitHub Packages at `@breakdown_us/congress`

### 2. Repository Settings

1. Go to Settings > Actions > General
2. Under "Workflow permissions", select "Read and write permissions"
3. Check "Allow GitHub Actions to create and approve pull requests"

## Release Process

### Automatic Patch Release

- Push to `main` branch
- A patch release will be automatically created unless the commit message contains `[Release:Minor]`

### Minor Release

- Include `[Release:Minor]` in your commit message when pushing to `main`

### Pre-release

- Add the `prerelease` label to any pull request
- A pre-release version will be published with the format: `version-branchname-sha.0`

## Package Installation

Once published, users can install your package with:

```bash
# Configure npm to use GitHub Packages for @breakdown_us scope
npm config set @breakdown_us:registry https://npm.pkg.github.com

# Install the package
npm install @breakdown_us/congress
```

## Security Notes

- The workflows use GitHub's built-in `GITHUB_TOKEN` which provides secure, scoped access
- No custom personal access tokens or SSH keys are required
- Pre-release builds are limited to pull requests with the `prerelease` label for security

## Commit Message Conventions

- `Chore: Release v1.0.13` - Automatically generated release commits (will be skipped for new releases)
- `[Release:Minor] Add new feature` - Triggers a minor version bump
- Regular commits trigger patch releases
