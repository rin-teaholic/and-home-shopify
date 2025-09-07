# &home - Shopify Theme

暮らしに「プラス」する家具のECサイト「&home」のShopifyテーマです。

## コンセプト

「&home」は、お客様の暮らしに「プラス」する家具を提供する家具屋さんです。
シンプルで機能的なデザインを心がけ、日常生活をより豊かにする家具を厳選してご提案します。

## 技術スタック

- Shopify Online Store 2.0
- Liquid
- HTML5
- CSS3
- JavaScript (ES6+)
- GitHub Pages (デプロイ)

## 開発環境のセットアップ

1. Node.js (v16以上) をインストール
2. Shopify CLI をインストール
3. 依存関係をインストール

```bash
npm install
```

## 開発コマンド

```bash
# 開発サーバーを起動
npm run dev

# テーマをビルド
npm run build

# Shopifyにデプロイ
npm run deploy

# コードチェック
npm run check

# リント
npm run lint

# フォーマット
npm run format

# テスト実行
npm run test
```

## プロジェクト構造

```
and-home-shopify/
├── assets/           # CSS, JavaScript, 画像ファイル
├── config/           # テーマ設定
├── layout/           # レイアウトファイル
├── locales/          # 翻訳ファイル
├── sections/         # セクションファイル
├── snippets/         # スニペットファイル
├── templates/        # テンプレートファイル
└── blocks/           # ブロックファイル
```

## デプロイ

GitHub Pagesを使用してデプロイします。

## ライセンス

MIT License
