import { Fragment, useEffect, useState } from 'react'
import Nav from '../Nav/component'
// import { getCafe } from '../../utils/getCafe'
// const API_KEY = 'AIzaSyD5jd1PhKwr78AVXuvNkIufDcdMa3HfPCg'

import Marker from '../../assets/imgs/marker.png'

export default function KakaoMap (props: any) {
  const [map, setMap] = useState(null as any)
  const [selected, setSelected] = useState(false)

  const getCafeData = async () => {
    const container = document.getElementById('map') as HTMLElement
    const options = { center: new kakao.maps.LatLng(props.coords.latitude, props.coords.longitude), level: 4 }
    const kakaoMap = new kakao.maps.Map(container, options)
    setMap(kakaoMap)    

    // Current my location
    new kakao.maps.Marker({
      map: kakaoMap,
      position: new kakao.maps.LatLng(props.coords.latitude, props.coords.longitude),
      image: new kakao.maps.MarkerImage(Marker, new kakao.maps.Size(30, 40)),
    })
  }

  useEffect(() => {
    getCafeData()
  },[])

    return (
      <Fragment>
        { selected ? 
          <div className='fixed z-30 w-screen h-screen bg-black/25 lg:hidden md:hidden' onClick={() => { setSelected(false) } } />
        : null }

        <Nav />
        <div id="map" className='w-screen h-screen'></div>
      </Fragment>
    )
}