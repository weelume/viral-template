'use client'

import type { SiteTemplatePageProps } from '../../../types'
import { Button, Shell } from '../components/Shell'
import { useCopy } from '../components/Locale'
import { useViralBrand } from '../host'

export default function NotFoundPage({ basePath, locale }: SiteTemplatePageProps) {
  const { t } = useCopy(locale)
  const brand = useViralBrand(locale)
  return <Shell basePath={basePath} locale={locale}><div className="vl-main-container vl-subpage" style={{ textAlign: 'center' }}><p className="vl-kicker">404</p><h1>{t('这个页面不存在', 'Whoops, that page does not exist')}</h1><p className="vl-subpage-intro" style={{ marginInline: 'auto' }}>{t(`回到首页，继续探索 ${brand.name}。`, `Go back home and keep exploring ${brand.name}.`)}</p><div style={{ marginTop: 35 }}><Button href={basePath}>{t('回到首页', 'Go home')}</Button></div></div></Shell>
}
