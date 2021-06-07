window.addEventListener('DOMContentLoaded', () => {
   getImageAsync()
})

const catPic = document.querySelector('.cat-pic')
const newPicBtn = document.querySelector('#new-pic')
const upVoteBtn = document.querySelector('#upvote')
const downVoteBtn = document.querySelector('#downvote')
const userComment = document.querySelector('#user-comment')
const submitBtn = document.querySelector('#submit-btn')
const loader = document.querySelector('.loader')
const errorDiv = document.querySelector('.error')
const scoreDiv = document.querySelector('.score')
const commentSection = document.querySelector('.comments')

const updateImage = async (data) => catPic.src = data.src
const updateError = async (errText) => errorDiv.innerText = errText


const errorHandling = res => {
  alert('Something went wrong! Please try again!')
  updateError(res.statusText)
  throw Error(res.statusText)
}

const voteResHandler = async res => {
  if (!res.ok) errorHandling(res)
  const data = await res.json();
  scoreDiv.innerText = data.score;
}

const myOption = {
  method: 'PATCH',
  header: {
    "Content-Type": "application/json"
  }
}

const getImageAsync = async () => {
  loader.innerText = 'loading'
  const res = await fetch('/kitten/image')

  if (!res.ok) errorHandling(res)

  const data = await res.json()
  updateImage(data)
  loader.innerText = ''
}

const upVote = async () => {
  const res = await fetch(`/kitten/upvote`, myOption)
  await voteResHandler(res)
}

const downVote = async () => {
  const res = await fetch(`/kitten/downvote`, myOption)
  await voteResHandler(res)
}


const commentHandler = async (e) => {
  e.preventDefault();

  const res = await fetch('/kitten/comments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      comment: userComment.value.toString()
    })
  })

  userComment.value = ''

  if (!res.ok) errorHandling(res)
  const data = await res.json()

  updateComments(data)
}

const updateComments = data => {
  console.log('updating comments');
  const commentArr = data.comments
  commentSection.innerHTML = ''
  commentArr.forEach((comment, commentId) => {
    const wrapperDiv = document.createElement('div')
    wrapperDiv.classList.add('comment-wrapper')
    wrapperDiv.innerHTML =
      `<span class='comment-span'>${comment}</span>
      <button value='${commentId}'  class='comment__delete-btn'>delete</button>`;
    commentSection.appendChild(wrapperDiv)
  });
}



const deleteCommentHandler = async (event) => {
  console.log('deleting comments');
  const id = event.target.value

  const res = await fetch(`/kitten/comments/${id}`, {
    method: 'DELETE'
  })
  if (!res.ok) errorHandling(res)
  const data = await res.json();
  updateComments(data)
}


newPicBtn.addEventListener('click', getImageAsync)
upVoteBtn.addEventListener('click', upVote)
downVoteBtn.addEventListener('click', downVote)
submitBtn.addEventListener('click', commentHandler)
commentSection.addEventListener('click', deleteCommentHandler)