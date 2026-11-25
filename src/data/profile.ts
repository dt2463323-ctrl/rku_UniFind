import type { TKey } from '../i18n'

// Demo signed-in student.
export const student = {
  name: 'Ha Nhi',
  studentId: '2411839',
}

export const savedItemIds = ['airpods-case', 'silver-key-ring', 'black-strap-watch']

export const savedSearches = ['headphones', 'Keys', 'blue keychain']

export const faqs = [1, 2, 3, 4].map((n) => ({
  q: `profile.faq${n}.q` as TKey,
  a: `profile.faq${n}.a` as TKey,
}))
