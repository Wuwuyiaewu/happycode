let btn = document.getElementById('btn')
let nav = document.getElementById('nav')

btn.addEventListener('click', () => {
    nav.classList.toggle('active')
    btn.classList.toggle('active')
})