let model;
// let predResult = document.getElementById("result");
let fileUpload = document.getElementById('uploadImage')
let img = document.getElementById("image")  
let boxResult = document.querySelector('.box-result')

let progressBar = 
    new ProgressBar.Circle('#progress', {
    color: 'limegreen',
    strokeWidth: 10,
    duration: 2000, // milliseconds
    easing: 'easeInOut'
});

async function initialize() {
    let status = document.querySelector('.init_status')
    status.innerHTML = 'Loading Model .... <span class="fa fa-spinner fa-spin"></span>'

    model = await tf.loadLayersModel('./models/tfjs/model.json');

    status.innerHTML = 'Model Loaded Successfully  <span class="fa fa-check"></span>'
}

async function predict() {
    let img = document.getElementById('image')
    let offset = tf.scalar(255)
    let tensorImg = tf.browser.fromPixels(img).resizeNearestNeighbor([150, 150]).toFloat().expandDims();
    let tensorImg_scaled = tensorImg.div(offset)

    prediction = await model.predict(tensorImg_scaled).data();
    // prediction = await model.predict(tensorImg).data();

    predicted_class = tf.argMax(prediction)

    // class_idx = Array.from(predicted_class.dataSync())[0]
    document.querySelector('.pred_class').innerHTML = predicted_class; // data[class_idx]
    // document.querySelector('.inner').innerHTML = `${parseFloat(prediction[class_idx]*100).toFixed(2)}% SURE`
    // console.log(data)
    // console.log(data[class_idx])
    console.log(prediction)

    // TODO
    // progressBar.animate(prediction[class_idx]-0.005); // percent

    /*
    if (prediction[0] === 0) {
        predResult.innerHTML = "The pipes look BAD";
    } else if (prediction[0] === 1) {
        predResult.innerHTML = "The pipes look GOOD";
    } else {
        predResult.innerHTML = "Not sure about these";
    }
    */
}

// initialize();

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