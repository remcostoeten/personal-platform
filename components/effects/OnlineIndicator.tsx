import { dayPeriod } from "@/core/helpers/getCurrentDateTime";

type IndicatorProps = {
    size?: number;
    color?: string;
    style?: React.CSSProperties;
    bg?: string;
    lastSeen?: Date | string;
};

export default function OnlineIndicator({
    size = 4,
    color = "emerald",
    lastSeen,
    style,
    bg = "bg-emerald-400",
    ...props
}: IndicatorProps) {
    return (
        <div className="flex justify-center items-center" {...props}>
            <div className="relative inline-flex">
                <div
                    className={`w-${size} h-${size} ${bg} rounded-full animate-pulse`}
                    style={style}
                />
                {lastSeen && <span className="text-xs">{dayPeriod(lastSeen)}</span>}
            </div>
        </div>
    );
}