// settings.js

function getAirportMappings() {
  const stored = localStorage.getItem('airportMappings');
  return stored ? JSON.parse(stored) : {
    GMP: "RKSS", // 김포
    CJU: "RKPC", // 제주
    PUS: "RKPK", // 부산 김해
    KPO: "RKJK", // 포항
    CJJ: "RKTU", // 청주
    ICN: "RKSI", // 인천
    KUV: "RKJK", // 군산
    KWJ: "RKJJ", // 광주
    USN: "RKPU", // 울산
    YNY: "RKNY", // 양양
    RSU: "RKJY", // 여수

    // 일본 주요공항
    NRT: "RJAA", // 도쿄 나리타
    HND: "RJTT", // 도쿄 하네다
    KIX: "RJBB", // 오사카 간사이
    NGO: "RJGG", // 나고야 주부
    FUK: "RJFF", // 후쿠오카
    CTS: "RJCC", // 삿포로 신치토세
    HIJ: "RJOA", // 히로시마
    KOJ: "RJFK", // 가고시마
    OKA: "ROAH", // 오키나와 나하
    KMJ: "RJFT", // 구마모토
    OIT: "RJFO", // 오이타
    MYJ: "RJOM", // 마츠야마
    SDJ: "RJSS", // 센다이
    NGO: "RJGG", // 나고야

    // 중국/동남아/홍콩/마카오/타이완 등
    HKG: "VHHH", // 홍콩
    MFM: "VMMC", // 마카오
    TPE: "RCTP", // 타이베이 타오위안
    KHH: "RCKH", // 가오슝
    TSA: "RCSS", // 송산
    SGN: "VVTS", // 호치민
    HAN: "VVNB", // 하노이
    DAD: "VVDN", // 다낭
    CXR: "VVCR", // 냐짱
    PQC: "VVPQ", // 푸꾸옥
    SIN: "WSSS", // 싱가포르 창이
    KUL: "WMKK", // 쿠알라룸푸르
    BKK: "VTBS", // 방콕 수완나폼
    CNX: "VTCC", // 치앙마이
    DPS: "WADD", // 발리
    PEN: "WMKP", // 페낭
    SUB: "WARR", // 수라바야
    JHB: "WMKJ", // 조호바루
    KLO: "RPVK", // 칼리보(보라카이)
    MNL: "RPLL", // 마닐라
    CEB: "RPVM", // 세부
    CRK: "RPLC", // 클락
    SPN: "PGSN", // 사이판
    GUM: "PGUM", // 괌
    BJS: "ZBAA", // 베이징(PEK)
    PKX: "ZBAD", // 베이징 다싱(PKX)
    XIY: "ZLXY", // 시안
    CAN: "ZGGG", // 광저우
    SHA: "ZSSS", // 상하이 홍차오
    PVG: "ZSPD", // 상하이 푸둥
    DLC: "ZYTL", // 다롄
    TAO: "ZSQD", // 칭다오
    SHE: "ZYTX", // 선양
    TNA: "ZSTN", // 지난
    SZX: "ZGSZ", // 선전
    SJW: "ZBSJ", // 스좌좡
    JMU: "ZYJM", // 자무쓰
    YNJ: "ZYYJ", // 연길
    HRB: "ZYHB", // 하얼빈
    CKG: "ZUCK", // 충칭
    CTU: "ZUUU", // 청두
    FOC: "ZSFZ", // 푸저우
    HAK: "ZJHK", // 하이커우
    SIA: "ZLXY", // 시안(옛공항)
    // 기타 동남아
    BKI: "WBKK", // 코타키나발루
    // 기타 필요한 공항들 추가 가능
  };
}
function getFlightMappings() {
  const stored = localStorage.getItem('flightMappings');
  return stored ? JSON.parse(stored) : {
    "101": "RKSS,RKPC",
    "102": "RKPC,RKSS",
    "103": "RKSS,RKPC",
    "104": "RKPC,RKSS",
    "105": "RKSS,RKPC",
    "106": "RKPC,RKSS",
    "107": "RKSS,RKPC",
    "108": "RKPC,RKSS",
    "109": "RKSS,RKPC",
    "110": "RKPC,RKSS",
    "111": "RKSS,RKPC",
    "112": "RKPC,RKSS",
    "113": "RKSS,RKPC",
    "114": "RKPC,RKSS",
    "115": "RKSS,RKPC",
    "116": "RKPC,RKSS",
    "117": "RKSS,RKPC",
    "118": "RKPC,RKSS",
    "119": "RKSS,RKPC",
    "120": "RKPC,RKSS",
    "121": "RKSS,RKPC",
    "122": "RKPC,RKSS",
    "123": "RKSS,RKPC",
    "124": "RKPC,RKSS",
    "125": "RKSS,RKPC",
    "126": "RKPC,RKSS",
    "127": "RKSS,RKPC",
    "128": "RKPC,RKSS",
    "129": "RKSS,RKPC",
    "130": "RKPC,RKSS",
    "131": "RKSS,RKPC",
    "132": "RKPC,RKSS",
    "133": "RKSS,RKPC",
    "134": "RKPC,RKSS",
    "135": "RKSS,RKPC",
    "136": "RKPC,RKSS",
    "137": "RKSS,RKPC",
    "138": "RKPC,RKSS",
    "139": "RKSS,RKPC",
    "140": "RKPC,RKSS",
    "141": "RKSS,RKPC",
    "142": "RKPC,RKSS",
    "183": "RKSS,RKPC",
    "186": "RKPC,RKSS",
    "211": "RKTU,RKPC",
    "212": "RKPC,RKTU",
    "213": "RKTU,RKPC",
    "214": "RKPC,RKTU",
    "225": "RKTU,RKPC",
    "226": "RKPC,RKTU",
    "231": "RKTU,RKPC",
    "232": "RKPC,RKTU",
    "301": "RKJJ,RKPC",
    "302": "RKPC,RKJJ",
    "305": "RKJJ,RKPC",
    "306": "RKPC,RKJJ",
    "501": "RKPK,RKPC",
    "502": "RKPC,RKPK",
    "503": "RKPK,RKPC",
    "504": "RKPC,RKPK",
    "505": "RKPK,RKPC",
    "506": "RKPC,RKPK",
    "507": "RKPK,RKPC",
    "508": "RKPC,RKPK",
    "509": "RKPK,RKPC",
    "510": "RKPC,RKPK",
    "511": "RKPK,RKPC",
    "512": "RKPC,RKPK",
    "513": "RKPK,RKPC",
    "514": "RKPC,RKPK",
    "581": "RKPK,RKPC",
    "582": "RKPC,RKPK",
    "702": "RKPC,RKTN",
    "705": "RKTN,RKPC",
    "706": "RKPC,RKTN",
    "711": "RKTN,RKPC",
    "903": "RKSS,RKPK",
    "904": "RKPK,RKSS",
    "907": "RKSS,RKPK",
    "908": "RKPK,RKSS",
    "1101": "RKSI,RJAA",
    "1102": "RJAA,RKSI",
    "1103": "RKSI,RJAA",
    "1104": "RJAA,RKSI",
    "1105": "RKSI,RJAA",
    "1106": "RJAA,RKSI",
    "1107": "RKSI,RJAA",
    "1108": "RJAA,RKSI",
    "1121": "RKSI,RJAA",
    "1122": "RJAA,RKSI",
    "1151": "RKPK,RJAA",
    "1152": "RJAA,RKPK",
    "1153": "RKPK,RJAA",
    "1154": "RJAA,RKPK",
    "1201": "RKSI,RJGG",
    "1202": "RJGG,RKSI",
    "1203": "RKSI,RJGG",
    "1204": "RJGG,RKSI",
    "1301": "RKSI,RJBB",
    "1302": "RJBB,RKSI",
    "1303": "RKSI,RJBB",
    "1304": "RJBB,RKSI",
    "1305": "RKSI,RJBB",
    "1306": "RKSI,RJBB",
    "1325": "RKSS,RJBB",
    "1326": "RJBB,RKSS",
    "1327": "RKSS,RJBB",
    "1328": "RJBB,RKSS",
    "1351": "RKPK,RJBB",
    "1352": "RJBB,RKPK",
    "1353": "RKPK,RJBB",
    "1354": "RJBB,RKPK",
    "1373": "RKSI,RJBB",
    "1374": "RJBB,RKSI",
    "1387": "RKSI,RJBB",
    "1388": "RJBB,RKSI",
    "1401": "RKSI,RJFF",
    "1402": "RJFF,RKSI",
    "1403": "RKSI,RJFF",
    "1404": "RJFF,RKSI",
    "1405": "RKSI,RJFF",
    "1406": "RKSI,RJFF",
    "1407": "RKSI,RJFF",
    "1408": "RJFF,RKSI",
    "1425": "RKSI,RJFF",
    "1426": "RJFF,RKSI",
    "1451": "RKPK,RJFF",
    "1452": "RJFF,RKPK",
    "1453": "RKPK,RJFF",
    "1454": "RJFF,RKPK",
    "1455": "RKPK,RJFF",
    "1456": "RKPK,RJFF",
    "1457": "RKPK,RJFF",
    "1458": "RKPK,RJFF",
    "1501": "RKSI,RJCC",
    "1502": "RJCC,RKSI",
    "1503": "RKSI,RJCC",
    "1504": "RJCC,RKSI",
    "1513": "RKSI,RJCH",
    "1514": "RJCH,RKSI",
    "1551": "RKPK,RJCC",
    "1552": "RJCC,RKPK",
    "1601": "RKSI,RJNS",
    "1602": "RJNS,RKSI",
    "1603": "RKSI,RJNS",
    "1604": "RJNS,RKSI",
    "1611": "RKSI,RJOA",
    "1612": "RJOA,RKSI",
    "1615": "RKSI,RJOA",
    "1616": "RJOA,RKSI",
    "1701": "RKSI,RJOM",
    "1702": "RJOM,RKSI",
    "1703": "RKSI,RJOM",
    "1704": "RJOM,RKSI",
    "1801": "RKSI,ROAH",
    "1802": "ROAH,RKSI",
    "1811": "RKSI,RJFO",
    "1812": "RJFO,RKSI",
    "1823": "RKSI,RJFK",
    "1824": "RJFK,RKSI",
    "2103": "RKSI,RPLL",
    "2104": "RPLL,RKSI",
    "2107": "RKSI,RPLC",
    "2108": "RPLC,RKSI",
    "2113": "RKSI,RPVM",
    "2114": "RPVM,RKSI",
    "2121": "RKSI,RPSP",
    "2122": "RPSP,RKSI",
    "2125": "RKSI,RPSP",
    "2126": "RPSP,RKSI",
    "2141": "RKTN,RPVM",
    "2142": "RPVM,RKTN",
    "2157": "RKPK,RPSP",
    "2158": "RPSP,RKPK",
    "2161": "RKPK,RPVM",
    "2162": "RPVM,RKPK",
    "2201": "RKSI,VVNB",
    "2202": "VVNB,RKSI",
    "2211": "RKSI,VVDN",
    "2212": "VVDN,RKSI",
    "2217": "RKSI,VVDN",
    "2218": "VVDN,RKSI",
    "2261": "RKPK,VVDN",
    "2262": "VVDN,RKPK",
    "2303": "RKSI,VVCR",
    "2304": "VVCR,RKSI",
    "2315": "RKSI,VVPQ",
    "2316": "VVPQ,RKSI",
    "2401": "RKSI,VLVT",
    "2402": "VLVT,RKSI",
    "2503": "RKSI,VTBS",
    "2504": "VTBS,RKSI",
    "2515": "RKSI,VTCC",
    "2516": "VTCC,RKSI",
    "2531": "RKPC,VTBS",
    "2532": "VTBS,RKPC",
    "2551": "RKPK,VTBS",
    "2552": "VTBS,RKPK",
    "2603": "RKSI,WBKK",
    "2604": "WBKK,RKSI",
    "2661": "RKPK,WSSS",
    "2662": "WSSS,RKPK",
    "2701": "RKSI,WIDD",
    "2711": "RKSI,WADD",
    "2712": "WADD,RKSI",
    "3101": "RKSI,PGUM",
    "3102": "PGUM,RKSI",
    "3107": "RKSI,PGUM",
    "3108": "PGUM,RKSI",
    "3211": "RKSI,PGSN",
    "3212": "PGSN,RKSI",
    "3217": "RKSI,PGSN",
    "3218": "PGSN,RKSI",
    "5203": "RKSI,ZMCK",
    "5204": "ZMCK,RKSI",
    "5257": "RKPK,ZMCK",
    "5258": "ZMCK,RKPK",
    "6001": "RKSI,VMMC",
    "6002": "VMMC,RKSI",
    "6021": "RKSI,VHHH",
    "6022": "VHHH,RKSI",
    "6031": "RKPC,VHHH",
    "6032": "VHHH,RKPC",
    "6037": "RKPC,VMMC",
    "6038": "VMMC,RKPC",
    "6101": "RKSI,RCTP",
    "6102": "RCTP,RKSI",
    "6153": "RKPK,RCTP",
    "6154": "RCTP,RKPK",
    "8133": "RKPC,ZBAA",
    "8134": "ZBAA,RKPC",
    "8135": "RKPC,ZBAD",
    "8136": "ZBAD,RKPC",
    "8175": "RKPC,ZLXY",
    "8176": "ZLXY,RKPC",
    "8253": "RKPK,ZGDY",
    "8254": "ZGDY,RKPK",
    "8351": "RKPK,ZSPD",
    "8352": "ZSPD,RKPK",
    "8401": "RKSI,ZSQD",
    "8402": "ZSQD,RKSI",
    "8501": "RKSI,ZSWH",
    "8502": "ZSWH,RKSI",
    "8503": "RKSI,ZSWH",
    "8504": "ZSWH,RKSI",
    "8777": "RJCH,RJGG",
    "8801": "RKSI,ZBSJ",
    "8802": "ZBSJ,RKSI",
    "8851": "RKPK,ZBSJ",
    "8852": "ZBSJ,RKPK",
    "8901": "RKSI,ZYJM",
    "8902": "ZYJM,RKSI",
    "8903": "RKSI,ZYYJ",
    "8904": "ZYYJ,RKSI",
    "8905": "RKSI,ZYHB",
    "8906": "ZYHB,RKSI"
  };
}
function saveAirportMappings(obj) {
  localStorage.setItem('airportMappings', JSON.stringify(obj));
}
function saveFlightMappings(obj) {
  localStorage.setItem('flightMappings', JSON.stringify(obj));
}

// 전역 변수로 초기값 (script.js에서 사용)
window.airportMappings = getAirportMappings();
window.flightMappings = getFlightMappings();

window.settingsUtils = {
  getAirportMappings,
  getFlightMappings,
  saveAirportMappings,
  saveFlightMappings
};
