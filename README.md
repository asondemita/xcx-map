# 地図 (Map)

地理院タイル（国土地理院の地図タイル）を使って、Scratch のステージに地図を描く [Xcratch](https://xcratch.github.io/) 拡張です。

[geolonia/x-geo-scratch](https://github.com/geolonia/x-geo-scratch) と同じ「ラスタタイルをステージへ直接描く」軽量方式ですが、地図ソースを **国土地理院の地理院タイル** に置き換えることで、**APIキー不要・ドメイン制限なし**でどのウェブサイトからでも無料で使えます（出典の明記が条件）。日本国内の地図に特化しています。

地図は `renderer.createBitmapSkin()` でステージの背面レイヤーに描かれるため、スプライトは地図の上に重なって表示されます。

## ✨ できること（ブロック一覧）

**地図の表示・移動・ズーム**
- `緯度 () 経度 () ズーム () の地図を表示する`
- `緯度 () 経度 () に地図を動かす`
- `ズームを () にする` / `ズームを () ずつ変える`

**地図の種類の切替**
- `地図の種類を () にする` … 標準地図 / 淡色地図 / 空中写真 / 色別標高図

**地図の状態**
- `地図の中心の緯度` / `地図の中心の経度` / `地図のズーム`

**座標 ⇔ 緯度経度の変換**（スプライトを緯度経度で配置／読み取り）
- `経度 () の x座標` / `緯度 () の y座標`
- `x座標 () の経度` / `y座標 () の緯度`

**現在地・距離・標高**
- `現在地を取得する` → `現在地の緯度` / `現在地の経度`（端末の位置情報。HTTPSと許可が必要）
- `緯度 () 経度 () から 緯度 () 経度 () までの距離(km)`（ハバーサイン）
- `緯度 () 経度 () の標高(m)`（地理院 標高API）

## 🗾 地図データの出典

このプロジェクトは [地理院タイル](https://maps.gsi.go.jp/development/ichiran.html) を利用しています。利用にあたっては国土地理院の[利用規約](https://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html)に従い、**出典「国土地理院」の明記**が必要です（本拡張は地図右下に自動で表示します）。標高は[標高を求めるプログラム](https://maps.gsi.go.jp/development/elevation_s.html)を利用しています。

## ✨ What You Can Do With This Extension

Play [Example Project](https://xcratch.github.io/editor/#https://tfabworks.github.io/xcx-map/projects/example.sb3) to look at what you can do with "地図 (Map)" extension. 
<iframe src="https://xcratch.github.io/editor/player#https://tfabworks.github.io/xcx-map/projects/example.sb3" width="540px" height="460px"></iframe>


## How to Use in Xcratch

This extension can be used with other extension in [Xcratch](https://xcratch.github.io/). 
1. Open [Xcratch Editor](https://xcratch.github.io/editor)
2. Click 'Add Extension' button
3. Select 'Extension Loader' extension
4. Type the module URL in the input field 
```
https://tfabworks.github.io/xcx-map/dist/gsiMap.mjs
```
5. Click 'OK' button
6. Now you can use the blocks of this extension


## Development

### Install Dependencies

```sh
npm install
```

### Setup Development Environment

Change ```vmSrcOrg``` to your local ```scratch-vm``` directory in ```./scripts/setup-dev.js``` then run setup-dev script to setup development environment.

```sh
npm run setup-dev
```

### Install xcratch-skills via APM

Install [APM (Agent Package Manager)](https://github.com/microsoft/apm) and run:

```sh
apm install --target copilot
```

This automatically configures the skills across your agent clients. Once installed, you can use natural-language trigger phrases such as:

| Trigger phrase | Skill invoked |
|---|---|
| `xcratch-create`, `scaffold extension` | `xcratch-extension-create` — scaffold a new extension repo and set up the dev environment |
| `breakpoints not hit`, `debug on dev-server` | `xcratch-extension-debug` — fix source maps and local HTTPS issues |
| `verify extension loads`, `check console errors` | `xcratch-extension-debug-auto` — autonomously navigate to the editor and inspect the loaded extension |
| `add to stretch3`, `stretch3-install` | `xcratch-extension-stretch3` — generate the stretch3 install script and entry files |

### Bundle into a Module

Run build script to bundle this extension into a module file which could be loaded on Xcratch.

```sh
npm run build
```

### Watch and Bundle

Run watch script to watch the changes of source files and bundle automatically.

```sh
npm run watch
```

### Test

Run test script to test this extension.

```sh
npm run test
```

### Versioning and Deployment

This project uses npm version commands and GitHub Actions for versioning and deployment.

#### Create a New Version

Use npm version command to update the version number. This will automatically:
1. Update version in `package.json`
2. Run the build script
3. Create version-specific build files in `dist/{version}/`
4. Update `dist/versions.json` with the new version info
5. Create a git commit and tag

```sh
# Patch version (1.3.0 → 1.3.1)
npm version patch

# Minor version (1.3.1 → 1.4.0)
npm version minor

# Major version (1.4.0 → 2.0.0)
npm version major
```

#### Deploy to GitHub Pages

After creating a new version, push the tag to trigger automatic deployment:

```sh
# Push the version tag
git push origin v1.4.0

# Or push all tags
git push --tags
```

The GitHub Actions workflow will:
1. Build the extension
2. Deploy `dist/`, `projects/`, and `README.md` to GitHub Pages

You can also manually trigger deployment from the Actions tab in GitHub.

#### Version Information

All build versions are recorded in `dist/versions.json`:

```json
{
  "extensionId": "gsiMap",
  "latest": "1.0.0",
  "versions": [
    {
      "version": "1.0.0",
      "buildDate": "2025-10-19T12:34:56.789Z",
      "module": "1.0.0/gsiMap.mjs"
    }
  ]
}
```


## 🏠 Home Page

Open this page from [https://tfabworks.github.io/xcx-map/](https://tfabworks.github.io/xcx-map/)


## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/tfabworks/xcx-map/issues). 
