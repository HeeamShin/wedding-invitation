import { Map } from "./map"
import CarIcon from "../../icons/car-icon.svg?react"
import BusIcon from "../../icons/bus-icon.svg?react"
import SubwayIcon from "../../icons/subway-icon.svg?react"
import { LazyDiv } from "../lazyDiv"
import { LOCATION, LOCATION_ADDRESS } from "../../const"

export const Location = () => {
  return (
    <>
      <LazyDiv className="card location">
        <h2 className="english">Location</h2>
        <div className="addr">
          {LOCATION}
          <div className="detail">{LOCATION_ADDRESS}</div>
        </div>
        <Map />
      </LazyDiv>
      <LazyDiv className="card location">
        <div className="location-info">
          <div className="transportation-icon-wrapper">
            <SubwayIcon className="transportation-icon" />
          </div>
          <div className="heading">지하철</div>
          <div />
          <div className="content">
            지하철 5·9호선 <b>여의도역 1·2번출구</b>
            <br />
            (도보 7분 거리)
          </div>
        </div>
        <div className="location-info">
          <div className="transportation-icon-wrapper">
            <BusIcon className="transportation-icon" />
          </div>
          <div className="heading">버스</div>
          <div />
          <div className="content">
            <b>한국경제인협회</b> 정류장 하차
            <br />
            → 간선: 160, 162, 360, 503, 600, 662,
            <br />
            → 지선: 5012, 5615, 5618, 5713, 6628, 6633, 8671
            <br />
            → 마을: 10, 11-1, 11-2, 83, 88, 530
            <br />
            → 경기: 301, 320, 700
            <br />
            <br />
            <b>여의도메리어트호텔</b> 정류장 하차
            <br />
            → 공항: 6019
          </div>
        </div>
        <div className="location-info">
          <div className="transportation-icon-wrapper">
            <CarIcon className="transportation-icon" />
          </div>
          <div className="heading">자가용</div>
          <div />
          <div className="content">
            네비게이션: <b>"여의도웨딩컨벤션"</b> 또는
            <br />
            <b>"여의도KT"</b> 또는<b>"여의대로14"</b> 입력
            <br />
            → KT빌딩 주차장 이용
            <br />
            → 주차요원의 안내를 받으세요.
          </div>
        </div>
      </LazyDiv>
    </>
  )
}
