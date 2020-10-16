import axios from "axios";

let commentList = document.getElementById("jsCommentList");
const addCommentForm = document.getElementById("jsAddComment");
const commentNumber = document.getElementById("jsCommentNumber");
const videoId = window.location.href.split("/videos/")[1];
const delBtns = document.querySelectorAll(".deleteComment");
const li = document.querySelector("li");

const increaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
};

const decreaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) - 1;
};

const addComment = (comment, data) => {
  const li = document.createElement("li");
  const span = document.createElement("span");
  const delBtn = document.createElement("button");
  const column1 = document.createElement("div");
  const column2 = document.createElement("div");
  const img = document.createElement("img");
  const a = document.createElement("a");
  column1.classList.add("comment__column");
  column2.classList.add("comment__column");
  span.innerHTML = comment;
  delBtn.innerHTML = "×";
  delBtn.classList.add("deleteComment");
  delBtn.id = data._id;
  delBtn.addEventListener("click", handleDelete);
  img.src = data.creator.avatarUrl;
  img.classList.add("u-avatar");
  a.innerText = data.creator.name;
  a.href = `/users/${data.creator._id}`;
  a.classList.add("creator");
  li.appendChild(column1);
  li.appendChild(column2);
  column1.appendChild(img);
  column1.appendChild(a);
  column2.appendChild(span);
  column2.appendChild(delBtn);
  commentList.prepend(li);
  increaseNumber();
};

const sendComment = async (comment) => {
  const response = await axios({
    url: `/api/${videoId}/comment`,
    method: "POST",
    data: {
      comment,
    },
  });
  console.log(response);
  const { data } = response;
  if (response.status === 200) {
    addComment(comment, data);
  }
};

const deleteComment = (event) => {
  const btn = event.target;
  const div = btn.parentNode;
  const li = div.parentNode;
  commentList = li.parentNode;
  commentList.removeChild(li);
  decreaseNumber();
};

const handleDelete = async (event) => {
  const {
    target: { id: commentId },
  } = event;
  const response = await axios({
    url: `/api/${videoId}/deleteComment`,
    method: "POST",
    data: { commentId },
  });
  console.log(response);
  if (response.status === 200) {
    deleteComment(event);
  }
};

const handleSubmit = (event) => {
  event.preventDefault();
  const commentInput = addCommentForm.querySelector("input");
  const comment = commentInput.value;
  sendComment(comment);
  commentInput.value = "";
};

const init = () => {
  addCommentForm.addEventListener("submit", handleSubmit);
  if (li) {
    delBtns.forEach((btn) => {
      btn.addEventListener("click", handleDelete);
    });
  }
};
if (addCommentForm) {
  init();
}
