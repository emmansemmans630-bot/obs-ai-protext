export interface BibleVersion {
  id: string;
  name: string;
  language: string;
}

export interface Scripture {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export const BIBLE_VERSIONS: BibleVersion[] = [
  { id: 'kjv', name: 'King James Version', language: 'English' },
  { id: 'niv', name: 'New International Version', language: 'English' },
  { id: 'esv', name: 'English Standard Version', language: 'English' },
  { id: 'nlt', name: 'New Living Translation', language: 'English' },
  { id: 'nkjv', name: 'New King James Version', language: 'English' },
  { id: 'nasb', name: 'New American Standard Bible', language: 'English' },
  { id: 'rsv', name: 'Revised Standard Version', language: 'English' },
  { id: 'asv', name: 'American Standard Version', language: 'English' },
  { id: 'bbe', name: 'Bible in Basic English', language: 'English' },
  { id: 'web', name: 'World English Bible', language: 'English' },
];

export const MOCK_VERSES: Record<string, Scripture[]> = {
  'Genesis 1:1': [
    { book: 'Genesis', chapter: 1, verse: 1, text: 'In the beginning God created the heaven and the earth.' },
  ],
  'John 3:16': [
    { book: 'John', chapter: 3, verse: 16, text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.' },
  ],
  'Psalm 23:1': [
    { book: 'Psalm', chapter: 23, verse: 1, text: 'The LORD is my shepherd; I shall not want.' },
  ],
  'Philippians 4:13': [
    { book: 'Philippians', chapter: 4, verse: 13, text: 'I can do all things through Christ which strengtheneth me.' },
  ],
  'Romans 8:28': [
    { book: 'Romans', chapter: 8, verse: 28, text: 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.' },
  ],
};

export function getScripture(reference: string): Scripture | null {
  const verses = MOCK_VERSES[reference];
  return verses ? verses[0] : null;
}
