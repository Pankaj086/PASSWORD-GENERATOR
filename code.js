let inputSlider = document.querySelector("[data-lengthSlider]");
let lengthDisplay = document.querySelector("[data-lengthNumber]");
let passwordDisplay = document.querySelector("[data-passwordDisplay]");
let copyBtn = document.querySelector("[data-copy]");
let copyMsg = document.querySelector("[data-copyMsg]");
let uppercasecheck = document.querySelector("#uppercase");
let lowercasecheck = document.querySelector("#lowercase");
let numberscheck = document.querySelector("#numbers");
let symbolsCheck = document.querySelector("#symbols");
let indicator = document.querySelector(".data-strength");
let generateBtn = document.querySelector(".generateButton");
let allcheckBox = document.querySelectorAll("input[type=checkbox");
const symbols = "~`!@#$%^&*(){}[]-+/?:;',><.=";

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// gray circle
handleIndicator("white");


// JavaScript code remains unchanged except for the handleSlider function

function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    // const value = (passwordLength - min) * 100 / (max - min);
    const value = ((passwordLength)/inputSlider.max)*100;

    // Adjust the background style to reflect the thumb's position
    inputSlider.style.background = `linear-gradient(to right, var(--vb-violet) ${value}%, var(--lt-violet) ${value}%)`;
}


function handleIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 10px ${color}`;
}


function getRandInt(min,max){
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandNum(){
    return getRandInt(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRandInt(97,122));
}

function generateUpperCase(){
    return String.fromCharCode(getRandInt(65,90));
}

function generateSymbol(){
    let x = symbols.length;
    const ran = getRandInt(0,x);
    return symbols.charAt(ran);
}

function calcStrength(){
    let hasupper = false;
    let haslower = false;
    let hasnumber = false;
    let hassymbol = false;

    let count = 0;
    if(uppercasecheck.checked){
        hasupper = true;
        count+=1;
    }
    if(lowercasecheck.checked){
        haslower = true;
        count+=1;
    }
    if(numberscheck.checked){
        hasnumber = true;
        count+=1;
    }
    if(symbolsCheck.checked){
        hassymbol = true;
        count+=1;
    }

    if(count>=3 && passwordLength>=8){
        handleIndicator("#39FF14");
    }

    else if(count>=2 && passwordLength>=6 || count>=3 && passwordLength>=6 || count>=2 && passwordLength>=8){
        handleIndicator("yellow");
    }

    else if(count==1 && passwordLength<=4) handleIndicator("red");

    else handleIndicator("yellow");


}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch{
        copyMsg.innerText = "Failed";
    }
    // to make copy span invisible
    copyMsg.classList.add("active");

    setTimeout(function(){
        copyMsg.classList.remove("active");
    },2000)
}

function handleCheckBoxChange(){
    checkCount = 0;
    allcheckBox.forEach((checkbox)=>{
        if(checkbox.checked) checkCount+=1;
    })
    // edge case
    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allcheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})


inputSlider.addEventListener('input',(e)=>{
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value) copyContent();
})

generateBtn.addEventListener('click',()=>{
    // if no checkbox are ticked
    if(checkCount<=0) return;
    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    
    // removing old password
    password = "";

    // if(uppercasecheck.checked){
    //     password+=generateUpperCase();
    // }
    // if(lowercasecheck.checked){
    //     password+=generateLowerCase();
    // }
    // if(numberscheck.checked){
    //     password+=generateRandNum();
    // }
    // if(symbolsCheck.checked){
    //     password+=generateSymbol();
    // }

    let funarray = [];
    if(uppercasecheck.checked) funarray.push(generateUpperCase);
    if(lowercasecheck.checked) funarray.push(generateLowerCase);
    if(numberscheck.checked) funarray.push(generateRandNum);
    if(symbolsCheck.checked) funarray.push(generateSymbol);

    // compulsory addition
    for(let i=0;i<funarray.length;i++){
        password += funarray[i]();
    }

    // remaining additon
    for(let i=0;i<passwordLength-funarray.length;i++){
        let randomidx = getRandInt(0,funarray.length);
        password += funarray[randomidx]();
    }

    // shuffle passwod
    function shufflepassword(arr){
        // fisher yates method
        for (let i = arr.length - 1; i > 0; i--){
            
            // Pick a random index from 0 to i inclusive
            let j = Math.floor(Math.random() * (i + 1)); 
        
            // Swap arr[i] with the element 
            // at random index 
            [arr[i], arr[j]] = [arr[j], arr[i]];
        } 

        let str = "";
        arr.forEach((el) => (str+=el)); 
        return str;

    }
    password = shufflepassword(Array.from(password));
    passwordDisplay.value = password;
    calcStrength();
});


