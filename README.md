## MMM-Echo

Face detection based on Adam Geitgeys Python module [face_recognition](https://github.com/ageitgey/face_recognition).

MagicMirror extension based on [MMM-Facial-Recognition](https://github.com/paviro/MMM-Facial-Recognition).

### Why a new extension?

MMM-Facial-Recognition is based on OpenCV and needs training from a large set of images of the user. This extension does not rely on OpenCV and Haar cascade training. A simple image of your face from the front is enough for this extension to work.

### How does it work?

![It uses data](https://imgs.xkcd.com/comics/machine_learning.png)

Explained in [this blog post by Adam Geitgey](https://medium.com/@ageitgey/machine-learning-is-fun-part-4-modern-face-recognition-with-deep-learning-c3cffc121d78).

## Setup

Go to MagicMirror root folder, then

    cd modules
    git clone https://github.com/iverasp/MMM-Echo.git
    cd MMM-Echo
    npm install

OpenCV is needed to get the webcam stream. It should be installed with Python support.

## Usage

Similarly to MMM-Facial-Recognition.

Append the following to MagicMirrors config.js

    {
        module: "MMM-Echo",
        config: {
            interval: 1,
            logoutDelay: 10,
            users: ["Alice", "Bob"]
            defaultClass: "default",
            everyoneClass: "everyone",
            welcomeMessage: true
        }
    }

Then for the rest of the extensions in config.js, configure a class that designates the visibility of the module

    {
        module: "MMM-Example",
        position: "top_left",
        classes: "Alice"
    }

The classes are either

    "user" (e.g. "Alice"), to be shown only for the specified user
    "everyone", to be shown to everyone
    "default", to be shown to strangers

Now get a good image of your face from the front and place it in the "users"-folder.

## License

Needs to inherit the license from face_recgnition and MMM-Facial-Recognition, which is MIT.
