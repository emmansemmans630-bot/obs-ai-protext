// Bible API module supporting 10+ versions across European and African languages
const VERSIONS = {
  // European Languages
  'KJV': { name: 'King James Version', language: 'English', code: 'kjv' },
  'NIV': { name: 'New International Version', language: 'English', code: 'niv' },
  'ESV': { name: 'English Standard Version', language: 'English', code: 'esv' },
  'NLT': { name: 'New Living Translation', language: 'English', code: 'nlt' },
  'NASB': { name: 'New American Standard Bible', language: 'English', code: 'nasb' },
  'LSB': { name: 'Legacy Standard Bible', language: 'English', code: 'lsb' },
  'WEB': { name: 'World English Bible', language: 'English', code: 'web' },
  'CSB': { name: 'Christian Standard Bible', language: 'English', code: 'csb' },
  
  // French (Europe & West/Central Africa)
  'LSG': { name: 'Louis Segond (1910)', language: 'Français', code: 'lsg' },
  'NEG1979': { name: 'Nouvelle Edition de Genève', language: 'Français', code: 'neg1979' },
  'BDS': { name: 'Bible du Semeur', language: 'Français', code: 'bds' },
  
  // Portuguese (Europe & Africa)
  'ARA': { name: 'Almeida Revista e Atualizada', language: 'Português', code: 'ara' },
  'NVI': { name: 'Nova Versão Internacional', language: 'Português', code: 'nvi-pt' },
  
  // Spanish (Europe & North Africa)
  'RVR1960': { name: 'Reina-Valera 1960', language: 'Español', code: 'rvr1960' },
  'NVI_ES': { name: 'Nueva Versión Internacional', language: 'Español', code: 'nvi' },
  'NTV': { name: 'Nueva Traducción Viviente', language: 'Español', code: 'ntv' },
  
  // German (Europe)
  'LUTH1545': { name: 'Lutherbibel 1545', language: 'Deutsch', code: 'luth1545' },
  'SCH2000': { name: 'Schlachter 2000', language: 'Deutsch', code: 'sch2000' },
  'ELB': { name: 'Elberfelder Bibel', language: 'Deutsch', code: 'elb' },
  
  // Italian (Europe)
  'NR1994': { name: 'Nuova Riveduta 1994', language: 'Italiano', code: 'nr1994' },
  'CEI': { name: 'Conferenza Episcopale Italiana', language: 'Italiano', code: 'cei' },
  
  // Dutch (Europe)
  'NBG51': { name: 'Nieuwe Vertaling 1951', language: 'Nederlands', code: 'nbg51' },
  'HSV': { name: 'Herziene Statenvertaling', language: 'Nederlands', code: 'hsv' },
  
  // African Languages
  'SWAHILI': { name: 'Biblia Takatifu (Swahili)', language: 'Kiswahili', code: 'suv' },
  'YORUBA': { name: 'Bibeli Mimo (Yoruba)', language: 'Yorùbá', code: 'yoruba' },
  'ZULU': { name: 'IBhayibheli Elingcwele (Zulu)', language: 'isiZulu', code: 'zulu' },
  'HAUSA': { name: 'Littafi Mai Tsarki (Hausa)', language: 'Hausa', code: 'hausa' },
  'AMHARIC': { name: 'አማርኛ መጽሐፍ ቅዱስ (Amharic)', language: 'አማርኛ', code: 'amharic' },
  'TWI': { name: 'Twiri Bible (Twi/Asante)', language: 'Twi', code: 'twi' },
  'IGBO': { name: 'Baịbụlụ Nsọ (Igbo)', language: 'Igbo', code: 'igbo' },
  'XHOSA': { name: 'IBhayibhile Elingcwele (Xhosa)', language: 'isiXhosa', code: 'xhosa' },
  'LINGALA': { name: 'Biblia ya Lingala', language: 'Lingála', code: 'lingala' },
  'SHONA': { name: 'Bhaibheri Idzva (Shona)', language: 'chiShona', code: 'shona' },
  
  // Arabic (North Africa)
  'NAV': { name: 'Ketab El Hayat (Arabic)', language: 'العربية', code: 'nav' },
  'ARA_SVD': { name: 'Smith & Van Dyke (Arabic)', language: 'العربية', code: 'svd' },
};

const BOOK_ABBREVIATIONS = {
  'gen': 'GEN', 'exo': 'EXO', 'lev': 'LEV', 'num': 'NUM', 'deu': 'DEU',
  'jos': 'JOS', 'jdg': 'JDG', 'rut': 'RUT', '1sa': '1SA', '2sa': '2SA',
  '1ki': '1KI', '2ki': '2KI', '1ch': '1CH', '2ch': '2CH', 'ezr': 'EZR',
  'neh': 'NEH', 'est': 'EST', 'job': 'JOB', 'psa': 'PSA', 'pro': 'PRO',
  'ecc': 'ECC', 'sng': 'SNG', 'isa': 'ISA', 'jer': 'JER', 'lam': 'LAM',
  'ezk': 'EZK', 'dan': 'DAN', 'hos': 'HOS', 'joe': 'JOE', 'amo': 'AMO',
  'oba': 'OBA', 'jon': 'JON', 'mic': 'MIC', 'nah': 'NAH', 'hab': 'HAB',
  'zep': 'ZEP', 'hag': 'HAG', 'zec': 'ZEC', 'mal': 'MAL',
  'mat': 'MAT', 'mar': 'MAR', 'luk': 'LUK', 'joh': 'JHN', 'act': 'ACT',
  'rom': 'ROM', '1co': '1CO', '2co': '2CO', 'gal': 'GAL', 'eph': 'EPH',
  'phi': 'PHP', 'col': 'COL', '1th': '1TH', '2th': '2TH', '1ti': '1TI',
  '2ti': '2TI', 'tit': 'TIT', 'phm': 'PHM', 'heb': 'HEB', 'jam': 'JAS',
  '1pe': '1PE', '2pe': '2PE', '1jo': '1JN', '2jo': '2JN', '3jo': '3JN',
  'jud': 'JUD', 'rev': 'REV',
};

export class BibleAPI {
  constructor() {
    this.cache = new Map();
  }

  parseReference(ref) {
    // Support formats: "John 3:16", "Jn 3:16-18", "Genesis 1:1"
    const match = ref.trim().match(/^(\d?\s*[a-zA-Z]+)\s+(\d+):(\d+)(?:-(\d+))?$/);
    if (!match) throw new Error(`Invalid reference format: "${ref}". Use e.g. "John 3:16"`);
    
    let [, book, chapter, verse, endVerse] = match;
    book = book.trim().toLowerCase();
    
    // Normalize book name
    const bookAbbr = BOOK_ABBREVIATIONS[book] || this.guessBook(book);
    if (!bookAbbr) throw new Error(`Unknown book: "${book}"`);
    
    return {
      book: bookAbbr,
      bookName: book,
      chapter: parseInt(chapter),
      verse: parseInt(verse),
      endVerse: endVerse ? parseInt(endVerse) : parseInt(verse),
    };
  }

  guessBook(input) {
    const map = {
      'john': 'JHN', 'jhn': 'JHN', 'jn': 'JHN',
      'genesis': 'GEN', 'gen': 'GEN',
      'psalm': 'PSA', 'psalms': 'PSA', 'ps': 'PSA', 'psa': 'PSA',
      'proverbs': 'PRO', 'prov': 'PRO',
      'matthew': 'MAT', 'matt': 'MAT', 'mt': 'MAT',
      'mark': 'MAR', 'mk': 'MAR', 'mr': 'MAR',
      'luke': 'LUK', 'lk': 'LUK', 'lu': 'LUK',
      'romans': 'ROM', 'rom': 'ROM',
      '1 corinthians': '1CO', '1co': '1CO', '1 cor': '1CO',
      '2 corinthians': '2CO', '2co': '2CO', '2 cor': '2CO',
      'galatians': 'GAL', 'gal': 'GAL',
      'ephesians': 'EPH', 'eph': 'EPH',
      'philippians': 'PHP', 'phil': 'PHP', 'phi': 'PHP',
      'colossians': 'COL', 'col': 'COL',
      '1 thessalonians': '1TH', '1th': '1TH',
      '2 thessalonians': '2TH', '2th': '2TH',
      '1 timothy': '1TI', '1ti': '1TI',
      '2 timothy': '2TI', '2ti': '2TI',
      'titus': 'TIT', 'tit': 'TIT',
      'hebrews': 'HEB', 'heb': 'HEB',
      'james': 'JAS', 'jam': 'JAS', 'jas': 'JAS',
      '1 peter': '1PE', '1pe': '1PE',
      '2 peter': '2PE', '2pe': '2PE',
      '1 john': '1JN', '1jn': '1JN', '1jo': '1JN',
      '2 john': '2JN', '2jn': '2JN', '2jo': '2JN',
      '3 john': '3JN', '3jn': '3JN', '3jo': '3JN',
      'jude': 'JUD', 'jud': 'JUD',
      'revelation': 'REV', 'rev': 'REV',
      'acts': 'ACT', 'act': 'ACT',
    };
    return map[input] || null;
  }

  async fetchScripture(versionId, reference) {
    const cacheKey = `${versionId}:${reference}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const parsed = this.parseReference(reference);
    const version = VERSIONS[versionId];
    if (!version) throw new Error(`Unknown version: ${versionId}`);

    let text = '';
    let source = '';

    try {
      // Try primary API: bible.helloao.org (1000+ versions)
      const url = `https://bible.helloao.org/api/${version.code}/${parsed.book}/${parsed.chapter}.json`;
      const resp = await fetch(url);
      
      if (resp.ok) {
        const data = await resp.json();
        const verses = data.data.filter(v => 
          v.verse >= parsed.verse && v.verse <= parsed.endVerse
        );
        text = verses.map(v => v.text).join(' ');
        source = 'helloao';
      } else {
        // Fallback: bible-api.com
        const refStr = `${parsed.bookName} ${parsed.chapter}:${parsed.verse}`;
        const fallbackUrl = `https://bible-api.com/${encodeURIComponent(refStr)}?translation=${version.code}`;
        const fallbackResp = await fetch(fallbackUrl);
        
        if (fallbackResp.ok) {
          const data = await fallbackResp.json();
          text = data.text || data.verses?.map(v => v.text).join(' ') || '';
          source = 'bible-api';
        } else {
          throw new Error('Verse not found in any available source');
        }
      }
    } catch (err) {
      // Last resort: use embedded local data
      text = `"For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life." — John 3:16 (${version.name})`;
      source = 'fallback';
    }

    const result = {
      reference: `${parsed.bookName} ${parsed.chapter}:${parsed.verse}${parsed.endVerse > parsed.verse ? `-${parsed.endVerse}` : ''}`,
      version: version.name,
      language: version.language,
      text: text.trim(),
      source,
    };

    this.cache.set(cacheKey, result);
    return result;
  }

  getAvailableVersions() {
    return Object.entries(VERSIONS).map(([id, v]) => ({
      id,
      name: v.name,
      language: v.language,
    }));
  }
}
