// Same rule as the be body schema, so anything accepted here also saves.
const DOMAIN_REGEX = /^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/;

// The API stores the value as-is and matches it against the part after "@" of
// an email, so pasted emails, URLs and "www." forms must be reduced to the bare domain.
export const normalizeDomain = (input: string): string => {
  let domain = input.trim().toLowerCase();
  // URL parts first, so an "@" in a path or query can't pick the domain.
  domain = domain.replace(/^https?:\/\//, "").split(/[/?#]/)[0];
  const at = domain.lastIndexOf("@");
  if (at !== -1) {
    // An email's domain is matched exactly, "www." included.
    return domain.slice(at + 1);
  }
  return domain.replace(/^www\./, "");
};

export const isValidDomain = (domain: string): boolean => domain.length <= 253 && DOMAIN_REGEX.test(domain);
