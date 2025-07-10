import {
  Outlet,
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'



import ClerkProvider from '../integrations/clerk/provider.tsx'

import TanStackQueryLayout from '../integrations/tanstack-query/layout.tsx'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

import { ThemeProvider } from '@/utils/themeProvider.tsx'

import SessionHydrator from '@/components/dashboard/user/sessionHydrator.tsx';

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  component: () => (
    <RootDocument>
      <ThemeProvider defaultTheme="dark"
      storageKey="vite-ui-theme">
        {/* This is the root layout for the application. It wraps all routes. */}
      <ClerkProvider>
          <SessionHydrator />
      

        <Outlet />
        

        <TanStackQueryLayout />
      </ClerkProvider>
      </ThemeProvider>
    </RootDocument>
  ),
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
