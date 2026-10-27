// Типограф: обрабатывает только текст между тегами (атрибуты, <script>, <style> не трогает).
// RU: неразрывный пробел после предлогов/союзов/частиц из 1–3 букв, перед тире, между числом и словом/единицей,
//     перед «же/ли/бы»; EN: после a/an/the/I и коротких предлогов, перед тире, между числом и словом.
const NB = ' ';
const RU_SHORT = 'а|в|во|и|к|ко|о|об|обо|с|со|у|я|не|ни|но|на|по|за|из|изо|от|до|для|без|при|про|над|под|что|как|или|ли|да';
const EN_SHORT = 'a|an|the|I|of|to|in|on|at|by|for|and|or|as|if|vs\\.?|with|from|into|per';

const ruRules = (t) => t
  .replace(new RegExp(`(^|[\\s(«„" —])(${RU_SHORT}) (?=\\S)`, 'gi'), `$1$2${NB}`)
  .replace(new RegExp(`(^|[\\s(«„" —])(${RU_SHORT}) (?=\\S)`, 'gi'), `$1$2${NB}`) // повтор для цепочек «и в»
  .replace(/ (же|ли|ль|бы|б)(?=[\s.,!?;:)»]|$)/g, `${NB}$1`)
  .replace(/(\d) (?=[^\s\d–—-])/g, `$1${NB}`)
  .replace(/ (—|–)(?= )/g, `${NB}$1`)
  .replace(/(№|§) (?=\d)/g, `$1${NB}`);

const enRules = (t) => t
  .replace(new RegExp(`(^|[\\s(“" —])(${EN_SHORT}) (?=\\S)`, 'g'), `$1$2${NB}`)
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
