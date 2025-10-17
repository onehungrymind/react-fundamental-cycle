# Learn React Fundamentals 

A comprehensive learning path that transforms a simple master-detail view into a fully-featured, production-ready React application. This project provides 30 progressive challenges that build upon each other, teaching essential React patterns, state management, API integration, and testing strategies.

## 🎯 Project Overview

This repository contains a complete React learning curriculum that evolves from basic static components to a sophisticated application with:

- **Modern React Patterns**: Hooks, Context, useReducer, and advanced component architecture
- **State Management Evolution**: Local state → Context → Redux Toolkit → RTK Query
- **API Integration**: Data fetching, optimistic updates, caching, and error handling
- **Testing Pyramid**: Unit tests, integration tests, and end-to-end testing with Playwright
- **Production Features**: Routing, forms, validation, and performance optimization

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation & Setup
```bash
# Fork my repository
From github, `fork` my respository, `https://github.com/TimothyChenAllen/react-fundamental-cycle`

# Clone YOUR GitHub repository to your local machine:
git clone https://github.com/YOUR_REPOSITORY/react-fundamental-cycle.git
cd react-fundamental-cycle

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Available Scripts
```bash
npm run dev          # Start Next.js development server
npm run build        # Build for production
npm run start        # Start production server
npm run test         # Run all unit tests with coverage
npm run test:unit    # Run unit tests only
npm run test:e2e     # Run Playwright end-to-end tests
npm run lint         # Run ESLint
```

## 📚 How to Work Through the Challenges

### Challenge Structure
Each challenge is self-contained in its own directory:
```
challenges/
├── 01-static-master-detail-layout/
│   ├── CHALLENGE.md          # Challenge description and requirements
│   └── solution/
│       ├── Solution.tsx      # Complete working solution
│       └── __tests__/
│           └── solution.test.tsx  # Unit tests
├── 02-reusable-listitem-component/
│   └── ...
```

### Working on Challenges

1. **Read the Challenge**: Start with `CHALLENGE.md` in each challenge directory
2. **Understand Requirements**: Review the objective, requirements, and expected outcomes
3. **Read the Resources**: Review [RESOURCES.md](RESOURCES.md) for web resources
4. **Implement Your Solution**: Create your own implementation based on the requirements
5. **Test Your Work**: Run `npm run test` to verify your solution passes the tests
6. **Compare with Solution**: Review the provided `Solution.tsx` to learn from the reference implementation
7. **Move to Next Challenge**: Each challenge builds upon the previous ones

### Development Environment

The project includes:
- **Base Application**: A working master-detail app in `app/` for experimentation
- **API Endpoints**: Mock API at `/api/items` for data fetching challenges
- **Testing Setup**: Jest + React Testing Library for unit tests
- **E2E Testing**: Playwright for end-to-end testing
- **TypeScript**: Full TypeScript support throughout

## 📋 Table of Contents

### Phase 1: Static UI Foundations
- [Challenge 01: Static Master-Detail Layout](./challenges/01-static-master-detail-layout/CHALLENGE.md) - Basic component structure
- [Challenge 02: Reusable ListItem Component](./challenges/02-reusable-listitem-component/CHALLENGE.md) - Component composition
- [Challenge 03: Conditional Detail View](./challenges/03-conditional-detail-view/CHALLENGE.md) - Conditional rendering
- [Challenge 04: Render Dynamic Lists](./challenges/04-render-dynamic-lists/CHALLENGE.md) - Dynamic data rendering
- [Challenge 05: Composition with Card](./challenges/05-composition-with-card/CHALLENGE.md) - Component composition patterns
- [Challenge 06: Styling the UI](./challenges/06-styling-the-ui/CHALLENGE.md) - CSS and layout fundamentals

### Phase 2: Adding Interactivity (Local State)
- [Challenge 07: Selectable List Items](./challenges/07-selectable-list-items/CHALLENGE.md) - Event handling and state
- [Challenge 08: Controlled Filter Input](./challenges/08-controlled-filter-input/CHALLENGE.md) - Controlled components
- [Challenge 09: Form to Add New Items](./challenges/09-form-add-new-item/CHALLENGE.md) - Form handling
- [Challenge 10: Immutability in Updates](./challenges/10-immutability-in-updates/CHALLENGE.md) - Immutable state patterns
- [Challenge 11: Derived State Discipline](./challenges/11-derived-state-discipline/CHALLENGE.md) - Computed values
- [Challenge 12: Reset Detail on Filter Change](./challenges/12-reset-detail-on-filter-change/CHALLENGE.md) - State synchronization

### Phase 3: Scaling State
- [Challenge 13: Lift State Up](./challenges/13-lift-state-up/CHALLENGE.md) - State lifting patterns
- [Challenge 14: Context vs Prop Drilling](./challenges/14-context-vs-prop-drilling/CHALLENGE.md) - React Context
- [Challenge 15: useReducer for Complex Updates](./challenges/15-useReducer-for-complex-updates/CHALLENGE.md) - Complex state management
- [Challenge 16: Context + Reducer](./challenges/16-context-plus-reducer/CHALLENGE.md) - Combined state patterns
- [Challenge 17: Container-Presenter Split](./challenges/17-container-presenter-split/CHALLENGE.md) - Component architecture

### Phase 4: Remote Data & Effects
- [Challenge 18: Remote List Fetch](./challenges/18-remote-list-fetch/CHALLENGE.md) - API integration
- [Challenge 19: Remote Detail Fetch](./challenges/19-remote-detail-fetch/CHALLENGE.md) - Individual data fetching
- [Challenge 20: Persist New Item](./challenges/20-persist-new-item/CHALLENGE.md) - Data persistence
- [Challenge 21: Optimistic Updates](./challenges/21-optimistic-updates/CHALLENGE.md) - Optimistic UI patterns

### Phase 5: Advanced State Management
- [Challenge 22: Route-Based Selection](./challenges/22-route-based-selection/CHALLENGE.md) - Routing integration
- [Challenge 23: Redux Toolkit Store](./challenges/23-redux-toolkit-store/CHALLENGE.md) - Redux setup
- [Challenge 24: Selectors & Normalization](./challenges/24-selectors-and-normalization/CHALLENGE.md) - Data optimization
- [Challenge 25: Async Thunks for API](./challenges/25-async-thunks-for-api/CHALLENGE.md) - Redux async patterns
- [Challenge 26: RTK Query Caching](./challenges/26-rtk-query-caching/CHALLENGE.md) - Advanced caching

### Phase 6: Forms & Testing
- [Challenge 27: Multi-Step Form](./challenges/27-multi-step-form/CHALLENGE.md) - Complex form patterns
- [Challenge 28: Basic Testing](./challenges/28-basic-testing/CHALLENGE.md) - Unit testing
- [Challenge 29: Integration Testing](./challenges/29-integration-testing/CHALLENGE.md) - Integration testing
- [Challenge 30: End-to-End Testing](./challenges/30-e2e-testing/CHALLENGE.md) - E2E testing

## 🏗️ Project Architecture

### Technology Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Testing**: Jest + React Testing Library + Playwright
- **State Management**: React hooks → Context → Redux Toolkit → RTK Query
- **Styling**: CSS modules and global styles
- **API**: Next.js API routes for backend simulation

### Key Concepts Covered
- **Component Patterns**: Presenter/Container, Composition, HOCs
- **State Management**: Local state, Context, Redux patterns
- **Data Flow**: Props, Context, Redux, RTK Query
- **Performance**: Memoization, optimization, caching
- **Testing**: Unit, integration, and E2E testing strategies
- **User Experience**: Loading states, error handling, optimistic updates

## 🧪 Testing Strategy

### Unit Tests
- Each challenge includes comprehensive unit tests
- Tests cover component rendering, user interactions, and edge cases
- Run with: `npm run test`

### Integration Tests
- Test complete workflows and component interactions
- Mock API calls for reliable testing
- Verify data flow and state management

### End-to-End Tests
- Playwright tests for complete user journeys
- Test real browser interactions
- Run with: `npm run test:e2e`

## 🎓 Learning Outcomes

By completing all 30 challenges, you'll have built a **production-ready React application** with:

✅ **Solid Foundation**: Understanding of React fundamentals and patterns  
✅ **State Management**: Mastery of local state, Context, and Redux  
✅ **API Integration**: Experience with data fetching, caching, and error handling  
✅ **Testing Expertise**: Comprehensive testing strategies and best practices  
✅ **Performance Optimization**: Knowledge of React performance patterns  
✅ **Architecture Skills**: Ability to design scalable React applications  

## 🤝 Contributing

This is a learning resource designed to help developers master React patterns. Feel free to:
- Fork the repository for personal learning
- Submit issues for improvements or clarifications
- Share your solutions and learnings with the community

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Ready to start your React journey?** Begin with [Challenge 01](./challenges/01-static-master-detail-layout/CHALLENGE.md) and build your way to a production-ready React application!
