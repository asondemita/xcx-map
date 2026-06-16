# 地図

ラスタタイルを Scratch のステージに直接描く [Xcratch](https://xcratch.github.io/) 拡張です。**APIキー不要**で使えます（出典の明記が条件）。

[geolonia/x-geo-scratch](https://github.com/geolonia/x-geo-scratch) と同じ軽量方式で、タイルは **国土地理院（淡色地図・既定）** と **OpenStreetMap 標準（全世界）** をブロックで切り替えられます。既定の淡色地図は**日本国内のみ**で、国外を表示したいときは「地図の種類を標準にする」で OSM に切り替えます。

地図は `renderer.createBitmapSkin()` でステージの背面レイヤーに描かれるため、スプライトは地図の上に重なって表示されます。

## ✨ できること（ブロック一覧）

**地図の表示・移動・ズーム**
- `緯度 () 経度 () の地図を表示する`
- `() の地図を表示する`（地名キーワードで検索して表示。範囲に合わせて自動ズーム）
- `地図の種類を () にする`（`淡色`＝国土地理院/日本のみ・既定／`標準`＝OpenStreetMap/全世界）
- `ズームを () にする` / `ズームを () ずつ変える`
- `地図を横に () ピクセル移動する`（+で東＝右へ）/ `地図を縦に () ピクセル移動する`（+で北＝上へ）
- `地図の透明度を () にする`（0＝不透明〜100＝透明。Scratch の「透明度」効果と同じ）

**ピン・複数地点の表示**（地図上にピンを立て、全部が収まるよう位置とズームを自動調整）
- `緯度 () 経度 () に () のピンを立てる`（色は赤・黄・青・緑・橙・紫・茶・黒から選択）
- `地図の中心に () のピンを立てる`
- `ピンを全て消す`
- `全てのピンが見えるように地図を合わせる`

**現在地・距離**
- `現在位置を表示する`（端末の位置情報を取得し、その地点を地図の中心に表示。HTTPSと許可が必要）
- `緯度 () 経度 () から 緯度 () 経度 () までの距離(km)`（ハバーサイン）

## 🗾 地図データの出典

選択中のタイルに応じて、地図右下に出典を自動表示します。

- **淡色（既定）**: [地理院タイル](https://maps.gsi.go.jp/development/ichiran.html)（国土地理院）。日本国内のみ。
- **標準**: [OpenStreetMap](https://www.openstreetmap.org/) 標準タイル。地図データは © OpenStreetMap contributors（[ODbL](https://www.openstreetmap.org/copyright)）。

### ⚠️ タイル利用についての注意（過剰利用時のブロック）

タイルは国土地理院（`cyberjapandata.gsi.go.jp`）および OpenStreetMap Foundation の公式タイルサーバー（`tile.openstreetmap.org`）から取得しています。OSM 標準タイルは [OpenStreetMap タイル利用ポリシー](https://operations.osmfoundation.org/policies/tiles/)、地理院タイルは [国土地理院の利用規約](https://maps.gsi.go.jp/development/ichiran.html) に従ってください。いずれもボランティア／公共提供のリソースです。

- **過剰・不適切な利用があった場合、予告なくアクセスがブロックされることがあります。** 多人数で同時に大量のタイルを読み込むような使い方（授業での一斉アクセスなど）は、サービスを劣化させ、ブロックの対象となり得ます。
- 本拡張は出典表示・タイルのキャッシュなどポリシー上の要件を満たすように作られていますが、**安定運用・大規模利用が必要な場合は、商用タイルプロバイダ（要APIキー）や自前のタイルサーバーの利用を検討してください。**

### ⚠️ 地名検索（`() の地図を表示する`）について

`() の地図を表示する` ブロックは [OpenStreetMap Nominatim](https://nominatim.openstreetmap.org/) で地名を緯度経度に変換しています。[Nominatim 利用ポリシー](https://operations.osmfoundation.org/policies/nominatim/) により **毎秒1リクエストまで・一括/大量検索は禁止** です。多人数での一斉検索（授業など）はブロック対象になり得ます。安定運用が必要な場合は商用ジオコーダ（要APIキー）の利用を検討してください。

## ✨ What You Can Do With This Extension

Play [Example Project](https://xcratch.github.io/editor/#https://asondemita.github.io/xcx-map/projects/example.sb3) to look at what you can do with "地図" extension. 
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
