import { useEffect, useRef } from 'react'

const PINK = '#e91e8c'

export default function SallesMap({ salles, onSelect, selectedId }) {
  const mapRef    = useRef(null)
  const leafRef   = useRef(null)
  const markersRef = useRef([])

  useEffect(() => {
    if (leafRef.current) return
    if (!salles.length) return

    import('leaflet').then(L => {
      /* Fix icônes par défaut cassées avec Vite */
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      /* Centre du Maroc */
      const map = L.map(mapRef.current, {
        center: [31.7917, -7.0926],
        zoom: 5,
        scrollWheelZoom: false,
        zoomControl: true,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map)

      /* Icône personnalisée rose */
      function makeIcon(active = false) {
        return L.divIcon({
          className: '',
          html: `
            <div style="
              width:${active ? 38 : 30}px;
              height:${active ? 38 : 30}px;
              background:${active ? PINK : '#fff'};
              border:3px solid ${PINK};
              border-radius:50% 50% 50% 0;
              transform:rotate(-45deg);
              box-shadow:0 4px 14px rgba(233,30,140,${active ? 0.5 : 0.25});
              transition:all 0.2s;
            ">
              <div style="
                width:10px;height:10px;
                background:${active ? '#fff' : PINK};
                border-radius:50%;
                position:absolute;
                top:50%;left:50%;
                transform:translate(-50%,-50%);
              "></div>
            </div>`,
          iconSize:   [active ? 38 : 30, active ? 38 : 30],
          iconAnchor: [active ? 19 : 15, active ? 38 : 30],
          popupAnchor:[0, active ? -40 : -32],
        })
      }

      markersRef.current = salles
        .filter(s => s.lat && s.lng)
        .map(s => {
          const marker = L.marker([s.lat, s.lng], { icon: makeIcon(s.id === selectedId) })
            .addTo(map)
            .bindPopup(`
              <div style="font-family:sans-serif;min-width:160px;padding:4px 0">
                <div style="font-weight:800;font-size:1rem;color:#1a0a14;margin-bottom:4px">${s.city}</div>
                <div style="font-size:0.8rem;color:#888;margin-bottom:6px">${s.address || ''}</div>
                <div style="font-size:0.75rem;color:#e91e8c;font-weight:600">${s.hours || ''}</div>
              </div>`, { maxWidth: 220 })

          marker.on('click', () => onSelect && onSelect(s))
          marker._salleId = s.id
          return marker
        })

      leafRef.current = { map, L, makeIcon }
    })

    return () => {
      if (leafRef.current) {
        leafRef.current.map.remove()
        leafRef.current = null
      }
    }
  }, [salles])

  /* Mettre à jour les icônes quand la sélection change */
  useEffect(() => {
    if (!leafRef.current) return
    const { map, L, makeIcon } = leafRef.current
    markersRef.current.forEach(m => {
      const active = m._salleId === selectedId
      m.setIcon(makeIcon(active))
      if (active) {
        const salle = salles.find(s => s.id === selectedId)
        if (salle?.lat && salle?.lng) {
          map.flyTo([salle.lat, salle.lng], 13, { duration: 0.8 })
          m.openPopup()
        }
      }
    })
  }, [selectedId])

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <div
        ref={mapRef}
        style={{ width: '100%', height: '100%', borderRadius: '18px', minHeight: '420px' }}
      />
    </>
  )
}
