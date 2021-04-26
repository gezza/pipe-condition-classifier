let model;
let currentYear = new Date().getFullYear()
let yearBuilt = document.getElementById('yearBuilt')
let fileUpload = document.getElementById('uploadImage')
let resultRow = document.getElementById('resultRow')
let recBlock = document.getElementById('recBlock')
let proof = document.getElementById('proof')
let img = document.getElementById("image")
let agree = document.getElementById("agree")
let disagree = document.getElementById("disagree")
let prediction = document.querySelector('.pred_class')
let boxResult = document.querySelector('.box-result')
let agreeRadioButtons = document.querySelector('.agreeRadioButtons')
let recommendation = document.querySelector('.recommendation')
let houseAgeCategory = "none"
let recommendations = {
    "all-good": "Everything is in order!",
    "bad-15to20": "Can only write with $2,500 AOP or Exclude, Limit Water or FLO.",
    "bad-21plus": "Can only write with Water Excluded, or FLO."
};

/*let progressBar = 
    new ProgressBar.Circle('#progress', {
    color: 'limegreen',
    strokeWidth: 10,
    duration: 2000, // milliseconds
    easing: 'easeInOut'
});*/

async function initialize() {
    document.querySelector('.filename').innerHTML = "Image name: " + fileUpload.files[0].name;

    let status = document.querySelector('.init_status')
    status.innerHTML = 'Loading Model .... <span class="fa fa-spinner fa-spin"></span>'

    model = await tf.loadLayersModel('./models/tfjs/model.json');

    status.innerHTML = 'Model Loaded Successfully  <span class="fa fa-check"></span>'
}

async function predict() {
    let img = document.getElementById('image')
    agree.checked = false
    disagree.checked = false

    let offset = tf.scalar(255)
    let tensorImg = tf.browser.fromPixels(img).resizeNearestNeighbor([150, 150]).toFloat().expandDims();
    let tensorImg_scaled = tensorImg.div(offset)

    predicted_class = await model.predict(tensorImg_scaled).data();
    // prediction = await model.predict(tensorImg).data();

    // predicted_class = tf.argMax(prediction)

    if (predicted_class[0] > 0.3) {
        prediction.innerHTML = "GOOD";
        prediction.style.color = "green";
    }
    else {
        prediction.innerHTML = "BAD";
        prediction.style.color = "red";
    }

    document.querySelector('.agreeRadioButtons').style.display = "block";

    // document.querySelector('.inner').innerHTML = `${parseFloat(prediction[class_idx]*100).toFixed(2)}% SURE`
    console.log(predicted_class)

    // TODO
    // progressBar.animate(prediction[class_idx]-0.005); // percent
}


fileUpload.addEventListener('change', function(e){

    let file = this.files[0]
    if (file){
        boxResult.style.display = 'block'
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.addEventListener("load", function(){

            img.setAttribute('src', this.result);
        });
    }

    else{
        img.setAttribute("src", "");
    }

    initialize().then( () => { 
        predict()
    })
})

proof.addEventListener('change', function(e){
    agree.checked = false
    disagree.checked = false

    if (proof.options[proof.selectedIndex].value == "customer-pics") {
        document.querySelector(".upload-btn-wrapper").style.display = 'block';
        recBlock.style.display = 'none';
        resultRow.style.display = 'flex'
    }
    else {
        document.querySelector(".upload-btn-wrapper").style.display = 'none';
        recBlock.style.display = 'block';
        resultRow.style.display = 'none'
        recommendation.innerHTML = recommendations["all-good"]
    }
})

yearBuilt.addEventListener('change', function(e){
    agree.checked = false
    disagree.checked = false

    console.log(currentYear)
    console.log(yearBuilt.value)
    if (currentYear - yearBuilt.value > 20) {
        houseAgeCategory = "21plus"
    }
    else if (currentYear - yearBuilt.value > 14) {
        houseAgeCategory = "15to20"
    }
    else {
        houseAgeCategory = "new"
    }
    console.log(houseAgeCategory)
})

agreeRadioButtons.addEventListener('change', function(e){
    recBlock.style.display = 'block';
    console.log(prediction.innerHTML)
    if ((prediction.innerHTML == "GOOD" && agree.checked == true) ||
        (prediction.innerHTML == "BAD" && disagree.checked == true) 
    ) {
        recommendation.innerHTML = recommendations["all-good"];
    }
    else if (houseAgeCategory == "21plus") {
        recommendation.innerHTML = recommendations["bad-21plus"];
    }
    else if (houseAgeCategory == "15to20") {
        recommendation.innerHTML = recommendations["bad-15to20"];
    }
    else {
        recommendation.innerHTML = "New house with bad pipes in bad condition";
    }
})

window.onload = function(){
    yearBuilt.value = currentYear;
}
