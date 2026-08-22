const plurals = new Intl.PluralRules("en");

/**
 * "1 case", "4 cases", "2 subsets" — Intl picks the plural category; the word
 * forms stay ours, since no Intl API inflects nouns.
 */
export const count = (n: number, singular: string, plural = `${singular}s`) =>
	`${n} ${plurals.select(n) === "one" ? singular : plural}`;
