import { tokens } from "@/lib/design-tokens";

interface SkeletonProps {
    width?: string | number;
    height?: string | number;
    borderRadius?: string | number;
    style?: React.CSSProperties;
    className?: string; // For compatibility
}

export default function Skeleton({ width = '100%', height = '20px', borderRadius = tokens.radius.sm, style }: SkeletonProps) {
    return (
        <div
            className="loading-shimmer"
            style={{
                width,
                height,
                borderRadius,
                background: '#e5e7eb',
                ...style
            }}
        />
    );
}
