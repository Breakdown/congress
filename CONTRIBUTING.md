# Contributing to @breakdown_us/congress

Thank you for your interest in contributing to the Congress API client! This document provides guidelines and instructions for contributing.

## Development Setup

1. **Fork and clone the repository**

```bash
git clone https://github.com/your-username/congress.git
cd congress
```

2. **Install dependencies**

```bash
npm install
```

3. **Build the project**

```bash
npm run build
```

4. **Run linting**

```bash
npm run lint
```

## Development Workflow

1. **Create a branch for your changes**

```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**

3. **Ensure tests and linting pass**

```bash
npm run lint
npm run build
```

4. **Commit your changes with conventional commit messages**

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
feat: add new endpoint for treaties
fix: correct error handling in bills endpoint
docs: update API documentation
chore: update dependencies
```

5. **Push your changes and create a pull request**

```bash
git push origin feature/your-feature-name
```

Then open a pull request on GitHub.

## Pull Request Guidelines

- Fill in the required pull request template
- Include tests for new features
- Update documentation for API changes
- Ensure all checks pass

## Code Style

We use ESLint and TypeScript to enforce a consistent code style. Please make sure your code follows our style guidelines by running:

```bash
npm run lint
```

## Release Process

Releases are managed through GitHub Actions. The process is as follows:

1. Changes merged to main are automatically published to npm
2. For version releases, use the manual Release workflow in GitHub Actions

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.
