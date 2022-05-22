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
[Install apk](https://expo.dev/accounts/flipexpo/projects/netflip/builds/aa22a6d1-eb1f-4174-9b88-45897bb720ff)

[How to install apk on Android (pt-BR)](https://expo.dev/artifacts/eas/n1wpFwgrQg5XTQyNZK5EGF.apk)

## For Push Notifications Teste

Use this [link](https://expo.dev/notifications)

or use curl or postman/insomnia - replace your $seu_ExpoToken for yours

```bash
curl --request POST \
  --url https://exp.host/--/api/v2/push/send \
  --header 'Content-Type: application/json' \
  --data '{
  "to": "$seu_ExpoToken",
  "title":"hello",
  "body": "world",
	"data": { "type": "ShowMovie", "navigateTo": "Home", "params": { "imdbID": "tt10034790"} }
}'
```

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
