// Challenge 21 — Unit Testing
//
// TODO: Complete this renderWithProviders helper.
//
// Components in TaskFlow require several context providers to render
// without errors:
//
//   - QueryClientProvider (@tanstack/react-query)
//       provides the query cache used by useProjects, useProject, etc.
//
//   - Provider (@reduxjs/toolkit / react-redux)
//       provides the Redux store used by useAppSelector / useAppDispatch
//
//   - ThemeProvider (src/context/ThemeContext)
//       provides the theme context consumed by useTheme()
//
//   - AuthProvider (src/context/AuthContext)
//       provides the logged-in user context consumed by useAuth()
//
//   - MemoryRouter (react-router-dom)
//       provides routing context consumed by useParams, Link, etc.
//       In tests use MemoryRouter (not BrowserRouter) so you can set
//       the initial URL without touching window.location.
//
// Steps:
//   1. Import render from @testing-library/react
//   2. Import QueryClient and QueryClientProvider from @tanstack/react-query
//   3. Import Provider from react-redux
//   4. Import MemoryRouter from react-router-dom
//   5. Import ThemeProvider from ../context/ThemeContext
//   6. Import AuthProvider from ../context/AuthContext
//   7. Import store from ../store/redux/store
//   8. Create a createTestQueryClient() factory (retry: false, gcTime: 0)
//   9. Export renderWithProviders(ui, options?) that nests all providers
//      and passes options?.route to MemoryRouter's initialEntries

import type { ReactElement } from 'react'

// STUB — replace with the real implementation
export function renderWithProviders(
  _ui: ReactElement,
  _options?: { route?: string },
) {
  throw new Error('renderWithProviders is not implemented yet — see TODO above')
}
