import get from 'lodash/get';
import set from 'lodash/set';
import { TALLLanguages } from '~/locale';
import { MDToHTMLString } from './MDToHTMLString';

/**
 * This is a list of keys which contain markdown syntax
 */
const MARKDOWN_KEYS = [
  'regionaal_index.belangrijk_bericht',
  'veiligheidsregio_index.selecteer_toelichting',
  'veiligheidsregio_index.belangrijk_bericht',
  'over_risiconiveaus.toelichting',
  'over_beschrijving.text',
  'over_veelgestelde_vragen.vragen[].antwoord',
  'verantwoording.cijfers[].verantwoording',
];

export function parseMarkdownInLocale(text: TALLLanguages) {
  const textClone = JSON.parse(JSON.stringify(text)) as TALLLanguages;

  MARKDOWN_KEYS.forEach((key) => replaceWithMarkdown(textClone, key));

  return textClone;
}

function replaceWithMarkdown<T extends Record<string, unknown>>(
  object: T | T[],
  path: string
) {
  if (Array.isArray(object)) {
    object.forEach((obj) => replaceWithMarkdown(obj, path));
    return;
  }

  if (path.includes('[].')) {
    const [key, ...paths] = path.split('[].');
    replaceWithMarkdown(
      get(object, key) as Record<string, unknown>,
      paths.join('[].')
    );
    return;
  }

  const value = get(object, path) as string | undefined;

  if (value) {
    set(object, path, MDToHTMLString(value));
  }
}
