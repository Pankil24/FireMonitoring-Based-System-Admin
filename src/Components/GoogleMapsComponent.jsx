import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const GoogleMapsComponent = () => {
  const [isError, setIsError] = useState(false)
  const [location, setLocation] = useState({ lat: null, lng: null })
  const pathLocation = useLocation()

  const cleanedInput = pathLocation?.hash.replace('#', '') // Remove hash
  const params = new URLSearchParams(cleanedInput)

  const latitude = params.get('lat')
  const longitude = params.get('lag')

  console.log('Latitude:', parseFloat(latitude))
  console.log('Longitude:', parseFloat(longitude))

  // Function to get user's current location
  //   useEffect(() => {
  //     if ('geolocation' in navigator) {
  //       navigator.geolocation.getCurrentPosition(
  //         (position) => {
  //           setLocation({
  //             lat: position.coords.latitude,
  //             lng: position.coords.longitude
  //           })
  //         },
  //         (error) => {
  //           console.error('Error getting location:', error)
  //           setIsError(true)
  //         }
  //       )
  //     } else {
  //       setIsError(true)
  //     }
  //   }, [])
  console.log('lv ==>', location)

  // Construct Google Maps URL dynamically with pin
  const mapSrc =
    latitude && longitude
      ? `https://www.google.com/maps?q=${parseFloat(latitude)},${parseFloat(
          longitude
        )}&z=15&output=embed`
      : null

  return (
    <div className='max-w-4xl mx-auto p-4 rounded-lg shadow-lg bg-gray-800 text-white'>
      <h2 className='text-lg font-semibold mb-2 text-center'>
        Your Current Location
      </h2>
      <div className='relative rounded-lg overflow-hidden bg-gray-900'>
        {isError ? (
          <div className='flex items-center justify-center h-[450px] bg-gray-700 text-gray-300'>
            <p>Failed to fetch location. Please enable GPS.</p>
          </div>
        ) : mapSrc ? (
          <iframe
            id='google-map-iframe'
            src={mapSrc}
            width='600'
            height='450'
            className='w-full h-[450px] border-0'
            allowFullScreen={true}
            loading='lazy'
            referrerPolicy='no-referrer-when-downgrade'
            title='Google Maps Location'
            aria-label='Interactive map showing user location'
          />
        ) : (
          <div className='flex items-center justify-center h-[450px] bg-gray-700 text-gray-300'>
            <p>Fetching your location...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default GoogleMapsComponent
