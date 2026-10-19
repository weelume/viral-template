import { notFound } from 'next/navigation'
import { resolveSurfaceLocale, surfaceLocalePath } from '@/features/site-templates/locale-routing'
import { viralTemplate } from '@/features/site-templates/catalog/viral/meta'

type RouteProps = { params: Promise<{ slug?: string[] }> }

export default async function ViralSiteRoute({ params }: RouteProps) {
  const { slug = [] } = await params
  const surface = viralTemplate.surfaces[0]
  const { locale, pageSlug } = resolveSurfaceLocale(surface, slug.join('/'))
  const page = surface.pages.find((candidate) => candidate.slug === pageSlug)
  if (!page) notFound()
  const Page = (await page.load()).default
  const basePath = surfaceLocalePath('/templates/viral/site', locale)
  return <div data-template="viral"><Page basePath={basePath} locale={locale} /></div>
}
