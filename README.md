# Memotea

## インストール
* Node.js - 16系の最新バージョン
* VSCode - 各OSの最新バージョン
<br><br>

## Nodistを使用する場合
* PowerShellに認識
1. PowerShellを右クリックして「管理者として実行」をクリック
2. 「Set-ExecutionPolicy RemoteSigned」コマンドを実行して「Y」を選択
* nodeとnpmを同期
1. 「nodist npm match」コマンドを実行

## プラグイン
VSCode上で以下のプラグインを追加
* Japanese Language Pack for Visual Studio Code - 日本語パック
* Vetur - vueエディター
* EditorConfig for VS Code - コーディングスタイル適用
* ESLint - javascriptリンター（typescript対応）
* stylelint - stylesheetリンター（scss対応）
<br><br>

## 設定
VSCode上で設定を追加
1. メニューから以下の順に選択<br>
ファイル ⇒ ユーザー設定 ⇒ 設定
2. 右上のアイコン（設定(JSON)を開く）をクリック
3. settings.jsonに以下を追記
```
"editor.codeActionsOnSave": {
  "source.fixAll.eslint": true,
  "source.fixAll.stylelint": true,
}
```
※ テキスト保存時に自動で整形が行われるようになる
<br><br>

## Cordova
* JDK8をインストール
* AndroidStudioをインストール
* gradleをインストール（C:\Program Files\Android\Android Studio\gradleにコピー）
* cordovaをインストール（npm install -g cordova）
* 環境変数の設定
1. JAVA_HOME - C:\Program Files\Java\jdk1.8.0_301
2. ANDROID_HOME - C:\Users\user\AppData\Local\Android\Sdk
3. GRADLE_HOME - C:\Program Files\Android\Android Studio\gradle
4. Path - %JAVA_HOME%\bin
          %ANDROID_HOME%\tools
          %ANDROID_HOME%\platform-tools
          %ANDROID_HOME%\build-tools\31.0.0
          %GRADLE_HOME%\gradle-7.2\bin
* AndroidStudioの設定
1. Tools ⇒ SDK Manager ⇒ Android SDK
   SDK Platformsタブ
    Hide Obsolete Packages：チェック無
    Show Package Details：チェック有
     Android 12.0 - Android SDK Platform 31：チェック有
     Android 12.0 - Sources for Android 31：チェック有
   SDK Toolsタブ
    Hide Obsolete Packages：チェック無
    Show Package Details：チェック有
     Android SDK Build-Tools 32rc1 - 31.0.0：チェック有
     Android SDK Tools(Obsolete)：チェック有
2. API31の不具合を調整（ファイル名変更）
   C:\Users\user\AppData\Local\Android\Sdk\build-tools\31.0.0\d8.bat ⇒ dx.bat
   C:\Users\user\AppData\Local\Android\Sdk\build-tools\31.0.0\lib\d8.jar ⇒ dx.jar

## Firebase
* firebase-cliをインストール（npm install -g firebase-tools）
* ログイン（firebase login）

## パッケージ
```
npm install
```

## ビルド
### 開発環境構築
```
npm run serve
```
### 本番資材生成
```
npm run build
```
### アプリ資材生成
```
npm run app
```
### クラウドデプロイ
```
npm run web
```
