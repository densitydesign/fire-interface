# fire-interface

interface for the fire data collection.

## How to install

It requires bower and NPM.

open the enclosing folder and run:

```
npm install
```

After the process is complete, run:

```
bower install
```

Then build the app:

```
grunt build
```

The results is contained in the `dist` folder.

## Issues

If asked, the required version of Anglular is **1.4.0**

The build process could be stopped by an error triggered by the optimg library.

Before the build, go to the `node_modules` and delete the folder named `imagemin-optipng`

