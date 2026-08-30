/**
 * Unicode mathematical alphanumeric symbols for LinkedIn rich text formatting.
 * LinkedIn does not support HTML/Markdown, so Unicode mapping is the creator standard.
 */

// Mapping dictionaries
const BOLD_MAP: Record<string, string> = {
  a: '𝗮', b: '𝗯', c: '𝗰', d: '𝗱', e: '𝗲', f: '𝗳', g: '𝗴', h: '𝗵', i: '𝗶', j: '𝗷', k: '𝗸', l: '𝗹', m: '𝗺',
  n: '𝗻', o: '𝗼', p: '𝗽', q: '𝗾', r: '𝗿', s: '𝘀', t: '𝘁', u: '𝘂', v: '𝘃', w: '𝘄', x: '𝘅', y: '𝘆', z: '𝘇',
  A: '𝗔', B: '𝗕', C: '𝗖', D: '𝗗', E: '𝗘', F: '𝗙', G: '𝗚', H: '𝗛', I: '𝗜', J: '𝗝', K: '𝗞', L: '𝗟', M: '𝗠',
  N: '𝗡', O: '𝗢', P: '𝗣', Q: '𝗤', R: '𝗥', S: '𝗦', T: '𝗧', U: '𝗨', V: '𝗩', W: '𝗪', X: '𝗫', Y: '𝗬', Z: '𝗭',
  '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵',
};

const ITALIC_MAP: Record<string, string> = {
  a: '𝘢', b: '𝘣', c: '𝘤', d: '𝘥', e: '𝘦', f: '𝘧', g: '𝘨', h: '𝘩', i: '𝘪', j: '𝘫', k: '𝘬', l: '𝘭', m: '𝘮',
  n: '𝘯', o: '𝘰', p: '𝘱', q: '𝘲', r: '𝘳', s: '𝘴', t: '𝘵', u: '𝘶', v: '𝘷', w: '𝘸', x: '𝘹', y: '𝘺', z: '𝘻',
  A: '𝘈', B: '𝘉', C: '𝘊', D: '𝘋', E: '𝘌', F: '𝘍', G: '𝘎', H: '𝘏', I: '𝘐', J: '𝘑', K: '𝘒', L: '𝘓', M: '𝘔',
  N: '𝘕', O: '𝘖', P: '𝘗', Q: '𝘘', R: '𝘙', S: '𝘚', T: '𝘛', U: '𝘜', V: '𝘝', W: '𝘞', X: '𝘟', Y: '𝘠', Z: '𝘡',
};

const MONO_MAP: Record<string, string> = {
  a: '𝚖', b: '𝚋', c: '𝚌', d: '𝚍', e: '𝚎', f: '𝚏', g: '𝚐', h: '𝚑', i: '𝚒', j: '𝚓', k: '𝚔', l: '𝚕', m: '𝚖',
  n: '𝚗', o: '𝚘', p: '𝚙', q: '𝚚', r: '𝚛', s: '𝚜', t: '𝚝', u: '𝚞', v: '𝚟', w: '𝚠', x: '𝚡', y: '𝚢', z: '𝚣',
  A: '𝙼', B: '𝙱', C: '𝙲', D: '𝙳', E: '𝙴', F: '𝙵', G: '𝙶', H: '𝙷', I: '𝙸', J: '𝙹', K: '𝙺', L: '𝙻', M: '𝙼',
  N: '𝙽', O: '𝙾', P: '𝙿', Q: '𝚀', R: '𝚁', S: '𝚂', T: '𝚃', U: '𝚄', V: '𝚅', W: '𝚆', X: '𝚇', Y: '𝚈', Z: '𝚉',
  '0': '𝟶', '1': '𝟷', '2': '𝟸', '3': '𝟹', '4': '𝟺', '5': '𝟻', '6': '𝟼', '7': '𝟽', '8': '𝟾', '9': '𝟿',
};

// Reverse map to restore plain text
const REVERSE_MAP: Record<string, string> = {};
[BOLD_MAP, ITALIC_MAP, MONO_MAP].forEach((map) => {
  Object.entries(map).forEach(([char, unicode]) => {
    REVERSE_MAP[unicode] = char;
  });
});

export function toBoldUnicode(text: string): string {
  return text
    .split('')
    .map((char) => BOLD_MAP[char] || char)
    .join('');
}

export function toItalicUnicode(text: string): string {
  return text
    .split('')
    .map((char) => ITALIC_MAP[char] || char)
    .join('');
}

export function toMonoUnicode(text: string): string {
  return text
    .split('')
    .map((char) => MONO_MAP[char] || char)
    .join('');
}

export function toUnderlineUnicode(text: string): string {
  // Unicode combining low line
  return text
    .split('')
    .map((char) => (char === '\n' ? '\n' : `${char}\u0332`))
    .join('');
}

export function stripUnicodeFormatting(text: string): string {
  // Remove combining characters like underline
  let cleaned = text.replace(/\u0332/g, '');
  return cleaned
    .split('')
    .map((char) => REVERSE_MAP[char] || char)
    .join('');
}

/**
 * Calculates estimated reading time and Flesch-Kincaid style readability score
 */
export function analyzeContentMetrics(content: string) {
  const characters = content.length;
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const sentences = content.split(/[.!?]+/).filter(Boolean).length || 1;
  const syllables = countTotalSyllables(content);

  // Estimated read time (avg 200 words per minute)
  const readTimeSeconds = Math.max(1, Math.round((words / 200) * 60));
  const readTimeFormatted =
    readTimeSeconds < 60 ? `${readTimeSeconds}s read` : `${Math.ceil(readTimeSeconds / 60)}m read`;

  // Flesch Reading Ease Formula: 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)
  let readabilityScore = 80;
  if (words > 0 && sentences > 0) {
    readabilityScore = Math.round(
      206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / Math.max(words, 1))
    );
    readabilityScore = Math.min(100, Math.max(10, readabilityScore));
  }

  let readabilityLabel = 'Easy';
  let readabilityColor = 'text-emerald-400';
  if (readabilityScore < 50) {
    readabilityLabel = 'Complex';
    readabilityColor = 'text-red-400';
  } else if (readabilityScore < 70) {
    readabilityLabel = 'Standard';
    readabilityColor = 'text-amber-400';
  }

  return {
    characters,
    words,
    readTimeFormatted,
    readabilityScore,
    readabilityLabel,
    readabilityColor,
    desktopCutoff: Math.min(210, characters),
    mobileCutoff: Math.min(140, characters),
  };
}

function countTotalSyllables(text: string): number {
  const words = text.toLowerCase().split(/\s+/).filter(Boolean);
  let total = 0;
  for (const word of words) {
    const cleanWord = word.replace(/[^a-z]/g, '');
    if (cleanWord.length <= 3) {
      total += 1;
      continue;
    }
    const matches = cleanWord.match(/[aeiouy]{1,2}/g);
    total += matches ? matches.length : 1;
  }
  return total || 1;
}
