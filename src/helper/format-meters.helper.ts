export function formatMeters(cm: number): string {
  return (cm / 100).toFixed(2).replace(/(\.\d)0$/u, '$1');
}
