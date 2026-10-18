# scoria の導入と依存更新

## 方針
- GUIChatPluginSpreadsheet と同じ形で scoria を入れる
  - devDependencies に `scoria`、`yarn quality`（= `scoria`）で走らせる
  - `scoria.config.json`（profile: library / stacks: vue, ts / mode: report）と `.scoria/baseline.json` を commit する
  - CI は `.github/workflows/scoria.yml`。計測ジョブは読み取り権限のみ、SARIF のアップロードは `security-events: write` を持つ別ジョブ
- 依存は `yarn upgrade --latest`。TypeScript は方針どおり `~6.0.3` に据え置く

## Node の版
- scoria は `engines: node >=24`。Yarn v1 は engines 不一致で install を失敗させるので、このパッケージも `engines: node >=24` とし、CI の行列は Node 24.x / 26.x にする

## Spreadsheet と違うところ
- このリポにはテストが無いので `test:coverage`（c8）と scoria.yml の coverage 手順は入れない。scoria の test-coverage は「coverage 無し」として報告される

## 受け入れたこと
- scoria → jscpd → fast-glob → micromatch → braces に High の警告（GHSA-vfj7-8cjw-p6xm）。修正版が未公開なので今は消せない。開発依存なので利用者には届かない
