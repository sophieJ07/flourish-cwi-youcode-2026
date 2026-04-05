/** Build `/staff/dashboard?...` preserving tab filters and setting shelter. */
export function staffDashboardQuery(params: {
  shelterId: string;
  term?: string;
  range?: string;
  lrange?: string;
}): string {
  const p = new URLSearchParams();
  p.set("shelter", params.shelterId);
  if (params.term) p.set("term", params.term);
  if (params.range) p.set("range", params.range);
  if (params.lrange) p.set("lrange", params.lrange);
  return `/staff/dashboard?${p.toString()}`;
}
