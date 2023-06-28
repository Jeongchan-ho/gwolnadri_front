window.onload = async function ReservationDetail() {
    const event_list = document.getElementById('event_list')

    const response = await fetch(`${backend_base_url}/users/me/`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    if (response.status == 200) {
        const response_json = await response.json()
        const bookmark_list = response_json.bookmark_events
        if (bookmark_list.length == 0) {
            const none_list = document.createElement('div')
            none_list.setAttribute('class','sh_col')

            const i = document.createElement('i')
            i.setAttribute('class','xi-calendar-cancle')

            const none_content = document.createElement('p')
            none_content.setAttribute('class','sh_small')
            none_content.innerText = "관심 행사가 없습니다"

            none_list.appendChild(i)
            none_list.appendChild(none_content)
            event_list.insertBefore(none_list, event_list.firstChild);

        } else {
            console.log(bookmark_list)
            
            for (let i = 0; i < bookmark_list.length; i++) {
                const events = bookmark_list[i]
    
                const div = document.createElement('div')
                div.setAttribute('class','sub-card')
    
                const event_img = document.createElement('img')
                // event_img.setAttribute('src',`${backend_base_url}${events.image}`)
                event_img.setAttribute('src',"/assets/img/image-2.jpg")
    
                // 기간한정 스티커 ----
                const get_event_start_date = events.event_start_date
                const get_event_end_date = events.event_end_date

                const currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0);

                const eventStart = new Date(get_event_start_date); 
                const eventEnd = new Date(get_event_end_date); 
                eventStart.setHours(0, 0, 0, 0);
                eventEnd.setHours(0, 0, 0, 0);
                const oneDay = 24 * 60 * 60 * 1000;
                const diffDaysStart = Math.round(Math.abs((currentDate - eventStart) / oneDay));
                const diffDaysEnd = Math.round(Math.abs((currentDate - eventEnd) / oneDay));
            
                const season = document.createElement('p')
                season.setAttribute('class','reservation')
                if (currentDate >= eventStart && currentDate <= (eventEnd - 7 * oneDay)) {
                  season.innerText = '행사중';
                } else if (diffDaysStart > 0 ) {
                  season.innerText = '행사예정';
                } else if (diffDaysEnd <= 7 && diffDaysEnd > 0) {
                  season.innerText = '마감임박';
                } else {
                  season.innerText = '삑'; 
                }
                
                const txt_div = document.createElement('div')
                txt_div.setAttribute('class','sub-card-txt')
    
                const category = document.createElement('a')
                category.setAttribute('class','category')
                category.innerText = "전시/행사"
    
                const event_title = document.createElement('h3')
                event_title.setAttribute('class','title')
                event_title.innerText = `${events.title}`
    
                const event_date = document.createElement('p')
                event_date.setAttribute('class','event-date')
                event_date.innerText = `${events.event_start_date}`+ " - "+`${events.event_end_date}`
    
                const icon_div = document.createElement('div')
                icon_div.setAttribute('class','card-icon')
    
                const like_div = document.createElement('div')
                like_div.setAttribute('class','heart')
    
                const like_icon = document.createElement('img')
                if (!payload_parse || !payload_parse.user_id) {
                    like_icon.setAttribute("src", "/assets/img/Heart-outline.svg");
                } else if (events.likes.includes(payload_parse.user_id)) {
                    like_icon.setAttribute("src", "/assets/img/Heart-full.svg");
                } else {
                    like_icon.setAttribute("src", "/assets/img/Heart-outline.svg");
                }
    
                const like_span = document.createElement('span')
                like_span.innerText = `${events.likes_count}`
    
                const bookmark_div = document.createElement('div')
                bookmark_div.setAttribute('class','bookmark') 
    
                const bookmark_icon = document.createElement('img')
                if (!payload_parse || !payload_parse.user_id) {
                    bookmark_icon.setAttribute("src", "/assets/img/Bookmark-outline.svg");
                } else if (events.event_bookmarks.includes(payload_parse.user_id)) {
                    bookmark_icon.setAttribute("src", "/assets/img/Bookmark-full.svg");
                } else {
                    bookmark_icon.setAttribute("src", "/assets/img/Bookmark-outline.svg");
                }
    
                div.appendChild(event_img)
                div.appendChild(season)
                div.appendChild(txt_div)
                txt_div.appendChild(category)
                txt_div.appendChild(event_title)
                txt_div.appendChild(event_date)
                txt_div.appendChild(icon_div)
                icon_div.appendChild(like_div)
                icon_div.appendChild(bookmark_div)
                like_div.appendChild(like_icon)
                like_div.appendChild(like_span)
                bookmark_div.appendChild(bookmark_icon)
    
                event_img.addEventListener('click', function () {
                    const event_id = parseInt(events.id, 10);
                    window.location.href = `${frontend_base_url}/event-detail.html?event_id=${event_id}`;
                });
    
                bookmark_icon.addEventListener('click', async () => {
                    const event_id = parseInt(events.id, 10);
              
                    // console.log(event_id);
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

                like_icon.addEventListener('click', async () => {
                    const event_id = parseInt(events.id, 10);
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
                
                event_list.insertBefore(div, event_list.firstChild);
            }
            
        }
    } else {
        (response.status)

    }
}