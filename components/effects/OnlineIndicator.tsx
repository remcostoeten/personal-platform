type IndicatorProps = {
    size?: number;
    color?: string;
    style?: React.CSSProperties;
    bg?: string;
};

export default function OnlineIndicator({
    size = 4,
    color = "emerald",
    lastSeen,
    style,
    bg = "bg-emerald-400",
    ...props
}: IndicatorProps & { lastSeen?: Date | string }) {
    return (
        <div className="flex justify-center items-center" {...props}>
            <div className="relative inline-flex">
                <div
                    className={`w-${size} h-${size} ${bg} rounded-full animate-pulse`}
                    style={style}
                />
                {lastSeen && <span className="text-xs">{formatLastSeen(lastSeen)}</span>}
            </div>
        </div>
    );
}