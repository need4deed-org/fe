// Same rule as the be body schema, so anything accepted here also saves.
const DOMAIN_REGEX = /^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/;

// The API stores the value as-is and matches it against the part after "@" of
// an email, so pasted emails, URLs and "www." forms must be reduced to the bare domain.
export const normalizeDomain = (input: string): string => {
  let domain = input.trim().toLowerCase();
  domain = domain.slice(domain.lastIndexOf("@") + 1);
  domain = domain.replace(/^https?:\/\//, "");
  domain = domain.split(/[/?#]/)[0];
  return domain.replace(/^www\./, "");
};

export const isValidDomain = (domain: string): boolean => domain.length <= 253 && DOMAIN_REGEX.test(domain);
