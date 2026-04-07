import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet.markercluster'

export default function SchoolMap({ schools, center, zoom, hoveredSchoolId, radius, searchLocation, onSelectSchool, onHoverSchool }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef(null)
  const markerMapRef = useRef({})
  const circleRef = useRef(null)

  // Initialize map
  useEffect(() => {
    if (mapInstanceRef.current) return

    const map = L.map(mapRef.current, {
      center: [center.lat, center.lng],
      zoom: zoom,
      zoomControl: true,
      scrollWheelZoom: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map)

    mapInstanceRef.current = map
    markersRef.current = L.markerClusterGroup({
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
    })
    map.addLayer(markersRef.current)

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  // Update map center/zoom
  useEffect(() => {
    if (!mapInstanceRef.current) return
    mapInstanceRef.current.setView([center.lat, center.lng], zoom, { animate: true })
  }, [center.lat, center.lng, zoom])

  // Update radius circle
  useEffect(() => {
    if (!mapInstanceRef.current) return

    if (circleRef.current) {
      mapInstanceRef.current.removeLayer(circleRef.current)
      circleRef.current = null
    }

    if (searchLocation && radius) {
      circleRef.current = L.circle([searchLocation.lat, searchLocation.lng], {
        radius: radius * 1609.34, // miles to meters
        color: '#C05621',
        fillColor: '#C05621',
        fillOpacity: 0.05,
        weight: 1.5,
        dashArray: '5,5',
      }).addTo(mapInstanceRef.current)
    }
  }, [searchLocation, radius])

  // Update markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersRef.current) return

    markersRef.current.clearLayers()
    markerMapRef.current = {}

    schools.forEach(school => {
      const minTuition = Math.min(...Object.values(school.tuitionByGrade))
      const priceLabel = minTuition >= 1000 ? `$${(minTuition / 1000).toFixed(minTuition % 1000 === 0 ? 0 : 1)}k` : `$${minTuition}`

      const icon = L.divIcon({
        className: 'school-marker-icon',
        html: priceLabel,
        iconSize: [50, 24],
        iconAnchor: [25, 12],
      })

      const marker = L.marker([school.lat, school.lng], { icon })

      marker.bindPopup(`
        <div style="min-width: 180px;">
          <strong style="font-size: 14px; font-family: 'DM Serif Display', serif;">${school.name}</strong>
          <div style="margin-top: 4px; font-size: 12px; color: #4A5568;">${school.type.join(' · ')} · ${school.gradesLabel}</div>
          <div style="margin-top: 4px; font-size: 13px; font-weight: 700; color: #1A202C;">${school.tuitionDisplay}</div>
          <div style="margin-top: 4px; display: flex; align-items: center; gap: 4px;">
            <span style="color: #D69E2E;">&#9733;</span>
            <span style="font-size: 12px; font-weight: 600;">${school.rating}</span>
            <span style="font-size: 11px; color: #718096;">(${school.reviewCount})</span>
          </div>
          <div style="margin-top: 8px; text-align: center;">
            <span style="color: #C05621; font-size: 12px; font-weight: 600; cursor: pointer;">View School &rarr;</span>
          </div>
        </div>
      `, { closeButton: true })

      marker.on('click', () => onSelectSchool(school))
      marker.on('mouseover', () => onHoverSchool(school.id))
      marker.on('mouseout', () => onHoverSchool(null))

      markersRef.current.addLayer(marker)
      markerMapRef.current[school.id] = marker
    })
  }, [schools])

  // Highlight hovered marker
  useEffect(() => {
    Object.entries(markerMapRef.current).forEach(([id, marker]) => {
      const el = marker.getElement?.()
      if (el) {
        if (id === hoveredSchoolId) {
          el.querySelector('.school-marker-icon')?.classList.add('highlighted')
        } else {
          el.querySelector('.school-marker-icon')?.classList.remove('highlighted')
        }
      }
    })
  }, [hoveredSchoolId])

  return (
    <div ref={mapRef} className="w-full h-full" />
  )
}
