import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import "dayjs/locale/ko"

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale("ko")

export { dayjs }

export const WEDDING_DATE = dayjs.tz("2026-07-05 13:10", "Asia/Seoul")
export const WEDDING_DATE_FORMAT = `YYYY년 MMMM D일 dddd A h시${WEDDING_DATE.minute() === 0 ? "" : " m분"}`

// 예식 당월 휴무일. 켈린더에 표시하기 위함.
// 예: 예식일 8월 -> 8월 15일 광복절
export const HOLIDAYS = []

export const LOCATION = "여의도웨딩컨벤션"
export const LOCATION_ADDRESS = "서울시 영등포구 여의대로 14, 3층 그랜드볼룸"

// 카카오톡 공유 시 위치 정보로 사용할 주소.
// LOCATION 과 동일하게 설정해도 무방하나, 필요에 따라 좀 더 상세히 작성 가능.
export const SHARE_ADDRESS = LOCATION
export const SHARE_ADDRESS_TITLE = LOCATION

// 네이버 지도 및 카카오 네비게이션에 사용할 좌표. [경도, 위도] 형식.
export const WEDDING_HALL_POSITION = [126.919137, 37.521646]

// 네이버 지도의 웨딩홀 장소 ID
// 네이버 지도 웹페이지에서 웨딩홀 검색 후 URL에서 확인 가능.
// 예: https://map.naver.com/p/entry/place/13321741 -> 13321741
export const NMAP_PLACE_ID = 11865877

// 카카오 지도의 웨딩홀 장소 ID
// 카카오 지도 웹페이지에서 웨딩홀 검색 후 해당 장소에서 상세보기 클릭 시 URL에서 확인 가능.
// 예: https://place.map.kakao.com/8634826 -> 8634826
export const KMAP_PLACE_ID = 8011957

export const BRIDE_FULLNAME = "권수현"
export const BRIDE_FIRSTNAME = "수현"
export const BRIDE_TITLE = "장녀"
export const BRIDE_FATHER = "권오경"
export const BRIDE_MOTHER = "이정주"
export const BRIDE_INFO = [
  {
    relation: "신부",
    name: BRIDE_FULLNAME,
    phone: "010-8262-1537",
    account: "우리은행 0000000000000",
  },
  {
    relation: "신부 아버지",
    name: BRIDE_FATHER,
    phone: "010-5151-2012",
    account: "농협은행 352-1865-0769-63",
  },
  {
    relation: "신부 어머니",
    name: BRIDE_MOTHER,
    phone: "010-2706-2157",
    account: "하나은행 171-890948-57807",
  },
]

export const GROOM_FULLNAME = "신희암"
export const GROOM_FIRSTNAME = "희암"
export const GROOM_TITLE = "장남"
export const GROOM_FATHER = "신태수"
export const GROOM_MOTHER = "강정숙"
export const GROOM_INFO = [
  {
    relation: "신랑",
    name: GROOM_FULLNAME,
    phone: "010-4872-6876",
    account: "하나은행 766-910146-01107",
  },
  {
    relation: "신랑 아버지",
    name: GROOM_FATHER,
    phone: "010-8157-4832",
    account: "신한은행 000000000000",
  },
  {
    relation: "신랑 어머니",
    name: GROOM_MOTHER,
    phone: "010-2225-4503",
    account: "신한은행 110-048-704338",
  },
]
