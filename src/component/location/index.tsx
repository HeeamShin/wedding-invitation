import { Map } from "./map"
import CarIcon from "../../icons/car-icon.svg?react"
import BusIcon from "../../icons/bus-icon.svg?react"
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
            <BusIcon className="transportation-icon" />
          </div>
          <div className="heading">대중교통</div>
          <div />
          <div className="content">
            * 지하철 이용시
            <br />
            지하철 5·9호선 <b>여의도역 1번출구</b>
            <br />
            → 1번 출구 계단 또는 엘리베이터를 이용
            <br />
            <br />
            하나증권(하나은행) 건물 사이로 들어오셔서
            <br />주차장 입구로 나오신 후 위를 보시면
            <br />Marriott와 KT 건물이 보입니다.
            <br />웨딩홀을 KT 건물 3층입니다.
          </div>
          <div />
          <div className="content">
            * 버스 이용 시
            <br />
            한국경제인협회 정류장 하차
            <br />
            - 간선(파랑): 461, 641
            <br />
            - 지선(초록): 5413, 5524, 5528
            <br />
            반드시 <b>낙성대입구</b> 하차
            <br />→ 마을버스 <b>관악 02번</b> 이용
            <br />
            이하 위와 동일합니다.
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
            - KT빌딩 주차장 이용
            <br />
            (주차요원의 안내를 받으세요.)
          </div>
          <div />
          <div className="content">
            <b>
              ※ 서울대학교 정, 후문을 통과할 경우 통행료가 발생하므로
              유의바랍니다. 낙성대 방향으로 이용해주세요.
            </b>
          </div>
        </div>
      </LazyDiv>
    </>
  )
}
