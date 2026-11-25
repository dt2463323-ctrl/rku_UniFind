import type en from "../en/matches";

export default {
  "matches.title": "スマートマッチング",
  "matches.back": "戻る",
  "matches.hero.none": "まだマッチはありません",
  "matches.hero.lost": "マッチが見つかったかもしれません！",
  "matches.hero.found": "持ち主がいるかもしれません！",
  "matches.hero.body": "カテゴリ、場所、日付、投稿内の言葉を比較しています。",
  "matches.source.lost": "あなたの落とし物",
  "matches.source.found": "この拾得物",
  "matches.count.lostOne": "似ている拾得物の届け出が1件あります",
  "matches.count.lostMany": "似ている拾得物の届け出が{count}件あります",
  "matches.count.foundOne": "似ている落とし物の届け出が1件あります",
  "matches.count.foundMany": "似ている落とし物の届け出が{count}件あります",
  "matches.empty.lost":
    "まだ近いものはありません。似た拾得物が届け出されたらすぐにお知らせします。",
  "matches.empty.found":
    "まだ近いものはありません。似た落とし物が届け出されたらすぐにお知らせします。",
  "matches.browseAll": "すべてのアイテムを見る",

  "matches.level.strong": "強いマッチ",
  "matches.level.good": "よいマッチ",
  "matches.level.possible": "マッチの可能性",
  "matches.similarity": "類似度",

  "matches.reason.category": "同じカテゴリ",
  "matches.reason.place": "同じ場所",
  "matches.reason.sameDay": "同じ日",
  "matches.reason.dayApart": "1日違い",
  "matches.reason.daysApart": "{count}日違い",
  "matches.reason.words": "共通の言葉：{words}",
} satisfies Record<keyof typeof en, string>;
