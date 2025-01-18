export function convertFirestoreTimestampToISO(ts: any): string | null {
  if (!ts || typeof ts._seconds !== 'number' || typeof ts._nanoseconds !== 'number') {
    return null;
  }
  const millis = ts._seconds * 1000 + ts._nanoseconds / 1e6;
  return new Date(millis).toISOString();
}