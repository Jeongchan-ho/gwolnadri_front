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

window.onload = async function EventList() {
  const response = await fetch(`${backend_base_url}/events/`, { method: 'GET' });
  const response_json = await response.json();
  console.log(response_json);

  // for (let i = 0; i < response_json.length; i++) {
  //     const booking = response_json[i]
  //     console.log(booking)}

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
    const diffDaysStart = Math.round(Math.abs((currentDate - eventStart) / oneDay));
    const diffDaysEnd = Math.round(Math.abs((currentDate - eventEnd) / oneDay));
    const reservationTag = document.createElement('p');
    reservationTag.classList.add('reservation');
    if (currentDate >= eventStart && currentDate <= (eventEnd - 7 * oneDay)) {
      reservationTag.innerText = '행사중';
    } else if (diffDaysStart > 0 ) {
      reservationTag.innerText = '행사예정';
    } else if (diffDaysEnd <= 7 && diffDaysEnd > 0) {
      reservationTag.innerText = '마감임박';
    } else {
      reservationTag.innerText = '삑'; 
    }

    const eventCardTxt = document.createElement('div');
    eventCardTxt.classList.add('sub-card-txt');

    const eventCategory = document.createElement('a');
    eventCategory.classList.add('category');
    eventCategory.innerText = '전시/행사';

    const eventTitle = document.createElement('h3');
    eventTitle.id = 'event_title';
    eventTitle.classList.add('title');
    eventTitle.innerText = get_title;

    const eventDate = document.createElement('p');
    eventDate.id = 'event_date';
    eventDate.classList.add('event-date');
    eventDate.innerText = `${get_event_start_date} - ${get_event_end_date}`;

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
    } else{
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


    bookmarkIcon.addEventListener('click', async () => {
      const event_id = parseInt(element.id, 10);
      const token = localStorage.getItem("access");

      if (payload) {
        try {
          const bookmarkResponse = await fetch(`${backend_base_url}/events/${event_id}/bookmark/`, {
            method: 'POST',
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });

          const bookmarkData = await bookmarkResponse.json();
          alert(bookmarkData.message);
        } catch (error) {
          console.error('Error bookmarking event:', error);
          
        }
      } else {
        alert("로그인이 필요합니다")
      }
      window.location.reload()

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
  
        } catch (error) {
          console.error('Error likes event:', error);
        }
      }
      else {
        alert("로그인이 필요합니다")
      }
  
      window.location.reload()
  
    });
    
  });

};  


async function HandleSearch() {
    
  const search_bar = document.getElementById("search_bar");
  
  if(search_bar.style.display=='none'){
      search_bar.style.display = 'block';	
  }else{
      search_bar.style.display = 'none';	
  } 
}


async function enterkey(event) {
  if (event.keyCode == 13) {
      // 엔터키가 눌렸을 때
      const word = document.getElementById("search_bar").value;
      console.log(word);
      
      window.location.href = `${frontend_base_url}/search.html?search=${word}`;
  }
}