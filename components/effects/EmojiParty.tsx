'use client'
import { useEffect } from 'react';
import JSConfetti from 'js-confetti'; // Make sure to import JSConfetti package
import { useState } from 'react';

const EmojiParty: React.FC = () => {
    const [jsConfettiInstance, setJsConfettiInstance] = useState<JSConfetti | null>(null);

    useEffect(() => {
        // Initialize jsConfetti when the component mounts
        const confetti = new JSConfetti();
        setJsConfettiInstance(confetti);
    }, []);

    const triggerConfetti = (emoji: string) => {
        // Trigger confetti with the specific emoji
        if (jsConfettiInstance) {
            jsConfettiInstance.addConfetti({
                emojis: [emoji],
                emojiSize: 70,
                confettiNumber: 40,
            });
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-900">
            <div className="flex flex-wrap justify-center gap-10">
                <button className="confettiButton" data-emoji="😎" onClick={() => triggerConfetti("😎")}>
                    😎
                </button>
                <button className="confettiButton" data-emoji="💩" onClick={() => triggerConfetti("💩")}>
                    💩
                </button>
                <button className="confettiButton" data-emoji="🦄" onClick={() => triggerConfetti("🦄")}>
                    🦄
                </button>
                <button className="confettiButton" data-emoji="🌈" onClick={() => triggerConfetti("🌈")}>
                    🌈
                </button>
                <button className="confettiButton" data-emoji="🎉" onClick={() => triggerConfetti("🎉")}>
                    🎉
                </button>
                <button className="confettiButton" data-emoji="🎊" onClick={() => triggerConfetti("🎊")}>
                    🎊
                </button>
                <button className="confettiButton" data-emoji="🍾" onClick={() => triggerConfetti("🍾")}>
                    🍾
                </button>
            </div>
        </div>  
    );
};

export default EmojiParty;
