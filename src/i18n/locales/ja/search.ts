import type en from '../en/search'

export default {
  'search.title': '探す',
  'search.placeholder': '落とし物を検索…',
  'search.clear': '検索をクリア',
  'search.location': '場所',
  'search.date': '日付',
  'search.allLocations': 'すべての場所',
  'search.anyTime': 'いつでも',
  'search.today': '今日',
  'search.week': '過去7日間',
  'search.month': '過去30日間',
  'search.loading': '読み込み中…',
  'search.count': '{count}件',
  'search.countOne': '1件',
  'search.clearFilters': 'フィルターをクリア',
  'search.newest': '新しい順',
  'search.oldest': '古い順',
  'search.emptyTitle': 'アイテムが見つかりません',
  'search.emptyBody': '別のキーワードを試すか、フィルターを減らしてみてください。新しい投稿は毎日追加されます！',
} satisfies Record<keyof typeof en, string>
