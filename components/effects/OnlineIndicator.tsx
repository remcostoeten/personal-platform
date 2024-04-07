import React from 'react'

type IndicatorProps = {
        size?: number;
        color?: string;
        style?: React.CSSProperties;
}

export default function OnlineIndicator({size = 4, color = 'emerald', style, ...props}: IndicatorProps) {
    return (
        <div className="flex justify-center items-center" {...props}>
            <div className="relative inline-flex">
                <div className={`w-${size} h-${size} bg-${color}- rounded-full animate-pulse`} style={style}/>
            </div>
        </div>
    )
}