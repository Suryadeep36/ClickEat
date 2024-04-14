let password = document.getElementById('floatingPassword')
let confirmPassword = document.getElementById('confirmPassword')
confirmPassword.addEventListener('keydown',()=>{
    setTimeout(()=>{
        if(password.value != confirmPassword.value){
            document.getElementsByTagName('button')[0].classList.add('disabled')
        }
        else{
            document.getElementsByTagName('button')[0].classList.remove('disabled')
        }
    },1)

})
password.addEventListener('keydown',()=>{
    setTimeout(()=>{
        if(password.value != confirmPassword.value){
            document.getElementsByTagName('button')[0].classList.add('disabled')
        }
        else{
            document.getElementsByTagName('button')[0].classList.remove('disabled')
        }
    },1)

})
