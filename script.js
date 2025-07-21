// script.js

function updateClock() {
  const now = new Date();
  const formatted = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  }).format(now);
  document.getElementById('current-time').textContent = formatted;
}
setInterval(updateClock, 1000);
updateClock();

const input = document.getElementById('search-input');
const button = document.getElementById('search-btn');
const searchStatus = document.getElementById('search-status');
const airportInfo = document.getElementById('airport-info');
const tableBody = document.getElementById('notam-table-body');

function refreshMappings() {
  window.airportMappings = window.settingsUtils.getAirportMappings();
  window.flightMappings = window.settingsUtils.getFlightMappings();
}
refreshMappings();

// 검색중 spinner 표시 함수
function setSearching(isSearching) {
  if (isSearching) {
    searchStatus.innerHTML = `<span class="spinner"></span> 검색 중...`;
  } else {
    searchStatus.innerHTML = "";
  }
}

// 병렬 번역 처리! (Promise.all 사용)
async function fetchAndDisplay(icao, type) {
  const url = `https://corsproxy.io/?https://ourairports.com/airports/${icao}/notams.html`;
  const res = await fetch(url);
  const text = await res.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');
  const notamPs = doc.querySelectorAll('p.notam');
  const notams = Array.from(notamPs)
    .map(p => p.textContent.trim())
    .filter(Boolean);

  if (!notams.length) return [];

  // 병렬 번역 요청!
  const pairs = await Promise.all(notams.map(async raw => ({
    raw,
    trans: await translateNOTAM(raw)
  })));
  return pairs;
}

// 번역 API 호출
async function translateNOTAM(text) {
  try {
    const res = await fetch('https://test-api-nine-rho.vercel.app/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, source: 'EN', target: 'KO' })
    });
    const data = await res.json();
    return data.result || '번역 실패';
  } catch (e) {
    return '번역 오류';
  }
}

// 메인 검색 함수
async function handleSearch() {
  refreshMappings();
  const airportMappings = window.airportMappings;
  const flightMappings = window.flightMappings;

  const keyword = input.value.trim().toUpperCase();
  if (!keyword) return;
  button.disabled = true;
  setSearching(true);
  airportInfo.textContent = '';
  tableBody.innerHTML = '';

  let dep='', arr='', icao='', rows=[], count=0;

  if (/^\d+$/.test(keyword) && flightMappings[keyword]) {
    // 편명 검색
    [dep, arr] = flightMappings[keyword].split(',');
    airportInfo.textContent = `출발지: ${dep} / 목적지: ${arr}`;
    // 출발지 NOTAM
    const depPairs = await fetchAndDisplay(dep, 'dep');
    // 도착지 NOTAM
    const arrPairs = await fetchAndDisplay(arr, 'arr');

    depPairs.forEach(pair => {
      rows.push({ type: '출발', ...pair });
    });
    arrPairs.forEach(pair => {
      rows.push({ type: '도착', ...pair });
    });
    count = depPairs.length + arrPairs.length;
  } else {
    // 공항코드 검색
    icao = airportMappings[keyword] || keyword;
    airportInfo.textContent = `검색: ${icao}`;
    const pairs = await fetchAndDisplay(icao, 'single');
    pairs.forEach(pair => rows.push({ ...pair }));
    count = pairs.length;
  }

  setSearching(false);

  // 표 렌더링 (원문-번역 한 줄씩)
  tableBody.innerHTML = '';
  if (!rows.length) {
    tableBody.innerHTML = '<tr><td colspan="2">NOTAM 정보 없음</td></tr>';
  } else {
    rows.forEach(row => {
      tableBody.innerHTML += `<tr>
        <td>${row.type ? `<b>[${row.type}]</b> ` : ''}${row.raw.replace(/\n/g,'<br>')}</td>
        <td>${row.trans.replace(/\n/g,'<br>')}</td>
      </tr>`;
    });
  }

  searchStatus.textContent = `검색 완료 (${count ? `총 ${count}건` : "0건"})`;
  button.disabled = false;
}
button.addEventListener('click', handleSearch);
input.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSearch(); });

/* ---- 설정 모달 ---- */
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeSettings = document.getElementById('close-settings');
const settingsContent = document.getElementById('settings-content');
const tabAirport = document.getElementById('tab-airport');
const tabFlight = document.getElementById('tab-flight');

settingsBtn.onclick = () => { showSettingsTab('airport'); settingsModal.classList.remove('hidden'); };
closeSettings.onclick = () => settingsModal.classList.add('hidden');
window.onclick = (e) => {
  if (e.target === settingsModal) settingsModal.classList.add('hidden');
};

tabAirport.onclick = () => showSettingsTab('airport');
tabFlight.onclick = () => showSettingsTab('flight');

function showSettingsTab(tab) {
  tabAirport.classList.toggle('active', tab==='airport');
  tabFlight.classList.toggle('active', tab==='flight');
  if (tab === 'airport') renderAirportSettings();
  else renderFlightSettings();
}

function renderAirportSettings() {
  const airportMappings = window.settingsUtils.getAirportMappings();
  let html = `<table><tr><th>IATA</th><th>ICAO</th><th></th></tr>`;
  Object.entries(airportMappings).forEach(([iata, icao]) => {
    html += `<tr>
      <td><input type="text" value="${iata}" data-iata="${iata}" class="iata-input" maxlength="4" style="width:45px;"></td>
      <td><input type="text" value="${icao}" data-icao="${iata}" class="icao-input" maxlength="4" style="width:60px;"></td>
      <td><button class="del-btn" data-del="${iata}">삭제</button></td>
    </tr>`;
  });
  html += `</table>
    <div class="add-row">
      <input type="text" id="add-iata" placeholder="IATA" maxlength="4">
      <input type="text" id="add-icao" placeholder="ICAO" maxlength="4">
      <button id="add-airport-map">추가</button>
    </div>`;
  settingsContent.innerHTML = html;

  // 삭제
  settingsContent.querySelectorAll('.del-btn').forEach(btn =>
    btn.onclick = () => {
      delete airportMappings[btn.dataset.del];
      window.settingsUtils.saveAirportMappings(airportMappings);
      renderAirportSettings();
    }
  );
  // 수정
  settingsContent.querySelectorAll('.iata-input').forEach(input =>
    input.onchange = () => {
      const oldKey = input.dataset.iata;
      const newKey = input.value.trim().toUpperCase();
      if (oldKey !== newKey) {
        airportMappings[newKey] = airportMappings[oldKey];
        delete airportMappings[oldKey];
        window.settingsUtils.saveAirportMappings(airportMappings);
        renderAirportSettings();
      }
    }
  );
  settingsContent.querySelectorAll('.icao-input').forEach(input =>
    input.onchange = () => {
      const key = input.dataset.icao;
      airportMappings[key] = input.value.trim().toUpperCase();
      window.settingsUtils.saveAirportMappings(airportMappings);
      renderAirportSettings();
    }
  );
  // 추가
  document.getElementById('add-airport-map').onclick = () => {
    const iata = document.getElementById('add-iata').value.trim().toUpperCase();
    const icao = document.getElementById('add-icao').value.trim().toUpperCase();
    if (iata && icao) {
      airportMappings[iata] = icao;
      window.settingsUtils.saveAirportMappings(airportMappings);
      renderAirportSettings();
    }
  }
}

function renderFlightSettings() {
  const flightMappings = window.settingsUtils.getFlightMappings();
  let html = `<table><tr><th>편명</th><th>출발,도착</th><th></th></tr>`;
  Object.entries(flightMappings).forEach(([flight, route]) => {
    html += `<tr>
      <td><input type="text" value="${flight}" data-fno="${flight}" class="fno-input" maxlength="5" style="width:45px;"></td>
      <td><input type="text" value="${route}" data-route="${flight}" class="route-input" style="width:110px;"></td>
      <td><button class="del-btn" data-del="${flight}">삭제</button></td>
    </tr>`;
  });
  html += `</table>
    <div class="add-row">
      <input type="text" id="add-fno" placeholder="편명" maxlength="5">
      <input type="text" id="add-route" placeholder="출발,도착" style="width:80px;">
      <button id="add-flight-map">추가</button>
    </div>`;
  settingsContent.innerHTML = html;

  // 삭제
  settingsContent.querySelectorAll('.del-btn').forEach(btn =>
    btn.onclick = () => {
      delete flightMappings[btn.dataset.del];
      window.settingsUtils.saveFlightMappings(flightMappings);
      renderFlightSettings();
    }
  );
  // 수정
  settingsContent.querySelectorAll('.fno-input').forEach(input =>
    input.onchange = () => {
      const oldKey = input.dataset.fno;
      const newKey = input.value.trim();
      if (oldKey !== newKey) {
        flightMappings[newKey] = flightMappings[oldKey];
        delete flightMappings[oldKey];
        window.settingsUtils.saveFlightMappings(flightMappings);
        renderFlightSettings();
      }
    }
  );
  settingsContent.querySelectorAll('.route-input').forEach(input =>
    input.onchange = () => {
      const key = input.dataset.route;
      flightMappings[key] = input.value.trim().toUpperCase();
      window.settingsUtils.saveFlightMappings(flightMappings);
      renderFlightSettings();
    }
  );
  // 추가
  document.getElementById('add-flight-map').onclick = () => {
    const fno = document.getElementById('add-fno').value.trim();
    const route = document.getElementById('add-route').value.trim().toUpperCase();
    if (fno && route.includes(',')) {
      flightMappings[fno] = route;
      window.settingsUtils.saveFlightMappings(flightMappings);
      renderFlightSettings();
    }
  }
}
