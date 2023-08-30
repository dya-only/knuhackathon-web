import { ChangeEvent, Fragment, useEffect, useState } from 'react'
import Nav from '../Nav/component'
import axios from 'axios'
// const API_KEY = 'AIzaSyD5jd1PhKwr78AVXuvNkIufDcdMa3HfPCg'

import Smile from '../../assets/imgs/smile.png'
import New from '../../assets/imgs/new.png'
import Marker from '../../assets/imgs/marker.png'
import Verified from '../../assets/imgs/verifed.png'
import Xmark from '../../assets/svgs/xmark.svg'
import Step from '../../assets/imgs/step.png'
import Elevator from '../../assets/imgs/elevator.png'
import Park from '../../assets/imgs/park.png'
import Toilet from '../../assets/imgs/toilet.png'
import Block from '../../assets/imgs/block.png'
import Notice from '../../assets/imgs/notice.png'
import Send from '../../assets/imgs/send.png'

export default function KakaoMap (props: any) {
  const [map, setMap] = useState(null as any)
  const [selected, setSelected] = useState(false)
  const [created, setCreated] = useState(false)
  const [selectedMarker, setSelectedMarker] = useState<any>({})
  const [selectedData, setSelectedData] = useState<any>({})
  const [newPlace, setNewPlace] = useState({ placeName: '', latitude: 0, longitude: 0 })
  const [review, setReview] = useState<string[]>([])

  const [inputData, setInputData] = useState('')
  const [step, setStep] = useState(false)
  const [elevator, setElevator] = useState(false)
  const [parking, setParking] = useState(false)
  const [toilet, setToilet] = useState(false)
  const [block, setBlock] = useState(false)
  const [notice, setNotice] = useState(false)

  const getMap = async () => {
    const container = document.getElementById('map') as HTMLElement
    const options = { center: new kakao.maps.LatLng(props.coords.latitude, props.coords.longitude), level: 4, disableDoubleClickZoom: true }
    const kakaoMap = new kakao.maps.Map(container, options)
    setMap(kakaoMap)

    let Normal: any[] = []
    await axios.get(`/place/${props.coords.latitude}/${props.coords.longitude}?km=${10}`, {
      headers: { 'Content-Type': 'application/json' }
    }).then(resp => Normal = resp.data.places)

    Normal.forEach((el: { id: '', placeName: '', latitude: 0, longitude: 0, isBFVerified: boolean}) => {
      const marker = new kakao.maps.Marker({
        map: kakaoMap,
        position: new kakao.maps.LatLng(el.latitude, el.longitude),
        image: new kakao.maps.MarkerImage(Marker, new kakao.maps.Size(32, 45)),
      })

      kakao.maps.event.addListener(marker, 'click', async () => {
        await getPlace(el.id)
        setSelected(true)
        setSelectedMarker(el)
      })

      kakao.maps.event.addListener(kakaoMap, 'click', () => {
        setSelected(false)
        setSelectedMarker({})
      })
    })

    let BF: any[] = []
    await axios.get('/place/bf', {
      headers: { 'Content-Type': 'application/json' }
    }).then(resp => BF = resp.data.places)

    BF.forEach((el: { id: '', placeName: '', latitude: 0, longitude: 0, isBFVerified: true}) => {
      const marker = new kakao.maps.Marker({
        map: kakaoMap,
        position: new kakao.maps.LatLng(el.latitude, el.longitude),
        image: new kakao.maps.MarkerImage(Verified, new kakao.maps.Size(32, 45)),
      })

      kakao.maps.event.addListener(marker, 'click', async () => {
        await getPlace(el.id)
        setSelected(true)
        setSelectedMarker(el)
      })

      kakao.maps.event.addListener(kakaoMap, 'click', () => {
        setSelected(false)
        setSelectedMarker({})
      })
    })

    console.log(map)
    
    // Current my location
    new kakao.maps.Marker({
      map: kakaoMap,
      position: new kakao.maps.LatLng(props.coords.latitude, props.coords.longitude),
      image: new kakao.maps.MarkerImage(Smile, new kakao.maps.Size(40, 53)),
    })
    
    kakao.maps.event.addListener(kakaoMap, 'dblclick', function(event: { latLng: { La: number, Ma: number } }) {
      const latlng = event.latLng

      new kakao.maps.Marker({
        map: kakaoMap,
        position: new kakao.maps.LatLng(latlng.Ma, latlng.La),
        image: new kakao.maps.MarkerImage(New, new kakao.maps.Size(40, 53)),
      })

      setNewPlace({ placeName: '', latitude: latlng.Ma, longitude: latlng.La })
      setCreated(true)
    })
  }

  const getPlace = async (id: string) => {
    await axios.get(`/place/${id}/review`)
    .then(resp => {
      setSelectedData(resp.data)
      console.log(resp.data)

      setReview(resp.data.reviews)
    })
  }

  const uploadReview = async (id: string) => {
    await axios.post(`/place/${id}/review`, { ramp: step, elevator, handiParking: parking, handiToilet: toilet, brailleBlock: block, brailleMap: notice, comment: inputData })
    .then(_resp => console.log(_resp)).catch(console.error)

    setStep(false)
    setElevator(false)
    setParking(false)
    setToilet(false)
    setBlock(false)
    setNotice(false)

    window.location.href='/'
  }

  const uploadPlace = async () => {
    if (newPlace.placeName !== '') {
      await axios.post('/place', newPlace)
      .then(async (resp) => {
        console.log(resp.data);
        await axios.post(`/place/${resp.data.id}/review`, { ramp: step, elevator, handiParking: parking, handiToilet: toilet, brailleBlock: block, brailleMap: notice, comment: '' })
        .then(_resp => console.log(_resp)).catch(console.error)
      }).catch(console.error)
    }
    setStep(false)
    setElevator(false)
    setParking(false)
    setToilet(false)
    setBlock(false)
    setNotice(false)

    window.location.href='/'
  }

  useEffect(() => {
    getMap()
  },[])

  return (
    <Fragment>
      { selected || created ? 
        <div className={`animatedBG fixed z-50 w-screen h-screen lg:hidden md:hidden`} onClick={() => { setSelected(false) } } />
      : null }

      { selected ? 
        <div className={`animated overflow-y-auto rounded-t-[20px] fixed z-50 flex flex-col justify-start items-center shadow-2xl bg-white/70 backdrop-blur-xl md:w-[400px] lg:w-[400px] w-screen lg:h-screen md:h-screen h-[50%] mt-[80%] lg:mt-0 md:mt-0 p-4`}>
          <div className={'w-full flex justify-end mb-8'}><img className={'w-5 h-5'} src={ Xmark } onClick={() => { setSelected(false) } } /></div>

          <p className={'text-2xl font-bold flex-wrap[600] mb-8'}>{ selectedMarker.placeName }</p>

          {/* Information */}
          <div className={'flex justify-center items-end mb-12'}>
            <div className={`flex flex-col items-center ml-2 mr-2 opacity-${30 + (70 * selectedData.ramp)}`}>
              <img className={'w-8'} src={Step} />
              <p className={'text-md text-blue-500'}>{ selectedData.ramp > 0 ? selectedData.ramp : 0 }</p>
            </div>

            <div className={`flex flex-col items-center ml-2 mr-2 opacity-${30 + (70 * selectedData.elevator)}`}>
              <img className={'w-6'} src={Elevator} />
              <p className={'text-md text-blue-500'}>{ selectedData.elevator > 0 ? selectedData.elevator : 0 }</p>
            </div>

            <div className={`flex flex-col items-center ml-2 mr-2 opacity-${30 + (70 * selectedData.handiParking)}`}>
              <img className={'w-6'} src={Park} />
              <p className={'text-md text-blue-500'}>{ selectedData.handiParking > 0 ? selectedData.handiParking : 0 }</p>
            </div>

            <div className={`flex flex-col items-center ml-2 mr-2 opacity-${30 + (70 * selectedData.handiToilet)}`}>
              <img className={'w-6'} src={Toilet} />
              <p className={'text-md text-blue-500'}>{ selectedData.handiToilet > 0 ? selectedData.handiToilet : 0 }</p>
            </div>

            <div className={`flex flex-col items-center ml-2 mr-2 opacity-${30 + (70 * selectedData.brailleBlock)}`}>
              <img className={'w-6'} src={Block} />
              <p className={'text-md text-blue-500'}>{ selectedData.brailleBlock > 0 ? selectedData.brailleBlock : 0 }</p>
            </div>

            <div className={`flex flex-col items-center ml-2 mr-2 opacity-${30 + (70 * selectedData.brailleMap)}`}>
              <img className={'w-6'} src={Notice} />
              <p className={'text-md text-blue-500'}>{ selectedData.brailleMap > 0 ? selectedData.brailleMap : 0 }</p>
            </div>
          </div>

          {/* Voting */}
          <div className={'w-full flex flex-wrap items-center justify-center'}>
            <div className='flex flex-col items-center'>
              <p className={'text-blue-500 text-[12px] mb-1'}>경사로</p>
              <button className={step ? `drop-shadow-xl w-16 h-16 mr-3 ml-3 mb-4 rounded-xl bg-white p-4 flex flex-col justify-center items-center` : `drop-shadow-xl w-16 h-16 mr-3 ml-3 mb-4 rounded-xl bg-white p-4 flex flex-col justify-center items-center opacity-50`} onClick={() => { step ? setStep(false) : setStep(true) }}>
                <img src={Step} />
              </button>
            </div>
            
            <div className='flex flex-col items-center'>
              <p className={'text-blue-500 text-[12px] mb-1'}>엘리베이터</p>
              <button className={elevator ? `drop-shadow-xl w-16 h-16 mr-3 ml-3 mb-4 rounded-xl bg-white p-4 flex flex-col justify-center items-center` : `drop-shadow-xl w-16 h-16 mr-3 ml-3 mb-4 rounded-xl bg-white p-4 flex flex-col justify-center items-center opacity-50`} onClick={() => { elevator ? setElevator(false) : setElevator(true) }}>
                <img className={'w-6'} src={Elevator} />
              </button>
            </div>
            <div className='flex flex-col items-center'>
              <p className={'text-blue-500 text-[12px] mb-1'}>전용 주차장</p>
              <button className={parking ? `drop-shadow-xl w-16 h-16 mr-3 ml-3 mb-4 rounded-xl bg-white flex flex-col justify-center items-center`: `drop-shadow-xl w-16 h-16 mr-3 ml-3 mb-4 rounded-xl bg-white flex flex-col justify-center items-center opacity-50`} onClick={() => { parking ? setParking(false) : setParking(true) }}><img className={'w-6'} src={Park} /></button>
            </div>
          </div>
          <div className={'w-full flex flex-wrap items-center justify-center mb-12'}>
            <div className='flex flex-col items-center'>
              <p className={'text-blue-500 text-[12px] mb-1'}>전용 화장실</p>
              <button className={toilet ? `drop-shadow-xl w-16 h-16 mr-3 ml-3 rounded-xl bg-white flex flex-col justify-center items-center` : `drop-shadow-xl w-16 h-16 mr-3 ml-3 rounded-xl bg-white flex flex-col justify-center items-center opacity-50`} onClick={() => { toilet ? setToilet(false) : setToilet(true) }}><img className={'w-6'} src={Toilet} /></button>
            </div>
            <div className='flex flex-col items-center'>
              <p className={'text-blue-500 text-[12px] mb-1'}>점자 블록</p>
              <button className={block ? `drop-shadow-xl w-16 h-16 mr-3 ml-3 rounded-xl bg-white flex flex-col justify-center items-center` : `drop-shadow-xl w-16 h-16 mr-3 ml-3 rounded-xl bg-white flex flex-col justify-center items-center opacity-50`} onClick={() => { block ? setBlock(false) : setBlock(true) }}><img className={'w-6'} src={Block} /></button>
            </div>
            <div className='flex flex-col items-center'>
              <p className={'text-blue-500 text-[12px] mb-1'}>점자 안내도</p>
              <button className={notice ? `drop-shadow-xl w-16 h-16 mr-3 ml-3 rounded-xl bg-white flex flex-col justify-center items-center` : `drop-shadow-xl w-16 h-16 mr-3 ml-3 rounded-xl bg-white flex flex-col justify-center items-center opacity-50`} onClick={() => { notice ? setNotice(false) : setNotice(true) }}><img className={'w-6'} src={Notice} /></button>
            </div>
          </div>

          <p className={'w-[270px] text-blue-400'}>Review</p>
          <div className={'flex items-center justify-center mb-12'}>
            <input type="text" className={'w-68 h-12 mr-2 rounded-full drop-shadow-xl p-4 outline-none'} placeholder='정확한 정보를 작성해주세요.' value={inputData} onChange={(e: ChangeEvent<HTMLInputElement>) => setInputData(e.target.value)} />
            <button className={'w-10 h-10 rounded-full drop-shadow-xl bg-blue-500 flex items-center justify-center cursor-pointer'} onClick={() => uploadReview(selectedMarker.id)}>
              <img className={'w-4 h-4'} src={Send} />
            </button>
          </div>

          <div className={'flex flex-col items-start mb-24'}>
            { review.map((el: string, idx: number) => {
              return <p className={'w-72 h-auto break-words rounded-2xl p-4 border-[1px] bg-white drop-shadow-xl text-black mb-4'} key={idx}>{ el }</p>
            }) }
          </div>
        </div>
      : <div className={`unanimated overflow-y-auto rounded-t-[20px] fixed z-50 flex flex-col justify-start items-center shadow-2xl bg-white/70 backdrop-blur-xl md:w-[400px] lg:w-[400px] w-screen lg:h-screen md:h-screen h-[50%] mt-[120%] lg:mt-0 md:mt-0 p-4`}></div>}

      { created ?
        <div className={`animated overflow-y-auto rounded-t-[20px] fixed z-50 flex flex-col justify-start items-center shadow-2xl bg-white/70 backdrop-blur-xl md:w-[400px] lg:w-[400px] w-screen lg:h-screen md:h-screen h-[50%] mt-[120%] lg:mt-0 md:mt-0 p-4`}>
          <div className={'w-full flex justify-end mb-8'}><img className={'w-5 h-5'} src={ Xmark } onClick={() => { setCreated(false); window.location.href='/' } } /></div>

          <input type="text" className='w-60 text-2xl mb-12 outline-none border-b-2 border-b-blue-500 bg-transparent' placeholder='건물명을 입력해주세요.' value={newPlace.placeName} onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPlace({ ...newPlace, placeName: e.target.value })} />

          <div className={'w-full flex flex-wrap items-center justify-center'}>
            <div className='flex flex-col items-center'>
              <p className={'text-blue-500 text-[12px] mb-1'}>경사로</p>
              <button className={step ? `drop-shadow-xl w-16 h-16 mr-3 ml-3 mb-4 rounded-xl bg-white p-4 flex flex-col justify-center items-center` : `drop-shadow-xl w-16 h-16 mr-3 ml-3 mb-4 rounded-xl bg-white p-4 flex flex-col justify-center items-center opacity-50`} onClick={() => { step ? setStep(false) : setStep(true) }}>
                <img src={Step} />
              </button>
            </div>
            
            <div className='flex flex-col items-center'>
              <p className={'text-blue-500 text-[12px] mb-1'}>엘리베이터</p>
              <button className={elevator ? `drop-shadow-xl w-16 h-16 mr-3 ml-3 mb-4 rounded-xl bg-white p-4 flex flex-col justify-center items-center` : `drop-shadow-xl w-16 h-16 mr-3 ml-3 mb-4 rounded-xl bg-white p-4 flex flex-col justify-center items-center opacity-50`} onClick={() => { elevator ? setElevator(false) : setElevator(true) }}>
                <img className={'w-6'} src={Elevator} />
              </button>
            </div>
            <div className='flex flex-col items-center'>
              <p className={'text-blue-500 text-[12px] mb-1'}>전용 주차장</p>
              <button className={parking ? `drop-shadow-xl w-16 h-16 mr-3 ml-3 mb-4 rounded-xl bg-white flex flex-col justify-center items-center`: `drop-shadow-xl w-16 h-16 mr-3 ml-3 mb-4 rounded-xl bg-white flex flex-col justify-center items-center opacity-50`} onClick={() => { parking ? setParking(false) : setParking(true) }}><img className={'w-6'} src={Park} /></button>
            </div>
          </div>
          <div className={'w-full flex flex-wrap items-center justify-center mb-12'}>
            <div className='flex flex-col items-center'>
              <p className={'text-blue-500 text-[12px] mb-1'}>전용 화장실</p>
              <button className={toilet ? `drop-shadow-xl w-16 h-16 mr-3 ml-3 rounded-xl bg-white flex flex-col justify-center items-center` : `drop-shadow-xl w-16 h-16 mr-3 ml-3 rounded-xl bg-white flex flex-col justify-center items-center opacity-50`} onClick={() => { toilet ? setToilet(false) : setToilet(true) }}><img className={'w-6'} src={Toilet} /></button>
            </div>
            <div className='flex flex-col items-center'>
              <p className={'text-blue-500 text-[12px] mb-1'}>점자 블록</p>
              <button className={block ? `drop-shadow-xl w-16 h-16 mr-3 ml-3 rounded-xl bg-white flex flex-col justify-center items-center` : `drop-shadow-xl w-16 h-16 mr-3 ml-3 rounded-xl bg-white flex flex-col justify-center items-center opacity-50`} onClick={() => { block ? setBlock(false) : setBlock(true) }}><img className={'w-6'} src={Block} /></button>
            </div>
            <div className='flex flex-col items-center'>
              <p className={'text-blue-500 text-[12px] mb-1'}>점자 안내도</p>
              <button className={notice ? `drop-shadow-xl w-16 h-16 mr-3 ml-3 rounded-xl bg-white flex flex-col justify-center items-center` : `drop-shadow-xl w-16 h-16 mr-3 ml-3 rounded-xl bg-white flex flex-col justify-center items-center opacity-50`} onClick={() => { notice ? setNotice(false) : setNotice(true) }}><img className={'w-6'} src={Notice} /></button>
            </div>
          </div>

          <button className={'w-72 h-full rounded-xl bg-blue-400 text-white font-bold pt-2 pb-2 flex justify-center items-center mb-16'} onClick={uploadPlace}>등록하기</button>
        </div>
      : <div className={`unanimated rounded-t-[20px] overflow-y-auto fixed z-50 flex justify-center items-start shadow-2xl bg-white md:w-[400px] lg:w-[400px] w-screen lg:h-screen md:h-screen h-[50%] mt-[120%] lg:mt-0 md:mt-0`}></div> }

      <Nav />
      <div id="map" className='w-screen h-screen'></div>
    </Fragment>
  )
}