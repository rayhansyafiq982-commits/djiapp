export function calcPoin(val: Date | string): number {
  let h: number, m: number
  if (val instanceof Date) { h = val.getHours(); m = val.getMinutes() }
  else { const p = String(val).replace(".", ":").split(":"); h = parseInt(p[0]); m = parseInt(p[1]) }
  return Math.max(0, 8 * 60 - (h * 60 + m))
}
export function poinEmoji(p: number): string {
  if (p === 0) return ""; if (p < 10) return "â­ "; if (p < 30) return "â­â­ "; return "ðŸ† "
}
