import { Fragment, useEffect, useState } from 'react'
import Nav from '../Nav/component'
// import { getCafe } from '../../utils/getCafe'
// const API_KEY = 'AIzaSyD5jd1PhKwr78AVXuvNkIufDcdMa3HfPCg'

import Marker from '../../assets/imgs/marker.png'

export default function KakaoMap (props: any) {
  const [map, setMap] = useState(null as any)
  const [selected, setSelected] = useState(false)
  const [markerInfo, setMarkerInfo] = useState('')

  const getCafeData = async () => {
    const container = document.getElementById('map') as HTMLElement
    const options = { center: new kakao.maps.LatLng(props.coords.latitude, props.coords.longitude), level: 4 }
    const kakaoMap = new kakao.maps.Map(container, options)
    setMap(kakaoMap)
    console.log(map)

    // Current my location
    const me = new kakao.maps.Marker({
      map: kakaoMap,
      position: new kakao.maps.LatLng(props.coords.latitude, props.coords.longitude),
      image: new kakao.maps.MarkerImage(Marker, new kakao.maps.Size(30, 40)),
    })

    kakao.maps.event.addListener(me, 'click', () => {
      setSelected(true)
      setMarkerInfo('Me!')
    })

    kakao.maps.event.addListener(kakaoMap, 'click', () => {
      setSelected(false)
    })

    kakao.maps.event.addListener(kakaoMap, 'dblclick', function(event: { latLng: { latitude: number, longitude: number } }) {
      const latlng = event.latLng
      console.log(latlng)
    })
  }

  useEffect(() => {
    getCafeData()
  },[])

    return (
      <Fragment>
        { selected ? 
          <div className={`${selected ? 'animatedBG' : ''} fixed z-50 w-screen h-screen lg:hidden md:hidden`} onClick={() => { setSelected(false) } } />
        : null }
        { selected ? 
          <div className={`${selected ? 'animated' : 'unanimated'} rounded-t-[20px] overflow-y-auto fixed z-50 flex justify-center items-start shadow-2xl bg-white md:w-[400px] lg:w-[400px] w-screen lg:h-screen md:h-screen h-[50%] mt-[120%] lg:mt-0 md:mt-0`}>
            <p>{ markerInfo }</p>
          </div>
        : null }

        <Nav />
        <div id="map" className='w-screen h-screen'></div>
      </Fragment>
    )
}