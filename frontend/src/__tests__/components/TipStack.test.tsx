import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TipStack } from '@/components/tips/TipStack';
import type { Tip } from '@sandilya-stack/shared/types';

const mockTips: Tip[] = [
  {
    id: 'tip-1',
    title: 'Take Deep Breaths',
    description: 'First tip: Take 3 deep breaths.',
    tag: 'breathe',
    category: 'immediate',
    priority: 1,
    timeEstimate: '2 minutes',
    actionType: 'timer',
    swipeDirection: null,
  },
  {
    id: 'tip-2',
    title: 'Break It Down',
    description: 'Second tip: Break it into smaller tasks.',
    tag: 'simplify',
    category: 'habit',
    priority: 2,
    timeEstimate: '5 minutes',
    actionType: 'none',
    swipeDirection: null,
  },
  {
    id: 'tip-3',
    title: 'You Are Doing Great',
    description: 'Third tip: You are doing great!',
    tag: 'acceptance',
    category: 'mindset',
    priority: 3,
    timeEstimate: '1 minute',
    actionType: 'save',
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
        onRegenerate={() => pendingRegenerate}
      />,
    );

    const regenerateButton = screen.getByRole('button', {
      name: /Not resonating\? Get different tips/i,
    });
    await user.click(regenerateButton);

    await waitFor(() => {
      expect(screen.getByText(/Generating/i)).toBeInTheDocument();
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
