# 0 秒思考メモ Web アプリ（フロントエンド）

Vue.js で構築した「0 秒思考メモ」アプリのフロントエンドです。  
もともとは Firebase を使用していましたが、**Laravel API によるバックエンドとの連携に置き換える**形で構築し直しています。

---

## Firebase → Laravel API への置き換えについて

当初は Firebase Authentication や Firestore を使用していましたが、  
**API 構築の学習を目的として、Laravel（Sanctum 認証）を使った独自 API へ切り替え**を行いました。

置き換えた主な機能は以下のとおりです：

- ユーザー登録 / ログイン / ログアウト
- トークン管理（Sanctum）
- メモの登録 / 取得 / 削除
- アカウント削除（関連するメモの一括削除を含む）

---

## デプロイについて

このプロジェクトは **Laravel API と Vue.js の構成を学習することを目的としたローカル環境用アプリ**です。  
現在のところ、本番環境へのデプロイは **予定していません**。

---

## リポジトリ構成

このアプリは、以下の 2 つのリポジトリに分かれています：

- `zero-thinking-api`: Laravel API（バックエンド）
- `zero-thinking-ui`: Vue 3（フロントエンド）← このリポジトリ

---

## 使用技術

- Vue 3
- Vite
- Vue Router
- Axios

---

## 環境構築手順

### 1. リポジトリのクローン

```bash
git clone https://github.com/marumaru-3/zero-thinking-ui.git
cd zero-thinking-ui
```

### 2. パッケージのインストール

```bash
npm install
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` にアクセスすれば表示されます。

※ Laravel API 側（`zero-thinking-api`）も別途ローカルで立ち上げておく必要があります。

---

## 📝 備考

- 今後デザインや機能の拡張を予定していますが、あくまで学習用のため構成はシンプルです。
