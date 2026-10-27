// Типограф: обрабатывает только текст между тегами (атрибуты, <script>, <style> не трогает).
// RU: неразрывный пробел после предлогов, союзов, частиц, коротких местоимений и числительных, перед тире,
//     между числом и словом/единицей, перед «же/ли/бы»; EN: после артиклей, коротких предлогов и связок, перед тире,
//     между числом и словом.
const NB = ' ';
const RU_SHORT = 'а|в|во|и|к|ко|о|об|обо|с|со|у|я|не|ни|но|на|по|за|из|изо|от|до|для|без|при|про|над|под|вне|что|как|или|ли|да|' +
  'он|она|оно|они|мы|вы|ты|им|их|ее|её|его|ей|ему|мне|моя|мой|мои|наш|ваш|это|эта|эти|эту|все|всё|вся|где|кто|так|уже|чем|тем|нет|' +
  'два|две|три|раз';
const EN_SHORT = 'a|an|the|I|of|to|in|on|at|by|for|and|or|as|if|vs\\.?|with|from|into|per|is|it|my|we|no|so|be|not|but|its|our|your';

// Слово привязывается к следующему. Проход повторяем для цепочек («и в», «of the»):
// пробел перед вторым словом уже занят первым совпадением.
const bind = (t, words, quotes) => {
  const re = new RegExp(`(^|[\\s(${quotes}"${NB}—])(${words}) (?=\\S)`, 'gi');
  return t.replace(re, `$1$2${NB}`).replace(re, `$1$2${NB}`);
};

const ruRules = (t) => bind(t, RU_SHORT, '«„')
  .replace(/ (же|ли|ль|бы|б)(?=[\s.,!?;:)»]|$)/g, `${NB}$1`)
  .replace(/(\d) (?=[^\s\d–—-])/g, `$1${NB}`)
  .replace(/ (—|–)(?= )/g, `${NB}$1`)
  .replace(/(№|§) (?=\d)/g, `$1${NB}`);

const enRules = (t) => bind(t, EN_SHORT, '“')
  .replace(/(\d) (?=[^\s\d–—-])/g, `$1${NB}`)
  .replace(/ (—|–)(?= )/g, `${NB}$1`);

export function typograph(html, lang = 'ru') {
  const rules = lang === 'ru' ? ruRules : enRules;
  let skip = 0;
  return html.split(/(<[^>]+>)/).map((part) => {
    if (part.startsWith('<')) {
      if (/^<(script|style)\b/i.test(part)) skip++;
      else if (/^<\/(script|style)/i.test(part)) skip = Math.max(0, skip - 1);
      return part;
    }
    return skip || !part.trim() ? part : rules(part);
  }).join('');
}
