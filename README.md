## Notable commands

```bash
pnpm clean
pnpm i
cd ios && pod install && cd ..
npx expo doctor
npx expo start --tunnel
```

Get device IP

```bash
ifconfig en0 | grep "inet " | awk '{print $2}'
```

# New project walkthrough

- [ ] Update `app.json`
  - [ ] `extra` -> `eas` -> `projectId` (leave as empty string)
  - [ ] name, slug, scheme, bundle identifier
- [ ] `xed ios`. Then run on device. This will register the bundle identifier on Apple's site
- [ ] Update `app.json` -> `ios` -> `appStoreUrl`
- [ ] Update `CONFIG` -> `revenuecat` -> `apiKey` -> `ios`

# EAS

- [ ] Create a new project in expo.dev
- [ ] `eas init --id <project-id-given>`

# UI

https://reactnativereusables.com

# Warning

Don't do the following because we use native modules

```bash
pnpm expo start
```

# Common Issues

Purchase made successfully but nothing showing in `entitlements.active`. `activeSubscriptions` is not empty though:

```json
"entitlements": {
  "active": {},
  "verification": "NOT_REQUESTED",
  "all": {}
},
```

Solution: Attach the products to the entitlements in RC
`https://app.revenuecat.com/projects/2cdc3239/product-catalog/entitlements`

# Pre-release checklist

- Add review prompts during happy paths
- Localization check
- Adjust drip notifications
- Replace `appStoreUrl` in config
