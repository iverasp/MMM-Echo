#!/usr/bin/python
# coding: utf8

import sys
import json
import time
import signal
import face_recognition
import cv2
import cv2.cv as cv
import config


def to_node(type, message):
    # convert to json and print (node helper will read from stdout)
    try:
        print(json.dumps({type: message}))
    except Exception:
        pass
    # stdout has to be flushed manually to prevent delays in the node helper communication
    sys.stdout.flush()

def shutdown(self, signum):
    to_node('status', 'Shutdown: Cleaning up camera...')
    # Release handle to the webcam
    video_capture.release()
    cv2.destroyAllWindows()
    quit()

signal.signal(signal.SIGINT, shutdown)

to_node('status', 'Face recognizer started...')

video_capture = cv2.VideoCapture(0)
current_user = None
last_user = None
login_timestamp = time.time()
last_seen_timestamp = time.time()
logged_in = False
encodings = []

for user in config.get('users'):
    image = face_recognition.load_image_file(user + '.jpg')
    encodings.append(face_recognition.face_encodings(image)[0])

# Initialize some variables
face_locations = []
face_encodings = []

while True:
    # Grab a single frame of video
    ret, frame = video_capture.read()

    # Resize frame of video to 1/4 size for faster face recognition processing
    small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)

    # Find all the faces and face encodings in the current frame of video
    face_locations = face_recognition.face_locations(small_frame)
    face_encodings = face_recognition.face_encodings(small_frame, face_locations)

    face_names = []
    current_user = None
    for face_encoding in face_encodings:
        # See if the face is a match for the known face(s)
        match = face_recognition.compare_faces(encodings, face_encoding)

        user_matches = [i for i, x in enumerate(match) if x]

        if len(user_matches) is 1:
            current_user = user_matches[0]
        elif len(user_matches) > 1:
            # TODO: found more that one user, what to do?
            current_user = user_matches[0]

    if current_user is not None:
        if current_user == last_user:
            last_seen_timestamp = time.time()
        if last_user is None and logged_in is False:
            to_node('login', {'user': current_user})
            last_user = current_user
            logged_in = True
            last_seen_timestamp = time.time()

    elif current_user is None and logged_in is True:
        if time.time() - last_seen_timestamp > config.get('logoutDelay'):
            to_node('logout', {'user': last_user})
            last_user = None
            logged_in = False

    time.sleep(int(config.get('interval')))
