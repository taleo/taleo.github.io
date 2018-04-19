# nicolocarpignoli.github.io
Just a playground for AR.js

## Current working setup for AR.js

Using [AR.js](https://github.com/jeromeetienne/AR.js) we can achieve augmented reality using custom-markers.

The following are workarounds for current known AR.js bugs with custom markers:

- Please use the following attributes and a remote url for the pattern url:

    ```
        <a-marker-camera preset='custom' type="pattern" url='https://raw.githubusercontent.com/nicolocarpignoli/nicolocarpignoli.github.io/master/ar-playground/pattern-marker.patt'>

    ```

**Important**: Images cannot have white/transparent background! Background must be a light grey like rbg(240,240,240) (`F0F0F0`).

[This tool](https://jeromeetienne.github.io/AR.js/three.js/examples/marker-training/examples/generator.html) is used for generate a custom marker from an image. Then the generated marked has to be referenced on the `<a-marker>` element.

## Demo

Visit http://nicolocarpignoli.github.io/ar-playground/index.html; this is the app that contains AR logic and will use the camera. Please visit that on a mobile device.

Print on a paper or show on a screen the custom marker(s). The marker has to be exactly the same that the previously used tool has generated (it has generated a .patt file and and an image to download).

When the camera will focus on the custom marker, the default 3D model will appear.

## Custom Markers

### Pattern Markers

Custom markers **must** be simple symbols or alphanumeric text. They has to be parsed (technically 'trained') by the online tool that, from a given image as input, will outputs a custom marker pattern. Looking at a .patt file it's possible to see the pattern that has been created from the original image.

Background of input image has to be light grey and not white or transparent (like `F0F0F0`).

Useful links for markers: 
- https://github.com/jeromeetienne/AR.js/issues/234
- https://aframe.io/blog/arjs/#customize-your-marker

### Barcode Markers

Markers can also be barcodes. An example is provided in `index.html`. Barcodes represent a number as a symbol based on a matrix. It is better to choose barcodes with a matrix that has the highest level of hamming distance (see [this table](https://github.com/artoolkit/artoolkit-docs/blob/master/3_Marker_Training/marker_barcode.md)). 

Barcodes markers, based on their matrix, have a specified and variable maximum number of possible generated markers.

- Barcode marker generator: http://au.gmented.com/app/marker/marker.php
- Important informations on barcode markers: https://github.com/artoolkit/artoolkit-docs/blob/master/3_Marker_Training/marker_barcode.md

