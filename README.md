# Setup steps to test app locally

Youtube video for running locally from scratch: https://www.youtube.com/watch?v=8d5XSXsjJ7U

## Getting started

### Need Node and npm on computer.
Install them before starting...


### Install Expo globally.

- If you have installed React on the machine separately, uninstall it. Expo install its own React that it uses Open command line as administrator.

npm install -g expo-cli

Create a folder to use for the setup. Create folder named "expenciv".

- cd into the directory

cd …\expenciv

### Start a new expo project 
expo init --npm
- npm  tells it to use npm as package manager. Otherwise it may default to yarn if the machine has it or if it’s Mac

It will then ask you what to call your app. Enter the name "expenciv-app" and hit enter.

It will then ask what template you want to use. Always use the first template blank__. We don’t want minimal or typescript.

When it’s done installing dependencies and the project app is created, it will list some options on how to start the app.
Go into the folder first
cd expenciv-app
Now to start the project use one of both:

expo start
npm start

If Expo project is running okay, time to install all dependencies for this project.

## Packages to install as dependencies

### Commands + links to packages:

npm i expo-sqlite
https://www.npmjs.com/package/expo-sqlite?activeTab=readme

npx expo install expo-linear-gradient
https://docs.expo.dev/versions/latest/sdk/linear-gradient/

npx expo install react-native-screens
https://docs.expo.dev/versions/latest/sdk/screens/

npm i react-native-chart-kit
https://www.npmjs.com/package/react-native-chart-kit

npm install @react-navigation/stack
https://reactnavigation.org/docs/stack-navigator/

npx expo install react-native-gesture-handler
https://reactnavigation.org/docs/stack-navigator/#installation

npm i react-native-reanimated
https://www.npmjs.com/package/react-native-reanimated

npm i react-native-svg-charts
https://www.npmjs.com/package/react-native-svg-charts?activeTab=readme

npm install @react-navigation/native
https://reactnavigation.org/docs/getting-started/

npm i react-native-picker-select
https://www.npmjs.com/package/react-native-picker-select

npm i react-native-sqlite-storage
https://www.npmjs.com/package/react-native-sqlite-storage

npm i react-native-haptic-feedback
https://www.npmjs.com/package/react-native-haptic-feedback

npm i react-native-safe-area-context
https://www.npmjs.com/package/react-native-safe-area-context

npx expo install @react-native-masked-view/masked-view
https://docs.expo.dev/versions/latest/sdk/masked-view/

npm i @react-native-async-storage/async-storage
https://www.npmjs.com/package/@react-native-async-storage/async-storage

npx expo install react-native-svg
https://docs.expo.dev/versions/latest/sdk/svg/


## Download app files
After the package dependncies are installed, time to replace files from the default Expo project with the Expenciv app files.

- Delete existing default App.js and Assets folder.
- Download all files from the expo snack for the Expence app - https://snack.expo.dev/@kliment/expense-tracker.
- Unzip files locally and go inside folder at App.js level directory.
- From the unzipped downloaded files from Expo, to the new local env Expo directory where we just installed the dependencies, copy paste the following files and folders:
App.js
readme.md 
assets (folder)
components (folder)
screens (folder)
functions (folder)

The original package.json of the newly created folder on your PC should be still there, just the App.js and folder files should be new in that folder.

## Run it
Now time to run it locally.
Command line go to the App.js directory like before and run expo start again:
- expo start

On a browser tab, the app should now be running and the Login screen should be visible. 




# Jest testing
these steps below are only if you want to setup Jest testing

## Files
To perform Jest testing, some files are created, and existinf files have imports commented out or variables set as constant, for the purpose of running tests.
Therefore, users that wish to run Jest tests should use the files in the jest_filesystem folder only. It is a duplicate of the whole project, but with the changes made to the files.

## These versions are for Jest testing
if packages version dont match with expo on local
do these

npm i react-native-reanimated@~3.3.0  
npm i @react-native-async-storage/async-storage@1.18.2
npm i react-native-safe-area-context@4.6.3


For testing on local
npx expo install jest-expo jest
https://docs.expo.dev/develop/unit-testing/

then add this to the package.json
"jest": {
    "preset": "jest-expo/universal"
  },
  universal means the tests will be available across all 4 platforms

npm install jest jest-expo react-native-testing-library

then add "test":"jest" to scripts so that 
"scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "test": "jest"
  },


Follow the Jest setup from here https://docs.expo.dev/develop/unit-testing/

Then to get AsyncStorage mock working with Jest, follow this setup: https://react-native-async-storage.github.io/async-storage/docs/advanced/jest/


