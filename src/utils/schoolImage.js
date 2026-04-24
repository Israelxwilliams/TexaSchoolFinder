// Stock photo pool — stable Unsplash IDs, chosen to match school context
const PHOTOS = {
  montessori:  'https://images.unsplash.com/photo-1584697964157-f42769b8da18?w=800&q=80',
  religious:   'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80',
  preschool:   'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&q=80',
  stem:        'https://images.unsplash.com/photo-1561089489-f13d5e730d72?w=800&q=80',
  arts:        'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80',
  highschool:  'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80',
  elementary:  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
  pool: [
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
    'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80',
  ],
}

const RELIGIOUS_WORDS = /christian|catholic|jewish|lutheran|episcopal|baptist|saint|st\.|holy|trinity|grace|covenant|cornerstone|heritage|faith|calvary|sacred|blessed|immaculate/i

export function getStockPhoto(school) {
  // Use school's own scraped photo if available
  if (school.photos?.length > 0) return school.photos[0]

  // Fall back to the school's logo (favicon via Google's API)
  const logoUrl = getLogoUrl(school)
  if (logoUrl) return logoUrl

  // Last resort: generic school stock photo
  const name = school.name || ''
  const idx = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % PHOTOS.pool.length
  return PHOTOS.pool[idx]
}

export function getLogoDomain(school) {
  if (!school.website) return null
  try {
    const url = school.website.startsWith('http') ? school.website : `https://${school.website}`
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

// Google favicon API — no key needed, works cross-origin
export function getLogoUrl(school) {
  const domain = getLogoDomain(school)
  if (!domain) return null
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
}
