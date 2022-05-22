# Netflip

Netflip is a workhome base on the amazing Netflix app.

## Installation

```bash
yarn install
```

## Running Local

Use [Expo](https://docs.expo.dev/get-started/installation/)

```bash
expo start -c
```
## Release Channel
Use Expo Go for start the [release channel](https://expo.dev/@flipexpo/netflip?serviceType=classic&distribution=expo-go&release-channel=netflip_alfa)

## Release APK
Install apk

[How to install apk on Android (pt-BR)](https://canaltech.com.br/android/como-instalar-um-apk-no-android/)

## For Push Notifications Teste

Token: `ExponentPushToken[user_token]`

Data Json 
```json
  { 
      "type": "ShowMovie", 
      "navigateTo": "Home", 
      "params": 
        { 
          "imdbID": "tt5206260"
        }
}
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
