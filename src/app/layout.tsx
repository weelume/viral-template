import type { ReactNode } from 'react'
import './globals.css'

export const metadata = {
  title: 'Viral · Social Growth',
  description: 'Viral social growth marketing site',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="zh-CN"><body>{children}</body></html>
}
