## MMM-Echo

Face detection based on Adam Geitgeys Python module [face_recognition](https://github.com/ageitgey/face_recognition).

MagicMirror extension based on [MMM-Facial-Recognition](https://github.com/paviro/MMM-Facial-Recognition).

### Why a new extension?

MMM-Facial-Recognition is based on OpenCV and needs training from a large set of images of the user. This extension does not rely on OpenCV and Haar cascade training. A simple image of your face from the front is enough for this extension to work.

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

Then for the rest of the extensions in config.js, configure a class for the visiblity of the module

    {
        module: "MMM-Example",
        position: "top_left",
        classes: "Alice"
    }

The classes are either

    "user" (e.g. "Alice"), to be shown only for the specified user
    "everyone", to be shown to everyone
    "default", to be shown to strangers

