const sign_in_btn = document.querySelector('#sign-in-btn')
const sign_up_btn = document.querySelector('#sign-up-btn')
const container_1 = document.querySelector('.container-1')


sign_up_btn.addEventListener('click', () => {
    container_1.classList.add('sign-up-mode')
  })
sign_in_btn.addEventListener('click', () => {
    container_1.classList.remove('sign-up-mode')
  })


