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
  EventDetail()
  Eventreview()
}
async function EventDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  event_id = urlParams.get('event_id');
  const eventDetailURL = `${frontend_base_url}/event-detail.html?event_id=${event_id}`;

  const response = await fetch(`${backend_base_url}/events/${event_id}`, { method: 'GET' });
  const response_json = await response.json();

  const mainPageElement = document.querySelector('.main-page');
  const eventImgElement = document.createElement('img');
  const cardTxtElement = document.createElement('div');
  const categoryElement = document.createElement('a');
  const eventTitleElement = document.createElement('h3');
  const eventDateElement = document.createElement('p');
  const eventMoneyElement = document.createElement('p');
  const cardIconElement = document.createElement('div');
  const heartElement = document.createElement('div');
  const heartIconElement = document.createElement('img');
  const likeCountElement = document.createElement('span');
  const bookmarkElement = document.createElement('div');
  const bookmarkIconElement1 = document.createElement('img');
  const get_money = response_json.money

  const get_image = response_json.image;
  const backend_image_url = `${backend_base_url}${get_image}`;


  eventImgElement.className = 'event_img';
  eventImgElement.src = backend_image_url;
  const eventImg = eventImgElement
  eventImg.style.filter = 'brightness(0.6)';
  eventImgElement.alt = '';

  categoryElement.className = 'category';
  categoryElement.textContent = '전시/행사';

  eventTitleElement.id = 'event_title';
  eventTitleElement.className = 'title';
  eventTitleElement.textContent = response_json.title;

  eventDateElement.id = 'event_date';
  eventDateElement.className = 'event-date';
  eventDateElement.textContent = response_json.event_start_date + ' - ' + response_json.event_end_date;

  eventMoneyElement.id = 'event_money'
  eventMoneyElement.className = 'event-money';
  eventMoneyElement.textContent = "관람료: 1인 "+get_money+"원"

  heartElement.className = 'heart';
  heartIconElement.src = '/assets/img/Heart-outline.svg';
  heartIconElement.alt = '';
  const get_likes = response_json.likes
  if (!payload_parse || !payload_parse.user_id) {
    heartIconElement.setAttribute("src", "/assets/img/Heart-outline.svg");
  } else if (get_likes.includes(payload_parse.user_id)) {
    heartIconElement.setAttribute("src", "/assets/img/Heart-full.svg");
  }

  likeCountElement.id = 'like_count';
  likeCountElement.textContent = response_json.likes_count;
  heartElement.appendChild(heartIconElement);
  heartElement.appendChild(likeCountElement);




  bookmarkElement.className = 'bookmark';
  bookmarkIconElement1.id = 'bookmarkIcon';
  bookmarkIconElement1.src = '/assets/img/Bookmark-outline.svg';
  bookmarkIconElement1.alt = '';
  const get_bookmarker = response_json.event_bookmarks
  if (!payload_parse || !payload_parse.user_id) {
    bookmarkIconElement1.setAttribute("src", "/assets/img/Bookmark-outline.svg");
  } else if (get_bookmarker.includes(payload_parse.user_id)) {
    bookmarkIconElement1.setAttribute("src", "/assets/img/Bookmark-full.svg");
  }

  bookmarkElement.appendChild(bookmarkIconElement1);

  cardIconElement.className = 'card-icon';
  cardIconElement.appendChild(heartElement);
  cardIconElement.appendChild(bookmarkElement);

  cardTxtElement.className = 'card-txt';
  cardTxtElement.appendChild(categoryElement);
  cardTxtElement.appendChild(eventTitleElement);
  cardTxtElement.appendChild(eventDateElement);
  cardTxtElement.appendChild(eventMoneyElement);
  cardTxtElement.appendChild(cardIconElement);


  mainPageElement.appendChild(eventImgElement);
  mainPageElement.appendChild(cardTxtElement);

  const contant_pageElement = document.querySelector('.contant-page');
  const reservationButton = document.createElement('button');
  const subContentElement = document.createElement('div');
  const subContentTitleElement = document.createElement('p');
  const subContentTxtElement = document.createElement('p');

  reservationButton.id = 'SelectItem';
  reservationButton.className = 'reservation-btn';
  reservationButton.type = 'button';
  reservationButton.textContent = '예약하기';
  reservationButton.setAttribute('onClick', `bookingbtn(${event_id})`)
  subContentElement.className = 'sub-content';

  subContentTitleElement.className = 'content-title';
  subContentTitleElement.textContent = '행사개요';

  subContentTxtElement.id = 'event_content';
  subContentTxtElement.className = 'content-txt';
  subContentTxtElement.innerHTML = convertNewlinesToBreaks(response_json.content);
  // subContentTxtElement.textContent = response_json.content;


  subContentElement.appendChild(subContentTitleElement);
  subContentElement.appendChild(subContentTxtElement);

  contant_pageElement.appendChild(reservationButton);
  contant_pageElement.appendChild(subContentElement);


  bookmarkElement.addEventListener('click', async () => {
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
      alert("로그인이 필요합니다.")
      location.replace(`${frontend_base_url}/login.html`)
    }

  });


  heartElement.addEventListener('click', async () => {
    const token = localStorage.getItem("access");
    if (payload) {
      try {
        const heartResponse = await fetch(`${backend_base_url}/events/${event_id}/like/`, {
          method: 'POST',
          headers: {
            "Authorization": `Bearer ${token}`,
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
};

async function Eventreview() {
  const review_response = await fetch(`${backend_base_url}/events/${event_id}/review/`, { method: 'GET' });
  const review_response_json = await review_response.json();
  const review_list = document.getElementById('review_list');

  if (review_response_json.length === 0) {
    const noReviewContainElement = document.createElement('div');
    noReviewContainElement.className = 'contant-page';

    const noReviewTextElement = document.createElement('p');
    noReviewTextElement.className = 'NoneText';
    noReviewTextElement.textContent = "리뷰가 없습니다.";

    noReviewContainElement.appendChild(noReviewTextElement);
    review_list.appendChild(noReviewContainElement);
    return;
  }

  review_response_json.forEach(element => {

    const get_img = element.review_image;
    const get_author = element.author_name;
    const get_grade = element.grade;
    const get_content = element.content;
    const get_review_id = element.id
    const reviewCardElement = document.createElement('div');
    reviewCardElement.setAttribute("class", "new-review-card");

    const reviewImgElement = document.createElement('img');
    reviewImgElement.className = 'review-image';
    reviewImgElement.id = 'review-image';

    reviewImgElement.src = `${backend_base_url}${get_img}`;
    reviewImgElement.alt = '';
    


    const reviewTxtElement = document.createElement('div');
    reviewTxtElement.setAttribute("class", "review-txt")

    const reviewButton = document.createElement('button');
    reviewButton.id = 'deletebtn'
    reviewButton.className = 'deletebtn'
    reviewButton.setAttribute("onclick", `HandleCommentDelete(${get_review_id})`)
    reviewButton.textContent = "삭제하기";
    if (payload && payload_parse.user_id === element.author) {
      reviewButton.style.display = "block";
    } else {
      reviewButton.style.display = "none";
    }

    const reviewAuthorElement = document.createElement('p');
    reviewAuthorElement.id = 'author';
    reviewAuthorElement.className = 'author';
    reviewAuthorElement.textContent = "작성자:" + get_author;

    const reviewGradeElement = document.createElement('p');
    reviewGradeElement.id = 'grade';
    reviewGradeElement.className = 'grade';

    switch (element.grade) {
      case 1:
        starNum = "⭐️"
        break
      case 2:
        starNum = "⭐️⭐️"
        break
      case 3:
        starNum = "⭐️⭐️⭐️"
        break
      case 4:
        starNum = "⭐️⭐️⭐️⭐️"
        break
      case 5:
        starNum = "⭐️⭐️⭐️⭐️⭐️"
        break
    }

    reviewGradeElement.textContent = "별점 : " + starNum + " ";

    
    const reviewContentElement = document.createElement('p');
    reviewContentElement.id = 'content';
    reviewContentElement.className = 'content';
    reviewContentElement.textContent = get_content;

    // const max_lenght = 20;
    // if (get_content.length > max_lenght) {
    //   reviewContentElement.textContent = get_content.substr(0, max_lenght) + '...';
    // } else {
    //   reviewContentElement.textContent = get_content;
    // }

    reviewCardElement.appendChild(reviewImgElement)

    reviewCardElement.appendChild(reviewTxtElement)
    reviewTxtElement.appendChild(reviewAuthorElement)
    reviewTxtElement.appendChild(reviewGradeElement)
    reviewTxtElement.appendChild(reviewContentElement)
    reviewTxtElement.appendChild(reviewButton)
    review_list.appendChild(reviewCardElement)

  });
}

async function HandleCommentDelete(get_review_id) {
  const response = await fetch(`${backend_base_url}/events/${event_id}/${get_review_id}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    },
    method: 'DELETE'
  })
  if (response.status == 204) {
    alert("리뷰가 삭제되었습니다.")
    window.location.reload()

  } else if (response.status == 403) {
    alert("작성하신 리뷰가 아닙니다.")
  }
  else if (response.status == 401) {
    alert("로그인이 필요합니다.")
  }
  else {
    alert("잘못된 접근입니다.")
  }
}


async function HandleComment() {
  const select_grade = document.getElementById('grade').value;
  const in_img = document.getElementById('in_img').files[0];
  const com_txt = document.getElementById('com_txt').value;
  const grade = select_grade.split('')[0]
  const maxSixe = 2 * 1024 * 1024

  if (!in_img) {
    alert("이미지를 넣어주세요.");
  }  else if (in_img.size >= maxSixe){
    alert("이미지가 너무 큽니다.")
    window.location.reload()
  } else if (com_txt.length > 30) {
    alert("30자 이내로 작성해주세요.");
  } else if (!com_txt){
    alert("댓글 내용을 입력해주세요.")  
  }else{
    
  const formdata = new FormData();
  formdata.append("grade", grade)
  formdata.append("review_image", in_img)
  formdata.append("content", com_txt)

  const response = await fetch(`${backend_base_url}/events/${event_id}/review/`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    method: 'POST',
    body: formdata
  })
  if (response.status == 201) {
    alert("작성되었습니다.")
    window.location.reload()

  } else if (response.status == 400) { 
    alert("별점을 선택해주세요.")
    (response.status)
    
  }
  else{
    alert("로그인이 필요합니다.")
  }
}}


document.querySelector("#in_img").addEventListener('change', function () {
  readURL(this)
})

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      document.querySelector("#com_image").src = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
  } else {
    document.querySelector("#com_image").src = "";
  }
}

function convertNewlinesToBreaks(text) {
  // \n/g는 정규 표현식(regular expression)
  return text.replace(/\n/g, '<br>');
}

async function bookingbtn(event_id) {
  if (payload) {
    window.location.href = `${frontend_base_url}/select_event.html?event_id=${event_id}`
  } else {
    alert('로그인이 필요합니다')
  }
}
