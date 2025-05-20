const form = document.getElementById('form')
const firstName = document.getElementById('firstName')
const lastName = document.getElementById('lastName')
const email = document.getElementById('email')
const password = document.getElementById('password')
const phoneNumber = document.getElementById('phoneNumber') 
const error_message = document.getElementById('error_message')//add a <P> bfore the form and make it red

form.addEventListener('submit',(e)=>{
    
    let errors = []
    if(firstName){
        errors = getSignUperrors(firstName.value ,lastName.value ,email.value, password.value, phoneNumber.value)
    }else{
        errors = getSignInerrors(email.value, password.value)
    }
    if(errors.length>0){
        e.preventDefault()
        error_message.innerText = errors.join(". ")
    }

})

//signup errors
function getSignUperrors(firstname, lastname, email, password, phoneNumber){
    let errors=[]
    //the name
    if(!firstname.trim()){
        errors.push('First Name is Required')
    }
    if(firstname.length<2){
        errors.push('First Name needs to be longer')
    }

    //lname
    if(!lastname.trim()){
        errors.push('Last Name is Required')
    }
    if(lastname.length<2){
        errors.push('Last Name needs to be longer')
    }

    //email
    if(!email.trim()){
        errors.push('Email is Required')
    }
    if (!email.includes('@') || email.startsWith('@') || email.endsWith('@')) {
        errors.push("Please enter a valid email")
      }
    if (email.includes(' ')) {
        errors.push("Email can't contain spaces")
    }

    //password
    if(!password.trim()){
        errors.push('Password is Required')
    }
    if(password.length < 8){
        errors.push('Enter a longer password')
    }
    if (password.includes(' ')) {
        errors.push("Password can't contain spaces")
    }
    //security
    if (!/[A-Z]/.test(password)) {
        errors.push("Password must include at least one uppercase letter")
      }
      if (!/[a-z]/.test(password)) {
        errors.push("Password must include at least one lowercase letter")
      }
      if (!/[0-9]/.test(password)) {
        errors.push("Password must include at least one number")
      }
    //phoneNumber
    if(!phoneNumber.trim()){
        errors.push('Phone Number is Required')
    }
    if (phoneNumber.length<11) {
        errors.push("Please enter a valid Phone Number")
      }
    if (phoneNumber.includes(' ')) {
        errors.push("Phone Number can't contain spaces")
    }



    return errors
}

//signin errors
function getSignInerrors(email, password){
    let errors=[]
    //for the password
    if(!password.trim()){
        errors.push('Password is Required')
    }
    if(password.length < 8){
        errors.push('Enter a longer password')
    }
    if (password.includes(' ')) {
        errors.push("Password can't contain spaces.")
    }
    //for the email
    if(!email.trim()){
        errors.push('Email is Required')
    }
    if (!email.includes('@') || email.startsWith('@') || email.endsWith('@')) {
        errors.push("Please enter a valid email")
      }
    if (email.includes(' ')) {
        errors.push("Email can't contain spaces")
    }


    return errors
}



//remove the errors
const allInputs =[firstName, lastName, email, password, phoneNumber]
allInputs.forEach((input) =>{
    if(input){
        input.addEventListener('input', ()=>{
            if(error_message.innerText !== ''){
             error_message.innerText = ''
            }

        })
    }
   
})




