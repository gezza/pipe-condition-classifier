import tensorflow as tf
import streamlit as st
import time
import numpy as np 
import cv2

from PIL import Image, ImageOps	
from utils import process_image, prediction_result

model = tf.keras.models.load_model('models/my_model.h5')

"""
# Pipe Condition Classifier
"""

st.write("Gerry Kerley")

st.set_option('deprecation.showfileUploaderEncoding', False)

img = st.file_uploader("Please upload Image", type=["jpeg", "jpg", "png"])

# Display Image
st.write("Uploaded Image")
try:
    img = Image.open(img)
    st.image(img)
    img = process_image(img)
    
    # Prediction
    prediction = prediction_result(model, img)

    # Progress Bar
    my_bar = st.progress(0)
    for percent_complete in range(100):
        time.sleep(0.05)
        my_bar.progress(percent_complete + 1)

	# Output
    st.write("Prediction: {}".format(prediction["pred"]))
    st.write("# Pipe Condition: {}".format(prediction["class"]))
    # st.write("With Accuracy:", prediction["accuracy"],"%")
except AttributeError:
	st.write("No Image Selected")
