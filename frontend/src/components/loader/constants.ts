export interface LoadingQuote {
  text: string;
  author?: string;
}

export const LOADING_IMAGES = [
  '/loading-images/1.png',
  '/loading-images/2.png',
  '/loading-images/3.png',
  '/loading-images/4.png',
  '/loading-images/5.png',
  '/loading-images/6.png',
  '/loading-images/7.png',
  '/loading-images/8.png',
  '/loading-images/9.png',
] as const;

export const LOADING_QUOTES: LoadingQuote[] = [
  {
    text: 'Within you, there is a stillness and a sanctuary.',
    author: 'Hermann Hesse',
  },
  {
    text: 'The present moment is filled with joy and happiness.',
    author: 'Thich Nhat Hanh',
  },
  {
    text: 'Peace comes from within. Do not seek it without.',
    author: 'Buddha',
  },
  {
    text: 'Breathe. Let go. And remind yourself that this very moment is the only one you know you have for sure.',
  },
  {
    text: 'Nature does not hurry, yet everything is accomplished.',
    author: 'Lao Tzu',
  },
  {
    text: 'In the midst of movement and chaos, keep stillness inside of you.',
    author: 'Deepak Chopra',
  },
  {
    text: 'The mind is everything. What you think you become.',
    author: 'Buddha',
  },
  {
    text: 'Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor.',
    author: 'Thich Nhat Hanh',
  },
  {
    text: 'Adopt the pace of nature: her secret is patience.',
    author: 'Ralph Waldo Emerson',
  },
];

export function getRandomLoadingContent() {
  const imageIndex = Math.floor(Math.random() * LOADING_IMAGES.length);
  const quoteIndex = Math.floor(Math.random() * LOADING_QUOTES.length);
  return {
    image: LOADING_IMAGES[imageIndex],
    quote: LOADING_QUOTES[quoteIndex],
  };
}
