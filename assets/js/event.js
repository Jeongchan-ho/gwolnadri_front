// 스크롤 시 네비바 색상 변경
const scroll_body = document.querySelector("#Gwolnadri-body");

document.querySelector('#Gwolnadri-body').addEventListener('scroll', (e) => {
  let y = scroll_body.scrollTop

  if (y > 5) {
    document.querySelector('.header').classList.add('on')
  }
  else if (y < 5) {
    document.querySelector('.header').classList.remove('on')
  }
});

window.onload = function () {
  RandomEventList()
  EventList()
}

async function RandomEventList() {
  const random_response = await fetch(`${backend_base_url}/events/`, { method: 'GET' });
  const random_response_json = await random_response.json();
  // 랜덤한 인덱스 생성
  const randomIndex = Math.floor(Math.random() * random_response_json.length);

  // 랜덤한 데이터 선택
  const randomData = random_response_json[randomIndex];

  // 선택된 데이터 출력 또는 원하는 로직 수행

  const R_mainPageElement = document.querySelector('.main-page');
  const R_eventImgElement = document.createElement('img');
  const R_reservationElement = document.createElement('p');
  const R_cardTextElement = document.createElement('div');
  const R_categoryElement = document.createElement('a');
  const R_titleElement = document.createElement('h3');
  const R_eventDateElement = document.createElement('p');
  const get_event_start_date = randomData.event_start_date
  const get_event_end_date = randomData.event_end_date

  R_eventImgElement.className = 'img';
  R_eventImgElement.src = `${backend_base_url}${randomData.image}`;
  R_eventImgElement.alt = '';
  const R_eventImg = R_eventImgElement
  R_eventImg.style.filter = 'brightness(0.6)';

  R_cardTextElement.className = 'card-txt';

  R_categoryElement.className = 'category';
  R_categoryElement.innerText = '전시/행사';
  R_cardTextElement.appendChild(R_categoryElement)

  R_titleElement.className = 'title';
  R_titleElement.innerText = randomData.title
  R_cardTextElement.appendChild(R_titleElement)

  R_eventDateElement.className = 'event-date';
  R_eventDateElement.innerText = `${get_event_start_date} - ${get_event_end_date}`;
  R_cardTextElement.appendChild(R_eventDateElement)

  R_mainPageElement.appendChild(R_eventImgElement)
  R_mainPageElement.appendChild(R_reservationElement)
  R_mainPageElement.appendChild(R_cardTextElement)

};

async function EventList() {
  const response = await fetch(`${backend_base_url}/events/`);
  const response_json = await response.json()
  const eventListContainer = document.getElementById('event_list');

  response_json.forEach(element => {
    const get_title = element.title;
    const get_event_start_date = element.event_start_date;
    const get_event_end_date = element.event_end_date;
    const get_likes = element.likes
    const get_like_count = element.likes_count;
    const get_bookmarker = element.event_bookmarks;
    const get_image = element.image

    const eventCard = document.createElement('div');
    eventCard.classList.add('sub-card');
    const eventImage = document.createElement('img');
    eventImage.src = `${backend_base_url}${get_image}`;
    eventImage.alt = '';

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const eventStart = new Date(get_event_start_date);
    eventStart.setHours(0, 0, 0, 0);
    const eventEnd = new Date(get_event_end_date);
    eventEnd.setHours(0, 0, 0, 0);

    const oneDay = 24 * 60 * 60 * 1000;

    const reservationTag = document.createElement('p');
    reservationTag.classList.add('reservation');
    if (currentDate >= (eventStart - oneDay) && currentDate <= (eventEnd - oneDay)) {
      reservationTag.innerText = '티켓오픈';
    } 
    else if (currentDate >= eventStart && currentDate >= eventEnd) {
      reservationTag.innerText = '티켓마감';
    } 
    else if (eventStart > currentDate) {
      reservationTag.innerText = '오픈예정';
    } 
    else {
      reservationTag.innerText = '오류';
    }

    const eventCardTxt = document.createElement('div');
    eventCardTxt.classList.add('sub-card-txt');

    const eventCategory = document.createElement('a');
    eventCategory.classList.add('category');
    eventCategory.innerText = '전시/행사';
    eventCategory.style.cursor = 'pointer';

    const eventTitle = document.createElement('h3');
    eventTitle.id = 'event_title';
    eventTitle.classList.add('title');
    eventTitle.innerText = get_title;
    eventTitle.style.cursor = 'pointer';

    const eventDate = document.createElement('p');
    eventDate.id = 'event_date';
    eventDate.classList.add('event-date');
    eventDate.innerText = `${get_event_start_date} - ${get_event_end_date}`;
    eventDate.style.cursor = 'pointer';

    const cardIcon = document.createElement('div');
    cardIcon.classList.add('card-icon');

    const likeIcon = document.createElement('div');
    likeIcon.id = 'like_icon';
    likeIcon.classList.add('heart');

    const likeIconImage = document.createElement('img');
    likeIconImage.src = '/assets/img/Heart-outline.svg';
    if (!payload_parse || !payload_parse.user_id) {
      likeIconImage.setAttribute("src", "/assets/img/Heart-outline.svg");
    } else if (get_likes.includes(payload_parse.user_id)) {
      likeIconImage.setAttribute("src", "/assets/img/Heart-full.svg");
    } else {
      likeIconImage.setAttribute("src", "/assets/img/Heart-outline.svg");
    }
    likeIconImage.alt = '';
    // likeIconImage.style.cursor = "default";
    const likeCount = document.createElement('span');
    likeCount.id = 'like_count';
    likeCount.innerText = String(get_like_count);

    const bookmarkIcon = document.createElement('div');
    bookmarkIcon.id = 'bookmark_icon';
    bookmarkIcon.classList.add('bookmark');

    const bookmarkIconImage = document.createElement('img');
    bookmarkIconImage.alt = '';

    if (!payload_parse || !payload_parse.user_id) {
      bookmarkIconImage.setAttribute("src", "/assets/img/Bookmark-outline.svg");
    } else if (get_bookmarker.includes(payload_parse.user_id)) {
      bookmarkIconImage.setAttribute("src", "/assets/img/Bookmark-full.svg");
    } else {
      bookmarkIconImage.setAttribute("src", "/assets/img/Bookmark-outline.svg");
    }

    likeIcon.appendChild(likeIconImage);
    likeIcon.appendChild(likeCount);

    bookmarkIcon.appendChild(bookmarkIconImage);

    cardIcon.appendChild(likeIcon);
    cardIcon.appendChild(bookmarkIcon);

    eventCardTxt.appendChild(eventCategory);
    eventCardTxt.appendChild(eventTitle);
    eventCardTxt.appendChild(eventDate);

    eventCardTxt.appendChild(cardIcon);

    eventCard.appendChild(eventImage);
    eventCard.appendChild(reservationTag);
    eventCard.appendChild(eventCardTxt);

    eventListContainer.appendChild(eventCard);

    
    eventImage.addEventListener('click', function () {
      const event_id = parseInt(element.id, 10);
      window.location.href = `${frontend_base_url}/event-detail.html?event_id=${event_id}`;
    });
    eventTitle.addEventListener('click', function () {
      const event_id = parseInt(element.id, 10);
      window.location.href = `${frontend_base_url}/event-detail.html?event_id=${event_id}`;
    });
    eventDate.addEventListener('click', function () {
      const event_id = parseInt(element.id, 10);
      window.location.href = `${frontend_base_url}/event-detail.html?event_id=${event_id}`;
    });
    eventCategory.addEventListener('click', function () {
      const event_id = parseInt(element.id, 10);
      window.location.href = `${frontend_base_url}/event-detail.html?event_id=${event_id}`;
    });    



    bookmarkIcon.addEventListener('click', async () => {
      const event_id = parseInt(element.id, 10);
      const token = localStorage.getItem("access");

      if (payload) {
        try {
          const bookmarkResponse = await fetch(`${backend_base_url}/events/${event_id}/bookmark/`, {
            method: 'POST',
            headers: {
              "Authorization": `Bearer ${token}`,
            }
          });

          const bookmarkData = await bookmarkResponse.json();
          alert(bookmarkData.message);
          window.location.reload()
        } catch (error) {
          console.error('Error bookmarking event:', error);

        }
      } else {
        alert("로그인이 필요합니다")
        location.replace(`${frontend_base_url}/login.html`)

      }

    });

    likeIcon.addEventListener('click', async () => {
      const event_id = parseInt(element.id, 10);
      const token = localStorage.getItem("access");
      if (payload) {
        try {
          const heartResponse = await fetch(`${backend_base_url}/events/${event_id}/like/`, {
            method: 'POST',
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });

          const heartData = await heartResponse.json();
          alert(heartData.message);
          window.location.reload()

        } catch (error) {
          console.error('Error likes event:', error);
        }
      }
      else {
        alert("로그인이 필요합니다")
        location.replace(`${frontend_base_url}/login.html`)
      }
    });
  });
};


async function HandleSearch() {
  const search_bar = document.getElementById("search_bar");

  if (search_bar.style.display == 'none') {
    search_bar.style.display = 'block';
  } else {
    search_bar.style.display = 'none';
  }
};


async function enterkey(event) {
  if (event.keyCode == 13) {
    const word = document.getElementById("search_bar").value;
    if (!word || word.includes('#')) {
        event.preventDefault(); // 이벤트 기본 동작을 막음
        alert("다시 입력해주세요");
    } else {
      window.location.href = `${frontend_base_url}/search.html?search=${word}`;
    }
  }   
};