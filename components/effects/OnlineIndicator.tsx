import React from 'react'

type IndicatorProps = {
        size?: number;
        color?: string;
        bg?: 'bg-red-400' | 'bg-emerald-400';
        style?: React.CSSProperties;
}

export default function OnlineIndicator({size = 4, color = 'emerald', style, bg ='bg-emerald-400', ...props}: IndicatorProps) {
    return (
        <div className="flex justify-center items-center" {...props}>
            <div className="relative inline-flex">
                <div className={`w-${size} h-${size} ${bg} rounded-full animate-pulse`} style={style}/>
            </div>
        </div>
    )
}