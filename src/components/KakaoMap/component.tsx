import { Fragment, useEffect, useState } from 'react'
import Nav from '../Nav/component'
// import { getCafe } from '../../utils/getCafe'
// const API_KEY = 'AIzaSyD5jd1PhKwr78AVXuvNkIufDcdMa3HfPCg'

import Smile from '../../assets/imgs/smile.png'
import New from '../../assets/imgs/new.png'
import Xmark from '../../assets/svgs/xmark.svg'
import Step from '../../assets/imgs/step.png'
import Elevator from '../../assets/imgs/elevator.png'

export default function KakaoMap (props: any) {
  const [map, setMap] = useState(null as any)
  const [selected, setSelected] = useState(false)
  const [created, setCreated] = useState(false)
  const [markerInfo, setMarkerInfo] = useState('')
  const [newM, setNewM] = useState({ latitude: 0, longitude: 0 })

  const getCafeData = async () => {
    const container = document.getElementById('map') as HTMLElement
    const options = { center: new kakao.maps.LatLng(props.coords.latitude, props.coords.longitude), level: 4, disableDoubleClickZoom: true }
    const kakaoMap = new kakao.maps.Map(container, options)
    setMap(kakaoMap)

    console.log(newM)
    console.log(map)
    
    // Current my location
    const me = new kakao.maps.Marker({
      map: kakaoMap,
      position: new kakao.maps.LatLng(props.coords.latitude, props.coords.longitude),
      image: new kakao.maps.MarkerImage(Smile, new kakao.maps.Size(40, 53)),
    })

    kakao.maps.event.addListener(me, 'click', () => {
      setSelected(true)
      setMarkerInfo('Me!')
    })

    // kakao.maps.event.addListener(kakaoMap, 'click', () => {
    //   setSelected(false)
    // })
    
    kakao.maps.event.addListener(kakaoMap, 'dblclick', function(event: { latLng: { La: number, Ma: number } }) {
      const latlng = event.latLng

      new kakao.maps.Marker({
        map: kakaoMap,
        position: new kakao.maps.LatLng(latlng.Ma, latlng.La),
        image: new kakao.maps.MarkerImage(New, new kakao.maps.Size(40, 53)),
      })

      setNewM({ latitude: latlng.Ma, longitude: latlng.La })
      setCreated(true)
    })
  }

  useEffect(() => {
    getCafeData()
  },[])

  return (
    <Fragment>
      { selected || created ? 
        <div className={`animatedBG fixed z-50 w-screen h-screen lg:hidden md:hidden`} onClick={() => { setSelected(false) } } />
      : null }

      { selected ? 
        <div className={`animated rounded-t-[20px] overflow-y-auto fixed z-50 flex justify-center items-start shadow-2xl bg-white md:w-[400px] lg:w-[400px] w-screen lg:h-screen md:h-screen h-[50%] mt-[120%] lg:mt-0 md:mt-0`}>
          <p>{ markerInfo }</p>
        </div>
      : <div className={`unanimated rounded-t-[20px] overflow-y-auto fixed z-50 flex justify-center items-start shadow-2xl bg-white md:w-[400px] lg:w-[400px] w-screen lg:h-screen md:h-screen h-[50%] mt-[120%] lg:mt-0 md:mt-0`}> 
        </div> }

      { created ?
        <div className={`animated overflow-y-auto rounded-t-[20px] fixed z-50 flex flex-col justify-start items-center shadow-2xl bg-white/70 backdrop-blur-xl md:w-[400px] lg:w-[400px] w-screen lg:h-screen md:h-screen h-[50%] mt-[120%] lg:mt-0 md:mt-0 p-4`}>
          <div className={'w-full flex justify-end mb-8'}><img className={'w-5 h-5'} src={ Xmark } onClick={() => { setCreated(false); window.location.href='/' } } /></div>

          <p className={'text-2xl font- flex-wrap[600] mb-8'}>애니플러스 합정점</p>

          <div className={'w-full flex flex-wrap items-center justify-center'}>
            <button className={`drop-shadow-xl w-16 h-16 mr-3 ml-3 mb-4 rounded-xl bg-white p-4 flex justify-center items-center`}><img src={Step} /></button>
            <button className={`drop-shadow-xl w-16 h-16 mr-3 ml-3 mb-4 rounded-xl bg-white p-4 flex justify-center items-center`}><img className={'w-6'} src={Elevator} /></button>
            <button className={`drop-shadow-xl w-16 h-16 mr-3 ml-3 mb-4 rounded-xl bg-white`}></button>
            <button className={`drop-shadow-xl w-16 h-16 mr-3 ml-3 rounded-xl bg-white`}></button>
            <button className={`drop-shadow-xl w-16 h-16 mr-3 ml-3 rounded-xl bg-white`}></button>
            <button className={`drop-shadow-xl w-16 h-16 mr-3 ml-3 rounded-xl bg-white`}></button>
          </div>
        </div>
      : <div className={`unanimated rounded-t-[20px] overflow-y-auto fixed z-50 flex justify-center items-start shadow-2xl bg-white md:w-[400px] lg:w-[400px] w-screen lg:h-screen md:h-screen h-[50%] mt-[120%] lg:mt-0 md:mt-0`}>
          <p>Create new one!</p>
        </div> }

      <Nav />
      <div id="map" className='w-screen h-screen'></div>
    </Fragment>
  )
}