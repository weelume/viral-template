'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { TemplateLocale } from '../../types'
import { viralBrand } from './config/brand'

interface ViralHostOptions {
  brandName?: Record<TemplateLocale, string>
  logo?: string
  contactEmail?: string
  marketplaceHref?: string
  marketplaceLabel?: Record<TemplateLocale, string>
  marketplaceAriaLabel?: Record<TemplateLocale, string>
  filing?: ReactNode
}

const HostContext = createContext<ViralHostOptions>({})

/** 页面只消费通用配置，不依赖任何特定集成方的模块或路径。 */
export function ViralHostProvider({ children, ...options }: ViralHostOptions & { children: ReactNode }) {
  return <HostContext.Provider value={options}>{children}</HostContext.Provider>
}

export function useViralHost() {
  return useContext(HostContext)
}

export function useViralBrand(locale: TemplateLocale = 'zh') {
  const host = useViralHost()
  return {
    name: host.brandName?.[locale] ?? viralBrand.name[locale],
    logo: host.logo ?? viralBrand.logo,
    email: host.contactEmail ?? viralBrand.email,
    copyrightYear: viralBrand.copyrightYear,
  }
}
