# 地図 (Map)

OpenStreetMap の地図タイルを使って、Scratch のステージに地図を描く [Xcratch](https://xcratch.github.io/) 拡張です。

[geolonia/x-geo-scratch](https://github.com/geolonia/x-geo-scratch) と同じ「ラスタタイルをステージへ直接描く」軽量方式ですが、地図ソースを **OpenStreetMap の標準タイル** にすることで、**APIキー不要・ドメイン制限なし**でどのウェブサイトからでも無料で使えます（出典の明記が条件）。

地図は `renderer.createBitmapSkin()` でステージの背面レイヤーに描かれるため、スプライトは地図の上に重なって表示されます。

## ✨ できること（ブロック一覧）

**地図の表示・ズーム**
- `緯度 () 経度 () ズーム () の地図を表示する`
- `ズームを () にする` / `ズームを () ずつ変える`

**ピン・複数地点の表示**（地図上にピンを立て、全部が収まるよう位置とズームを自動調整）
- `地点 緯度 () 経度 () に () のピンを立てる`（地図上にピンを描画。色はカラーセレクターで指定）
- `地点をすべて消す`
- `すべての地点が見えるように地図を合わせる`

**現在地・距離**
- `現在位置を表示する`（端末の位置情報を取得し、その地点を地図の中心に表示）
- `現在地を取得する` → `現在地の緯度` / `現在地の経度`（端末の位置情報。HTTPSと許可が必要）
- `緯度 () 経度 () から 緯度 () 経度 () までの距離(km)`（ハバーサイン）

## 🗾 地図データの出典

このプロジェクトの地図タイルは [OpenStreetMap](https://www.openstreetmap.org/) を利用しています。地図データは © OpenStreetMap contributors（[ODbL](https://www.openstreetmap.org/copyright)）で、**出典「© OpenStreetMap contributors」の明記**が必要です（本拡張は地図右下に自動で表示します）。

### ⚠️ タイル利用についての注意（過剰利用時のブロック）

地図タイルは OpenStreetMap Foundation が運用する公式タイルサーバー（`tile.openstreetmap.org`）から取得しています。これは [OpenStreetMap タイル利用ポリシー](https://operations.osmfoundation.org/policies/tiles/) に基づくボランティア提供のリソースです。

- **過剰・不適切な利用があった場合、予告なくアクセスがブロックされることがあります。** 多人数で同時に大量のタイルを読み込むような使い方（授業での一斉アクセスなど）は、サービスを劣化させ、ブロックの対象となり得ます。
- 本拡張は出典表示・タイルのキャッシュなどポリシー上の要件を満たすように作られていますが、**安定運用・大規模利用が必要な場合は、商用タイルプロバイダ（要APIキー）や自前のタイルサーバーの利用を検討してください。**

## ✨ What You Can Do With This Extension

Play [Example Project](https://xcratch.github.io/editor/#https://asondemita.github.io/xcx-map/projects/example.sb3) to look at what you can do with "地図 (Map)" extension. 
<iframe src="https://xcratch.github.io/editor/player#https://asondemita.github.io/xcx-map/projects/example.sb3" width="540px" height="460px"></iframe>


## How to Use in Xcratch

This extension can be used with other extension in [Xcratch](https://xcratch.github.io/). 
1. Open [Xcratch Editor](https://xcratch.github.io/editor)
2. Click 'Add Extension' button
3. Select 'Extension Loader' extension
4. Type the module URL in the input field 
```
https://asondemita.github.io/xcx-map/dist/map.mjs
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
  "extensionId": "map",
  "latest": "1.0.0",
  "versions": [
    {
      "version": "1.0.0",
      "buildDate": "2025-10-19T12:34:56.789Z",
      "module": "1.0.0/map.mjs"
    }
  ]
}
```


## 🏠 Home Page

Open this page from [https://asondemita.github.io/xcx-map/](https://asondemita.github.io/xcx-map/)


## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/asondemita/xcx-map/issues). 
