import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FullScreenLoader, Loader } from '@/components/loader';
import {
  getRandomLoadingContent,
  LOADING_IMAGES,
  LOADING_QUOTES,
} from '@/components/loader/constants';

describe('Loader', () => {
  it('should render spinner div', () => {
    const { container } = render(<Loader />);
    expect(container.querySelector('.spinner')).toBeInTheDocument();
  });
});

describe('FullScreenLoader', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
  });

  it('should render loading image', () => {
    render(<FullScreenLoader />);

    const image = screen.getByRole('img', { name: 'Loading' });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/loading-images/1.png');
  });

  it('should render quote text', () => {
    render(<FullScreenLoader />);

    expect(
      screen.getByText(
        `"${LOADING_QUOTES[0].text}"`,
      ),
    ).toBeInTheDocument();
  });

  it('should render author when provided', () => {
    render(<FullScreenLoader />);

    expect(screen.getByText(`— ${LOADING_QUOTES[0].author}`)).toBeInTheDocument();
  });

  it('should render spinner', () => {
    const { container } = render(<FullScreenLoader />);

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should render quote without author when not provided', () => {
    const quoteWithoutAuthor = LOADING_QUOTES.find(q => !q.author);
    if (!quoteWithoutAuthor) return;

    const quoteIndex = LOADING_QUOTES.indexOf(quoteWithoutAuthor);
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(quoteIndex / LOADING_QUOTES.length);

    render(<FullScreenLoader />);

    expect(
      screen.getByText(`"${quoteWithoutAuthor.text}"`),
    ).toBeInTheDocument();
    expect(screen.queryByText(/^—/)).not.toBeInTheDocument();
  });
});

describe('getRandomLoadingContent', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should return an image from LOADING_IMAGES', () => {
    const content = getRandomLoadingContent();
    expect(LOADING_IMAGES).toContain(content.image);
  });

  it('should return a quote from LOADING_QUOTES', () => {
    const content = getRandomLoadingContent();
    expect(LOADING_QUOTES).toContainEqual(content.quote);
  });

  it('should return first items when Math.random returns 0', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const content = getRandomLoadingContent();

    expect(content.image).toBe(LOADING_IMAGES[0]);
    expect(content.quote).toBe(LOADING_QUOTES[0]);
  });

  it('should return last items when Math.random returns close to 1', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.999);

    const content = getRandomLoadingContent();

    expect(content.image).toBe(LOADING_IMAGES[LOADING_IMAGES.length - 1]);
    expect(content.quote).toBe(LOADING_QUOTES[LOADING_QUOTES.length - 1]);
  });
});
