import {signup,emailconfirm} from './api.js'

window.onload = async function(){
    document.getElementById('signup').addEventListener('click', async function(){
        signup();
    })
    
    document.getElementById('verify').addEventListener('click', async function(){
        emailconfirm();
    })
}