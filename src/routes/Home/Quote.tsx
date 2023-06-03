import { Heading, HeadingProps } from '@chakra-ui/react';
import { useMemo } from 'react'

const quotes = [
    "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful. - Albert Schweitzer",
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    "Education is the passport to the future, for tomorrow belongs to those who prepare for it today. - Malcolm X",
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
    "Success is not in what you have, but who you are. - Bo Bennett",
    "The expert in anything was once a beginner. - Helen Hayes",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "You are never too old to set another goal or to dream a new dream. - C.S. Lewis",
    "The harder you work for something, the greater you'll feel when you achieve it. - Unknown",
    "Dream big and dare to fail. - Norman Vaughan",
    "The secret to getting ahead is getting started. - Mark Twain",
    "Success is not just about making money. It's about making a difference. - Unknown",
    "You miss 100% of the shots you don't take. - Wayne Gretzky",
    "The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt",
    "The best way to predict the future is to create it. - Peter Drucker",
    "The only person you should try to be better than is the person you were yesterday. - Unknown",
    "Education is the most powerful weapon which you can use to change the world. - Nelson Mandela",
    "Don't be pushed around by the fears in your mind. Be led by the dreams in your heart. - Roy T. Bennett",
    "Opportunities don't happen. You create them. - Chris Grosser",
    "Success is not the absence of failure; it's the persistence through failure. - Aisha Tyler",
    "The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt",
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "Dream big and dare to fail. - Norman Vaughan",
    "The secret to getting ahead is getting started. - Mark Twain",
    "The best way to predict the future is to create it. - Peter Drucker",
    "The only person you should try to be better than is the person you were yesterday. - Unknown",
    "Don't be pushed around by the fears in your mind. Be led by the dreams in your heart. - Roy T. Bennett",
    "Opportunities don't happen. You create them. - Chris Grosser",
    "Success is not the absence of failure; it's the persistence through failure. - Aisha Tyler"
];

const Quote = ({
    ...props
}: HeadingProps) => {
    const quote = useMemo(() => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
        return randomQuote;
    }, []);

    return <Heading {...props}>{quote}</Heading>;
}

export default Quote