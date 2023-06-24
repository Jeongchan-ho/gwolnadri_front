const user_id = parseInt(
  new URLSearchParams(window.location.search).get("user_id")
);
const logined_token = localStorage.getItem("access");
const logined_account = payload_parse.account;
console.log(payload_parse.user_id);

window.onload = () => {
  currentProfile(user_id);
};

async function currentProfile(user_id) {
  const response = await fetch(`${backend_base_url}/users/me/`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access"),
    },
  });

  response_json = await response.json();

  document.getElementById("email").value = response_json.email;
  document.getElementById("username").value = response_json.username;

  const profile_img = document.getElementById("profile_image");
  if (response_json.profile_image) {
    const imageUrl = `${backend_base_url}${response_json.profile_image}`;
    document.getElementById("profile_preview").src = imageUrl;
  } else {
    document.getElementById("profile_preview").src =
      "/assets/img/no-profile.png";
  }
}

function toggleFileInput() {
  const fileInput = document.getElementById("profile_image");
  if (fileInput.style.display === "none") {
    fileInput.style.display = "block";
  } else {
    fileInput.style.display = "none";
  }
}

function previewImage() {
  const fileInput = document.getElementById("profile_image");
  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onloadend = function () {
    const previewImg = document.getElementById("profile_preview");
    previewImg.src = reader.result;
  };

  if (file) {
    reader.readAsDataURL(file);
  }
}

function deleteProfileImage() {
  document.getElementById("profile_image").value = "";
  document.getElementById("profile_preview").src = "/assets/img/no-profile.png";
}

async function updateProfile() {
  const email = document.getElementById("email").value;
  const username = document.getElementById("username").value;
  const fileInput = document.getElementById("profile_image").files[0];
  // const file = fileInput.files[0];
  const formData = new FormData();

  formData.append("email", email);
  formData.append("username", username);


  if (fileInput) {
    formData.append("profile_image", fileInput);
  }

  console.log(formData)
  const response = await fetch(`${backend_base_url}/users/me/modify/`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("access"),
    },
    method: "PUT",
    body: formData,
  });

  if (response.status == 200) {
    alert("수정 완료");
    location.replace(`${frontend_base_url}/profile.html`);
  } else if (username == "") {
    alert("닉네임은 필수 입력값입니다.");
  } else {
    alert("에러입니다!!!왜죠!!!");
  }
}

async function UserDelete() {
  if (confirm("회원탈퇴 하시겠습니까?")) {
    const response = await fetch(`${backend_base_url}/users/me/modify/`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access"),
        "content-type": "application/json",
      },
    });
    if (response.status == 204) {
      alert("회원탈퇴가 완료되었습니다.");
      location.replace(`${frontend_base_url}/login.html`);
    } else {
      alert("권한이 없습니다.");
    }
  }
}