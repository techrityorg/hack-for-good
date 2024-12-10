// src/app/layout.tsx
import type { Metadata } from 'next'
import { Lexend } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import { ClerkProvider, auth } from "@clerk/nextjs"
import { dark, neobrutalism } from '@clerk/themes';
import { Toaster } from "@/components/ui/sonner"
import { ConvexClientProvider } from '@/providers/convex-client-provider';
import NavHeader from '@/components/NavHeader';
import ChatArea from '@/components/ChatArea';

const lexend = Lexend({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AssessMe.AI',
  description: 'Enhance Interview Skills Using AI.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const {userId} = auth();
  return (
      <html lang="en" suppressHydrationWarning={true}>
        <body className={cn(lexend.className, 'antialiased min-h-screen border-none outline-none', 'scrollbar scrollbar-thumb scrollbar-thumb-white scrollbar-track-slate-700 bg-gradient-to-tl from-violet-400 to-violet-300 dark:bg-gradient-to-br dark:from-gray-900 dark:via-purple-900 dark:to-violet-600')} suppressHydrationWarning={true}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <ConvexClientProvider>
              <NavHeader userId={userId}/>
              {children}
              <ChatArea />
            </ConvexClientProvider>
            <Toaster/>
          </ThemeProvider>
        </body>
      </html>
  )
}
