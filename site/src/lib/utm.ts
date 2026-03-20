export type UTMValues = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

export function readUTMFromSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): UTMValues {
  const get = (key: keyof UTMValues) => {
    const v = searchParams[key];
    if (typeof v === "string") return v;
    return undefined;
  };

  return {
    utm_source: get("utm_source"),
    utm_medium: get("utm_medium"),
    utm_campaign: get("utm_campaign"),
    utm_content: get("utm_content"),
    utm_term: get("utm_term"),
  };
}

export function toUTMRecord(utm: UTMValues) {
  return {
    utm_source: utm.utm_source ?? null,
    utm_medium: utm.utm_medium ?? null,
    utm_campaign: utm.utm_campaign ?? null,
    utm_content: utm.utm_content ?? null,
    utm_term: utm.utm_term ?? null,
  };
}

