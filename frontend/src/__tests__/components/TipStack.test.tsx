import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TipStack } from '@/components/tips/TipStack';
import type { Tip } from '@sandilya-stack/shared/types';

const mockTips: Tip[] = [
  {
    id: 'tip-1',
    content: 'First tip: Take 3 deep breaths.',
    tag: 'breathe',
    category: 'immediate',
    priority: 1,
    swipeDirection: null,
  },
  {
    id: 'tip-2',
    content: 'Second tip: Break it into smaller tasks.',
    tag: 'simplify',
    category: 'habit',
    priority: 2,
    swipeDirection: null,
  },
  {
    id: 'tip-3',
    content: 'Third tip: You are doing great!',
    tag: 'acceptance',
    category: 'mindset',
    priority: 3,
    swipeDirection: null,
  },
];

describe('TipStack', () => {
  const defaultProps = {
    tips: mockTips,
    onSwipe: vi.fn(), // Synchronous - optimistic UI update
    onRegenerate: vi.fn().mockResolvedValue(undefined),
    onComplete: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render first tip content', () => {
    render(<TipStack {...defaultProps} />);

    expect(
      screen.getByText('First tip: Take 3 deep breaths.'),
    ).toBeInTheDocument();
  });

  it('should show progress indicator', () => {
    render(<TipStack {...defaultProps} />);

    expect(screen.getByText('Tip 1 of 3')).toBeInTheDocument();
    expect(screen.getByText('0% complete')).toBeInTheDocument();
  });

  it('should show regenerate button', () => {
    render(<TipStack {...defaultProps} />);

    expect(
      screen.getByText(/Not resonating\? Get different tips/),
    ).toBeInTheDocument();
  });

  it('should call onRegenerate when regenerate button is clicked', async () => {
    const user = userEvent.setup();

    render(<TipStack {...defaultProps} />);

    const regenerateButton = screen.getByRole('button', {
      name: /Not resonating\? Get different tips/i,
    });
    await user.click(regenerateButton);

    expect(defaultProps.onRegenerate).toHaveBeenCalled();
  });

  it('should show completed state when no tips left', () => {
    render(<TipStack {...defaultProps} tips={[]} />);

    expect(screen.getByText('All tips reviewed!')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Get different tips/i }),
    ).toBeInTheDocument();
  });

  it('should show loading state when regenerating', async () => {
    const user = userEvent.setup();
    let resolveRegenerate: () => void;
    const pendingRegenerate = new Promise<void>(resolve => {
      resolveRegenerate = resolve;
    });

    render(
      <TipStack
        {...defaultProps}
        tips={[]}
        onRegenerate={() => pendingRegenerate}
      />,
    );

    const regenerateButton = screen.getByRole('button', {
      name: /Get different tips/i,
    });
    await user.click(regenerateButton);

    await waitFor(() => {
      expect(screen.getByText(/Generating new tips/i)).toBeInTheDocument();
    });

    resolveRegenerate!();
  });

  it('should render progress bar', () => {
    const { container } = render(<TipStack {...defaultProps} />);

    const progressBar = container.querySelector('.bg-primary');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveStyle({ width: '0%' });
  });
});
