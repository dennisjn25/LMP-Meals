/**
 * Generates an SVG path string for a sparkline based on an array of numbers.
 * @param data Array of numerical values to plot
 * @param width Viewbox width (default: 100)
 * @param height Viewbox height (default: 30)
 * @returns SVG path string (e.g. "M 0 10 L 10 20 ...")
 */
export function generateSparklinePath(data: number[], width: number = 100, height: number = 30): string {
    if (data.length === 0) return "";

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const stepX = width / (data.length - 1);

    // Leaving 5px padding top/bottom to prevent clipping
    const padding = 5;
    const drawHeight = height - (padding * 2);

    return data.map((val, i) => {
        const x = i * stepX;
        const y = height - padding - ((val - min) / range) * drawHeight;
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    }).join(" ");
}

/**
 * Formats a duration in seconds into a human-readable string (e.g. "3m 45s")
 */
export function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
}

/**
 * Formats a number for display (e.g. 12500 -> "12.5k")
 */
export function formatMetricValue(value: number): string {
    if (value >= 1000000) return (value / 1000000).toFixed(1) + "M";
    if (value >= 1000) return (value / 1000).toFixed(1) + "k";
    return value.toString();
}
