import type en from "../en/item";

export default {
  "item.gone.title": "この投稿は見つかりません",
  "item.gone.body": "解決済みになったか、投稿者が削除した可能性があります。",
  "item.gone.browse": "アイテムを探す",
  "item.linkCopied": "リンクをコピーしました",
  "item.back": "戻る",
  "item.share": "共有",
  "item.lastSeenAt": "最後に見た場所",
  "item.foundAt": "拾った場所",
  "item.lostOn": "落とした日",
  "item.foundOn": "拾った日",
  "item.nowLabel": "現在の保管場所",
  "item.now.office": "学生課（大学事務室）",
  "item.now.finder": "拾った人が保管",
  "item.description": "説明",
  "item.noDescription": "説明はありません。",
  "item.privacy.lost":
    "持ち主の連絡先は非公開です。UniFindからメッセージを送れます。",
  "item.privacy.found":
    "特徴を1つ非公開にしています。受け取るには先に特徴を説明していただくので、本当の持ち主だけに返却されます。",
  "item.matches.title": "マッチ候補",
  "item.matches.seeAll": "{count}件すべて見る",
  "item.matches.why": "一致の理由",
  "item.matches.none.lost":
    "まだマッチはありません。新しい拾得物の届け出を毎日確認し、見つかればお知らせします。",
  "item.matches.none.found":
    "まだマッチはありません。新しい落とし物の届け出を毎日確認し、見つかればお知らせします。",
  "item.mine": "あなたの投稿です · マイ届け出で管理",
  "item.contact.lost": "拾いました · 持ち主に連絡",
  "item.contact.found": "投稿者に連絡",
  "item.flag.aria": "この投稿を報告",

  "item.contactSheet.msg.found":
    "こんにちは！{location}で拾われた{name}は私のものだと思います。いつ受け取りに行けますか？",
  "item.contactSheet.msg.lost":
    "こんにちは！あなたの{name}を拾ったかもしれません。確認のため、特徴を1つ教えていただけますか？",
  "item.contactSheet.title.verify": "あなたの物ですか？",
  "item.contactSheet.title.sent": "メッセージを送信しました",
  "item.contactSheet.title.message": "投稿者に連絡",
  "item.contactSheet.verify.intro":
    "本当の持ち主を守るため、投稿に載っていない特徴（中身、ステッカー、傷など）を説明してください。回答は拾った人だけに表示されます。",
  "item.contactSheet.proof.label": "持ち主である証明",
  "item.contactSheet.proof.placeholder":
    "例：ふたの内側に猫のステッカーがあります",
  "item.contactSheet.proof.error":
    "拾った人があなたの物だと確認できるよう、もう少し詳しく書いてください。",
  "item.contactSheet.continue": "続ける",
  "item.contactSheet.message.label": "メッセージ",
  "item.contactSheet.message.hint":
    "会うことに同意するまで、学生メールは非公開です。",
  "item.contactSheet.sending": "送信中…",
  "item.contactSheet.send": "メッセージを送信",
  "item.contactSheet.sent.found":
    "拾った人が回答を確認して、まもなく返信します。学生ホールなど、キャンパス内の人目につく場所で会いましょう。",
  "item.contactSheet.sent.lost":
    "持ち主にメッセージが届きます。ご協力ありがとうございます！",
  "item.contactSheet.done": "完了",

  "item.flag.title": "この投稿を報告",
  "item.flag.thanks": "ご報告ありがとうございます",
  "item.flag.thanksBody":
    "UniFindチームが投稿を確認します。投稿者にあなたの名前は伝わりません。",
  "item.flag.reasonAria": "理由",
  "item.flag.reason.false": "虚偽の申告のようです",
  "item.flag.reason.spam": "スパム・偽の投稿",
  "item.flag.reason.inappropriate": "不適切な内容",
  "item.flag.reason.other": "その他",
  "item.flag.send": "報告を送信",
  "item.flag.done": "完了",
} satisfies Record<keyof typeof en, string>;
