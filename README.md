# EAS Build Notifier

Can be used to get notifications for the following npm scripts `eas-build-post-install` and `eas-build-pre-upload-artifacts` in combination with the Expo EAS build.

If there is an `app.json` file present then this will also be used to get more information.

## Installing

`npm install eas-build-notifier --save-dev`

## Configuration File

```json
{
  "services": [
    {
      "name": "telegram",
      "config": {
        "token": "token",
        "chatID": "chatID",
        "appFullName": "@test/testApp"
      }
    }
  ]
}
```

## Supported platforms

- [x] Telegram

## Telegram Prerequisites

### Retrieve chatId

If you have the HTTP API Token use the following Link to get the chatId:
https://codesandbox.io/s/get-telegram-chat-id-q3qkk

## Example

See [example](example) folder.

## Roadmap

### Add support for the following services

- [ ] Slack
- [ ] Teams
- [ ] Discord

## License

[MIT](LICENSE.md)
