# Frontend Assignment

## 1. 概要

ページ単位のコンテンツを管理する SPA です。左のサイドバーに全ページが並び、選んだページのタイトルと本文をメインエリアで編集できます。一覧も詳細もすべてバックエンド API から取得し、作成、更新、削除も API 経由で行います。

実装した機能は次のとおりです。

- サイドバーへの全ページ表示とページ選択
- 新規ページ作成とページ削除（削除前に確認あり）
- タイトルと本文をそれぞれ独立して編集、保存
- タイトルと本文のバリデーション
- Loading、Error、Empty State の表示
- API 通信中の操作 disabled
- レスポンシブ対応（Desktop はサイドバー固定、Mobile は Drawer）

画面は課題の DesignSpec（`Design/DesignSpec/index.html`）を見ながら、配色、タイポグラフィ、余白、アイコンを再現しています。

---

## 2. 環境構築

### 前提環境

- Node.js 20.19+ / 22.12+ 以上（Vite 8 の要求バージョン。バックエンドは Node.js 22.5.1 を指定）
- npm

### Backend

課題リポジトリ（<https://github.com/ncdcdev/recruit-frontend>）を clone し、その README の手順どおりに API サーバーを起動します。

```bash
npm install
npm run migration:run
npm run build
npm run start
```

API は `http://localhost:3000` で起動します。API ドキュメント（Swagger）は起動後 `http://localhost:3000/api` から参照できます。DB を初期状態に戻すときは `cp ./data/bk-dev.sqlite ./data/dev.sqlite` を実行します。

### Frontend

```bash
npm install
npm run dev
```

開発サーバーは Vite で起動します。API のベース URL は `VITE_API_BASE_URL` で切り替えられ、未指定なら `http://localhost:3000` を使います。`.env.example` をコピーして用意してください。

```bash
cp .env.example .env
```

### API Client 生成

OpenAPI 定義（`openapi.json`）から、Orval で型と TanStack Query hooks を生成します。

```bash
npm run generate:api
```

出力先は `src/generated/` です（設定は `orval.config.ts`）。API 仕様が変わったら `openapi.json` を差し替えて再生成します。

---

## 3. 動作確認

### 基本操作

Backend と Frontend を起動した状態で、以下を確認できます。

1. ページ一覧の表示。左サイドバーに全ページのタイトルが並びます。
2. ページ選択。一覧のタイトルをクリックするとメインエリアに詳細が表示されます。
3. 新規ページ作成。サイドバー下部の Edit から New page を押し、タイトルと本文を入力して Save します。
4. タイトル編集。メインエリアのタイトル右にある Edit を押し、入力して Save します。
5. 本文編集。本文右の Edit を押し、入力して Save します。
6. ページ削除。Edit で menu_edit にしてから、一覧の削除アイコンをクリックします。
7. 削除確認。削除アイコンを押すと確認ダイアログが出て、削除するで確定、キャンセルで中止できます。
8. API 通信中の disabled。保存、作成、削除の実行中は対象のボタンが押せなくなります。
9. Empty State。ページが 0 件のときは「ページがありません」を表示します。
10. Loading と Error。詳細取得中は「読み込み中...」、失敗時は「読み込みに失敗しました」を表示します。一覧取得に失敗した場合はエラー Toast が出ます。

### レスポンシブ確認

ブレークポイントは Tailwind の `md`（768px）です。ブラウザの幅を変えて以下を確認できます。

- md 以上では、サイドバーが左側に固定表示されます。
- md 未満では、サイドバーが隠れて左上のハンバーガーボタンから Drawer として開きます。
- Drawer 内でページを選ぶと、Drawer が自動的に閉じます。
- Mobile では、通常表示と編集のどちらでも本体と Edit、Cancel、Save が縦に積まれます。Cancel と Save は横並びのままです。
- 狭い幅でも `min-w-0` により横方向にはみ出しません。
- 長いタイトルは、サイドバーと見出しのどちらも `truncate` で省略されます。
- 長い本文は、textarea が `overflow-y-auto` で内部スクロールします。

### テスト

```bash
npm run test:run   # 1回実行（CI 向け）
npm run test       # watch モード
```

### Build

```bash
npm run build      # tsc --noEmit による型チェック後に vite build
npm run preview    # ビルド結果のプレビュー
```

---

## 4. 実装機能

| 機能 | 実装概要 |
| --- | --- |
| サイドバーへの全ページ表示 | 一覧 API の結果を `ContentSidebar` に表示 |
| ページ選択 | 選択した ID の詳細 API を取得しメインエリアへ反映 |
| 新規ページ作成 | 作成フォーム（`ContentEditor` 内 `CreateSection`）から作成 API を呼び出し |
| ページ削除 | 削除アイコン → 確認ダイアログ → 削除 API |
| 削除確認 | `ConfirmDialog`（alertdialog）で誤操作を防止 |
| タイトル編集・保存 | インライン編集 → 更新 API |
| 本文編集・保存 | インライン編集 → 更新 API |
| タイトル / 本文バリデーション | Zod スキーマ（title 1〜50 / body 10〜2000） |
| Loading | 詳細取得中の表示 |
| Error | 詳細取得失敗の表示 + 一覧失敗時の Toast |
| Empty State | 0 件時の案内表示 |
| Mutation 中 disabled | 作成・更新・削除の実行中にボタンを無効化 |
| Responsive | Desktop サイドバー / Mobile Drawer / 縦積みレイアウト |

---

## 5. ライブラリ選定

### 採用ライブラリ一覧

| 技術 | 用途 |
| --- | --- |
| React 19 | UI |
| TypeScript | 型安全性 |
| Vite | 開発環境・ビルド・CSR |
| Tailwind CSS 4 | UI styling |
| TanStack Query | Server State / Query / Mutation |
| Orval | OpenAPI から API hooks 生成 |
| React Hook Form | Form State |
| Zod | Validation |
| Radix UI | Dialog / Toast |
| Vitest | Test runner |
| React Testing Library | UI test |
| Biome | Formatter / Linter |

### React

一覧、詳細、編集、作成、削除と状態が細かく変わる管理画面型の UI です。選択中のページ、編集モード、作成中かどうか、ダイアログの開閉に応じて表示を切り替える必要があるため、状態と UI を宣言的に結びつけられる React を使いました。コンポーネント単位で切り出せることも、今回の評価観点である共通化やコンポーネント化と噛み合います。

### TypeScript

API のレスポンス、フォームの値、コンポーネントの props を型で押さえておくと、API 仕様とのずれや props の渡し漏れがコンパイル時に見つかります。API クライアントは Orval が OpenAPI から型を生成するので、手書きの型とバックエンドの定義が乖離しません。Biome 側でも `noExplicitAny` を error にして、型の抜け道を作らないようにしています。

### Vite / CSR

Next.js のような SSR フレームワークではなく、React と Vite による CSR を選びました。理由は三つあります。

今回作るのは管理画面型のアプリで、検索エンジンからの流入を前提にした公開ページではありません。SEO は要件に含まれていません。

ページ一覧も詳細もすべて API から取得し、ユーザーの操作に応じて表示が変わります。初期 HTML に内容を埋め込む SSR や SSG の利点は、この画面構成では活きにくいと判断しました。

そして実装時間の目安が約 8 時間という条件があります。SSR を入れるとサーバー、データフェッチ層、ハイドレーションまで考える必要が出てくるので、その時間を API 連携、状態管理、UI 実装、デザイン再現に充てるほうが成果物として良くなると考えました。

Next.js を避けたというより、今回の要件と画面特性、実装時間に対して CSR と Vite が噛み合っていたという判断です。開発中の HMR が速く、Vitest とそのまま繋がることも扱いやすさに効いています。

### Tailwind CSS

DesignSpec の配色、タイポグラフィ、余白をマークアップに直接当てながら再現できます。ガイドラインにあるブランドカラー、テキストカラー、フォントサイズは `src/index.css` の `@theme` にまとめ、`text-brand` や `text-title` のようなトークンとして参照しています。デザイン値がコンポーネントごとの CSS ファイルに散らばらず、一箇所を見れば済む状態になりました。細かな調整もユーティリティクラスで完結するので、CSS ファイル自体を増やしていません。

### TanStack Query

一覧と詳細の取得、キャッシュ、再取得を任せています。作成、更新、削除は Mutation として書き、成功後に対象の Query を invalidate して一覧と詳細を最新化します。サーバーのデータと画面の同期を手続き的に書かずに済むので、選択中の ID や編集モードといった UI の状態と、サーバー由来の状態をはっきり分けられました。Orval が TanStack Query 形式で hooks を生成するため、組み合わせも自然です。

### Orval

OpenAPI 定義から `Content`、`CreateContentDTO`、`UpdateContentDTO` といった型と、TanStack Query hooks を生成します。API クライアントを手書きしないことで、仕様と実装のずれを持ち込まずに済みます。HTTP 通信の部分だけは `override.mutator` で自作の `customFetch` に差し替え、エラー処理と 204 応答の扱いを自分で持たせました。生成物は `src/generated/` に隔離し、Biome の lint 対象から外しています。

### React Hook Form / Zod

編集フォームと新規作成フォームの入力状態は React Hook Form が持ち、入力ルールは Zod スキーマとして `schemas/content.ts` にまとめています。サーバー由来の状態とは別のレイヤーに置いたので、入力中の値がサーバーデータと混ざりません。制約は課題仕様どおり、title が 1 文字以上 50 文字以下、body が 10 文字以上 2000 文字以下です。空白だけのタイトルは `trim` 後の長さで弾いています。エラーは入力欄の直下に `role="alert"` 付きで表示します。

### Radix UI

削除確認の Dialog と通知の Toast のように、フォーカス制御、開閉状態の管理、アクセシビリティ属性が必要になる UI にだけ使いました。Button や IconButton まで Radix に寄せていないのは、これらが DesignSpec どおりの見た目と単純なクリック挙動を持つだけで、複雑な制御を必要としないからです。必要な範囲だけ外部の primitive を使い、残りは課題のデザインに合わせた薄い自作コンポーネントにしています。

### Vitest / React Testing Library

テストランナーは Vitest、UI のテストは React Testing Library です。クリックや入力といった実際の操作に近い形で振る舞いを確かめられるので、内部実装ではなく画面の見え方に対してテストを書けます。対象にしたのは、共通 UI（Button、IconButton、ConfirmDialog、Toast）の基本挙動、`AppLayout` の Drawer 開閉、`ContentEditor` の表示分岐（loading、error、empty、編集、作成）とタイトル保存、バリデーションです。壊れたときの影響が大きいフォームと分岐から先に押さえました。

### Biome

フォーマッタ、リンタ、import 整理を Biome ひとつにまとめています。ESLint と Prettier を別々に入れるより設定も実行も単純で、動作も速いためです。`recommended` に加えて `noExplicitAny`、`useConst`、`useImportType` を有効にし、`organizeImports` で import の順序を揃えています。`npm run check` を実行すれば lint、フォーマット、import 整理をまとめて検証できます。

### 採用しなかった技術

#### Next.js / SSR

SEO が要件になく、データはすべて API から取得し、実装時間が約 8 時間という条件では、SSR で初期表示を最適化する利点よりも構成が増える負担のほうが上回ります。CSR を選んだ理由の裏返しです。

#### Storybook

共通 UI コンポーネントは作っていますが、今回の画面は限られていて、コンポーネントの数も多くありません。カタログを整備して維持する手間に対し、この規模で得られるものは小さいと判断し、実際の画面での確認と React Testing Library のテストを優先しました。不要という意味ではなく、今回のスコープでは優先度が低いという判断です。

#### Redux / Context

サーバー由来の状態は TanStack Query が持ち、Feature 内の UI 状態は `useContent` の `useState` で足ります。画面をまたいで状態を共有する場面がないため、グローバルステートの仕組みは入れていません。`src` 配下で `createContext` と `useContext` は使っていません。

#### 独自 API layer

Orval が型付きの hooks を生成し、HTTP 部分も `customFetch` mutator に集約できています。この上にもう一段抽象を重ねても、今回は読む場所が増えるだけだと判断しました。

#### 独自 Error framework

後述のとおり、OpenAPI にはエラーレスポンスの JSON スキーマが定義されていません。形の決まっていないエラーに合わせて仕組みを先に作るのは、今回の API 仕様と規模に対して過剰なので、HTTP ステータスをもとにした処理に留めています。

---

## 6. 設計思想

### プロジェクト構成

```text
src/
├── App.tsx                 # ルート（Content を配置するだけ）
├── main.tsx                # エントリ（QueryClientProvider / StrictMode）
├── index.css               # Tailwind + @theme（DesignSpec のデザイントークン）
├── components/
│   ├── layout/
│   │   └── AppLayout.tsx    # サイドバー / Drawer / メインの骨組み
│   └── ui/                  # 汎用 UI
│       ├── Button.tsx
│       ├── IconButton.tsx
│       ├── ConfirmDialog.tsx
│       └── Toast.tsx
├── features/
│   └── content/
│       ├── Content.tsx      # 画面の Composition
│       ├── index.ts         # Feature の公開エントリ
│       ├── types.ts         # ContentMode などの型
│       ├── components/
│       │   ├── ContentSidebar.tsx
│       │   └── ContentEditor.tsx   # 表示 / タイトル・本文編集 / 新規作成
│       ├── hooks/
│       │   └── useContent.ts       # 状態遷移・API 通信・副作用の集約
│       └── schemas/
│           └── content.ts          # Zod バリデーション
├── lib/
│   ├── api/customFetch.ts  # Orval mutator（fetch + エラー / 204 処理）
│   └── queryClient.ts      # TanStack Query の既定設定
└── generated/              # Orval 生成物（型 + hooks / 手動編集しない）
    ├── endpoints/content/content.ts
    └── model/*.ts
```

（各コンポーネントには同階層に `*.test.tsx` を配置しています。）

### Feature-based Architecture

Content に関わる画面、ロジック、バリデーション、型を `features/content` の下にまとめました。UI は `components`、Feature のロジックは `hooks`、入力ルールは `schemas` と役割で分けているので、機能を追いかけるときに一箇所を見れば済みます。

共通で使い回す UI とレイアウトだけを `components/ui` と `components/layout` に置き、Content の文脈に依存するものは Feature の中に閉じました。ただし今回の規模で Feature をさらに細かく割っても管理する場所が増えるだけなので、Content ひとつにまとめる構成にしています。

### Content.tsx と useContent.ts の責務

#### Content.tsx

画面の組み立てだけを担当します。`AppLayout` を土台に `ContentSidebar`、`ContentEditor`、`ConfirmDialog`、`ToastMessage` を並べ、`useContent` が返す状態とハンドラをそれぞれへ渡します。Drawer の開閉状態はここでは持たず、`AppLayout` の render prop から受け取った `onNavigate` を `ContentSidebar` にそのまま渡しています。

#### useContent.ts

ユーザーの操作をきっかけに起きる状態遷移、API 通信、副作用をまとめたフックです。操作そのものをすべてフックへ移したのではなく、操作の結果として発生する処理を一箇所に集めた、という位置づけになります。扱っているのは次の範囲です。

- 一覧の取得と、選択中 ID に応じた詳細の取得
- ページの選択、新規作成、タイトル更新、本文更新、削除
- 編集モード（`mode`）、新規作成フラグ（`isCreatingNew`）、削除対象、Toast といった UI の状態
- mutation 成功後の選択状態の更新と Query の invalidation
- 一覧取得に失敗したときのエラー Toast

読んだだけでは意図を追いにくい箇所には、コード中に短い日本語コメントを添えました。新規作成を `mode` と分けて持っている理由、削除後に一覧の先頭か null を選ぶ理由、更新で title と body を常に両方送っている理由などです。

### 共通化・コンポーネント化

再利用できそうだという理由だけでは共通化していません。複数箇所で使われていて、責務がはっきりしていて、見た目と挙動を揃える意味があるものに絞りました。

#### 共通 UI（`components`）

- `Button`: variant（primary / secondary / cancel）と size を持つ汎用ボタン。
- `IconButton`: アイコンのみのボタン（削除アイコン等）。
- `ConfirmDialog`: 破壊的操作の確認ダイアログ。
- `Toast`: 成功・失敗の通知。
- `AppLayout`: サイドバー / Drawer / メインの共通レイアウト。

#### Feature 固有 UI（`features/content/components`）

- `ContentSidebar`: 一覧表示・選択・作成/削除トリガ。
- `ContentEditor`: 表示・タイトル/本文のインライン編集・新規作成フォーム（`CreateSection`）。

こちらは Content の文脈に強く依存するため、共通 UI には上げず Feature の中に置いています。

### Server State / Form State

状態は役割ごとに分けています。

- TanStack Query がサーバー由来の状態、つまり一覧と詳細のキャッシュと再取得を持ちます。
- React Hook Form がフォームの入力状態を持ちます。
- Zod が入力ルールを定義します。
- `useContent` が Feature レベルの状態遷移と API 呼び出し、副作用をまとめます。

分けておくことで、サーバーのデータ、入力中の値、UI の一時的な状態が互いに干渉しません。

---

## 7. API 設計

### API 生成

バックエンドの OpenAPI 定義（`openapi.json`）を入力に、Orval が型と TanStack Query hooks を生成します（`npm run generate:api`）。設定は `orval.config.ts` にあり、`client: react-query`、`httpClient: fetch`、`mutator: customFetch` を指定しています。

### Query / Mutation

生成された hooks を `useContent` から呼んでいます。

- 一覧取得: `useContentControllerGetAllContentList`
- 詳細取得: `useContentControllerGetContent`（選択中 ID がある場合のみ `enabled`）
- 作成: `useContentControllerAddContent`
- 更新: `useContentControllerUpdateContent`
- 削除: `useContentControllerDeleteContent`

更新は PUT で title と body の両方を持つため、片方だけを編集した場合も両方を送っています。送らなかった側が意図せず失われるのを避けるためです。

### Query Invalidation

CRUD が成功したら、対象の Query を invalidate して取り直します。

- 作成に成功したら一覧を invalidate し、作ったページを選択状態にします。
- 更新に成功したら一覧と該当詳細（`/content/{id}`）を invalidate します。
- 削除に成功したら一覧を invalidate します。削除したページが選択中だったときは、invalidate 前の一覧をもとに残りの先頭を選び、0 件なら `null` にして Empty State に落とします。

### Error Handling

`openapi.json` には成功時の応答（200、201、204）しか定義されておらず、エラーレスポンスの JSON スキーマがありません。生成された hooks の `TError` も `unknown` のままです。これを前提に、次の範囲で処理しています。

- `customFetch` は `response.ok` が false のとき、HTTP ステータスを持つ `ApiError` を throw します。
- DELETE は 204 が返りボディがないので、`response.json()` を呼ばずに `undefined` を返します。
- 詳細取得の失敗は `ContentEditor` 側のエラー表示、一覧取得と各 mutation の失敗は Toast で知らせます。

形の決まっていないエラーレスポンスに寄せた実装をせず、HTTP ステータスと成否だけを見て必要な範囲に留めています。

---

## 8. フォーム・バリデーション

入力ルールは `schemas/content.ts` に Zod スキーマとしてまとめています。

- title は 1 文字以上 50 文字以下です。加えて `trim` 後の長さが 1 以上であることも見て、空白だけのタイトルを弾いています。`min(1)` だけだと空白のみが通ってしまうためです。
- body は 10 文字以上 2000 文字以下です。
- タイトル編集、本文編集、新規作成で `titleEditSchema`、`bodyEditSchema`、`contentFormSchema` を使い分けています。
- React Hook Form の resolver に Zod を繋ぎ、エラーは該当する入力欄の直下に `role="alert"` 付きで表示します。

フォームの状態はサーバー由来の状態と別に持っているため、入力中の値がそのままサーバーデータへ反映されることはありません。編集フォームは `mode` が切り替わるタイミングで `key` を変えて再マウントし、`defaultValues` を最新の API の値で初期化し直しています。

---

## 9. UI・デザイン

### DesignSpec

`Design/DesignSpec/index.html` と、`preview/` に置かれた各状態のスクリーンショット（default、menu_edit、title_edit、text_edit と、color、text、button のガイドライン）を見ながら実装しました。ブランドカラー、テキストカラー、フォントサイズ、ボタンの形、アイコンを合わせています。デザイントークンは `src/index.css` の `@theme` にまとめました。

### Noto Sans JP

課題の指定どおり Noto Sans JP を使っています。`index.html` で Google Fonts から読み込み、`@theme` の `--font-sans` に設定しました。

### Responsive

レスポンシブ対応として、md（768px）を境にレイアウトを切り替えています。

- md 以上では、サイドバーが左側に固定表示されます。
- md 未満では、サイドバーを隠してハンバーガーボタンから Radix Dialog ベースの Drawer として開きます。
- ページを選ぶと Drawer が閉じます。`ContentSidebar` は Drawer の存在を知らず、汎用の `onNavigate?()` を受け取るだけです。閉じる処理は `AppLayout` が Mobile Drawer 側にだけ渡しています。
- Mobile では本体と Edit、Cancel、Save を `flex-col md:flex-row` で縦に積みます。Cancel と Save の並びは変えていません。
- `min-w-0` を併用して、狭い幅でも横にはみ出さないようにしています。
- 長いタイトルは `truncate` で省略します。
- 編集用の textarea は `overflow-y-auto` で内部スクロールします。

### Accessibility

実装しているのは次の範囲です。

- 削除、メニュー開閉、Drawer と Toast の閉じるといったアイコンボタンに `aria-label` を付けています。
- 装飾目的の画像は `alt=""` と `aria-hidden` にしています。
- フォームのバリデーションエラーには `role="alert"` を付けています。
- 削除確認は `role="alertdialog"`、Drawer には sr-only の `Dialog.Title` を置いています。
- 各ボタンに `focus-visible:outline-*` でフォーカスリングを出しています。
- Dialog と Toast は Radix UI に任せているので、フォーカストラップ、Esc、キーボード操作がそのまま効きます。

---

## 10. 仕様未定義部分への追加実装

課題文には書かれていないものの、実際に触ってみて必要だと感じた部分を補いました。

削除は取り消せない操作なので、確認ダイアログを挟んでいます。削除アイコンは一覧の各行に並ぶため、隣の項目と間違えて押しやすいという事情もあります。

作成、更新、削除の実行中は対象のボタンを disabled にしました。連打すると同じ内容が二重に登録されたり、削除リクエストが重複して飛んだりするためです。

詳細の取得中は読み込み中の表示を出します。何も表示されないと、クリックが効いていないのか通信中なのか区別できません。

一覧や詳細の取得に失敗したとき、各操作が失敗したときは、エラー表示と Toast で伝えています。無言で失敗すると、保存できていないことに気づかないまま作業が進んでしまいます。

ページが 0 件のときは Empty State を出し、どこから新規作成に進めるかまで書いています。空白の画面だけでは次の操作の入口が分かりません。

新規作成はモーダルではなく、メインエリアのインラインフォームにしました。編集時とレイアウトも操作も揃うので、作成と編集で別の使い方を覚える必要がありません。

長いタイトルはサイドバーと見出しの両方で省略しています。DesignSpec に長いタイトルの例がなく、そのまま流すとレイアウトが崩れるためです。

狭い幅ではサイドバーが本文の領域を圧迫するので、Drawer に切り替えました。さらに、ページを選んだあとも Drawer が開いたままだと本文が隠れてしまうため、選択と同時に閉じるようにしています。

---

## 11. テスト

課題ではテストコードが 1 つ以上必須です。実際に書いたのは次の範囲です。

- `ContentEditor.test.tsx`: content が null のときの Empty State、loading、error の表示分岐、content の表示、`title_edit` での入力欄表示、タイトル保存で `onTitleSave` が呼ばれること、空のタイトルではエラーが出て保存されないこと、`isCreatingNew` のときに作成フォームが表示されること。表示分岐とフォームの挙動という中心部分を押さえています。
- `AppLayout.test.tsx`: サイドバーとメインの描画、ハンバーガーボタン、メニューの開閉。レスポンシブ Drawer の骨組みを確認しています。
- 共通 UI（`Button`、`IconButton`、`ConfirmDialog`、`Toast`）: クリック、disabled、variant、開閉、`aria-label` といった基本の挙動。
- `App.test.tsx`: API hooks をモックして、アプリが描画されること（サービス名の表示）を確認しています。

実行方法:

```bash
npm run test:run
```

---

## 12. 課題要件との対応

| 要件 | 対応 |
| --- | --- |
| サイドバーに全ページ表示 | `ContentSidebar` |
| ページ選択 | `ContentSidebar` / `useContent`（詳細取得） |
| 新規ページ作成 | `ContentEditor`（`CreateSection`）/ `useContent` |
| ページ削除 | `ConfirmDialog` / `ContentSidebar` / `useContent` |
| タイトル編集 | `ContentEditor` / `useContent` |
| 本文編集 | `ContentEditor` / `useContent` |
| Validation | `schemas/content.ts`（Zod） |
| Test | Vitest + React Testing Library |
| Responsive| `AppLayout` / `ContentSidebar` / `ContentEditor` |

---

## 13. トレードオフ・スコープ

実装時間の目安が約 8 時間なので、要件を満たすこと、コードを読みやすく保つこと、デザインを再現すること、レスポンシブに対応することへ時間を寄せました。以下は今回の要件と規模に対して優先度が低いと判断して入れていません。手が回らなかったという意味ではありません。

- Next.js / SSR。SEO が不要で、データを API から取得する管理画面なので CSR で足ります。
- Storybook。共通 UI はありますが、この数と規模では導入と運用の手間に見合いません。実画面での確認と React Testing Library のテストを優先しました。
- Redux。画面をまたいだ状態共有がなく、TanStack Query と Feature 内の state で足ります。
- Context。同じ理由で使っていません。
- 独自 API layer。Orval と `customFetch` で済んでいます。
- 独自 Error framework。OpenAPI にエラースキーマがなく、HTTP ステータスを見る形で足ります。
- custom hook の細かい分割。状態遷移を追いやすくするため、あえて `useContent` にまとめています。
- 大規模な Design System。`@theme` のトークンと薄い共通 UI に留めました。
- コンポーネントの過剰な分割。責務が分かれる単位でだけ切り出しています。

---

## 14. 今後の改善余地

- Feature が増えたときの API エラー処理の共通化。ステータスごとのリトライや表示方針を揃える余地があります。
- Playwright などによる E2E テスト。API 連携込みで主要な操作の流れを確認できます。
- UI コンポーネントが増えてきた場合の Storybook 導入によるカタログ化。
