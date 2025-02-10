# **Contributing to `oakd`**

Thank you for considering contributing to `oakd`! 🚀  
This document outlines guidelines to ensure smooth collaboration and maintain code quality.

---  

## **📜 Table of Contents**
- [📦 Setting Up Your Development Environment](#-setting-up-your-development-environment)
- [💻 Code Contributions](#-code-contributions)
- [📖 Documentation](#-documentation)
- [🧪 Testing](#-testing)
- [📦 Building & Packaging](#-building--packaging)
- [📜 Submitting a Pull Request](#-submitting-a-pull-request)
- [🚀 Publishing to NPM](#-publishing-to-npm)
- [🤝 Code of Conduct](#-code-of-conduct)

---  

## **📦 Setting Up Your Development Environment**

First, clone the repository:
```sh  
git clone https://github.com/arkamedus/components.git  
cd components  
```  

Install dependencies:
```sh  
npm install  
```  

Build the project:
```sh  
npm run build  
```  

Run Storybook for UI development:
```sh  
npm run storybook  
```  

---  

## **💻 Code Contributions**

### **🛠 Creating a New Component**

Use the component generator:
```sh  
npm run generate YourComponentName  
```  
This creates:
```sh  
/src/YourComponentName  
  ├── YourComponentName.tsx  
  ├── YourComponentName.mdx
  ├── YourComponentName.stories.tsx  
  ├── YourComponentName.test.tsx  
  ├── YourComponentName.types.ts  
  ├── YourComponentName.css  
```  

After generating a component:
- Implement the component in `YourComponentName.tsx`.
- Ensure it has default props and prop types (`YourComponentName.types.ts`).
- Write unit tests in `YourComponentName.test.tsx`.
- Create a Storybook entry in `YourComponentName.stories.tsx`.
- Style it in `YourComponentName.css` if needed.
- Export it in `index.ts`.

### **📂 Project Structure**

```
oakd/  
├── src/  
│   ├── Atom/ (Basic UI components)  
│   ├── Layout/ (Layout-based components)  
│   ├── Icon/ (Icons)  
│   ├── index.ts (Exports all components)  
├── build/ (Generated output)  
├── stories/ (Storybook configuration)  
├── tests/ (Jest configuration)  
├── rollup.config.js (Build config)  
├── jest.config.js (Testing config)  
├── tsconfig.json (TypeScript config)  
├── package.json  
```  

---  

## **📖 Documentation**

- **Component Docs:** Update Storybook files (`.stories.tsx`).
- **README:** Ensure `README.md` has updated usage examples.
- **API Docs:** Keep TypeScript `types.ts` files clean and descriptive.

Run Storybook locally to check documentation:
```sh  
npm run storybook  
```  

---  

## **🧪 Testing**

All components **must** have unit tests. We use **Jest** and **React Testing Library**.

Run tests:
```sh  
npm run test  
```  

To run tests in watch mode:
```sh  
npm run test:watch  
```  

Code coverage is automatically collected in `coverage/`.

Test files should:
- Cover all prop variations.
- Use `jest-dom` assertions.
- Mock external dependencies when necessary.

Example test (`Button.test.tsx`):
```tsx  
import { render, screen } from "@testing-library/react";  
import Button from "./Button";  

test("renders button with correct text", () => {  
  render(<Button>Click Me</Button>);  
  expect(screen.getByText("Click Me")).toBeInTheDocument();  
});  
```  

---  

## **📦 Building & Packaging**

Ensure a fresh build before publishing:
```sh  
npm run build  
```  

Rollup is configured to:
- Generate CommonJS (`build/index.js`) and ES Modules (`build/index.esm.js`).
- Copy `index.css` to `build/`.
- Handle images via `@rollup/plugin-image`.
- Bundle JSON support with `@rollup/plugin-json`.

---  

## **📜 Submitting a Pull Request**

### **✅ PR Checklist**
Before submitting a PR:
- **Run tests:** `npm run test`
- **Build project:** `npm run build`
- **Check Storybook:** `npm run storybook`
- **Ensure 100% linting pass:** `eslint src --fix`

### **📌 PR Guidelines**
- Use clear commit messages (`feat: add new Button component`).
- Include relevant documentation updates.
- Keep PRs small and focused (one feature per PR).
- Reference issues in PRs (`Fixes #123`).

---  

## **🚀 Publishing to NPM**

### **📤 Publishing a New Version**

Ensure you're logged into npm:
```sh  
npm login  
```  

Bump the version in `package.json` (**patch, minor, or major**):
```sh  
npm version patch  
npm version minor  
npm version major  
```  

Then publish:
```sh  
npm publish  
```  

This will:
- Run `npm run build`.
- Publish the package to the npm registry.

### **🛠 GitHub Installations**

To install directly from GitHub:
```sh  
npm i --save git+https://github.com/arkamedus/components.git#branch-name  
```  

---  

## **🤝 Code of Conduct**

### **🚀 Be Respectful**
- Treat others with kindness and respect.
- Use inclusive language.

### **🔄 Collaboration**
- Give constructive feedback.
- Help others when possible.

### **🚨 Reporting Issues**
If you experience issues, open a GitHub issue with a clear description and steps to reproduce.

---  

## **📣 Join the Discussion**

Have ideas, questions, or feedback?
- Open an issue or PR.
- Start a discussion in GitHub Discussions.

🚀 **Thank you for contributing to `oakd`!** 🚀