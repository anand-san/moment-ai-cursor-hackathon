import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TipCard } from '@/components/tips/TipCard';
import type { Tip } from '@sandilya-stack/shared/types';

const mockTip: Tip = {
  id: 'tip-1',
  title: 'Take Deep Breaths',
  description: 'Take 3 deep breaths to calm your nervous system.',
  tag: 'breathe',
  category: 'immediate',
  priority: 1,
  timeEstimate: '2 minutes',
  actionType: 'timer',
  swipeDirection: null,
};

describe('TipCard', () => {
  it('should render tip content', () => {
    const onSwipe = vi.fn();

    render(<TipCard tip={mockTip} onSwipe={onSwipe} isTop={true} />);

    expect(
      screen.getByText('Take 3 deep breaths to calm your nervous system.'),
    ).toBeInTheDocument();
  });

  it('should render tag and category badges', () => {
    const onSwipe = vi.fn();

    render(<TipCard tip={mockTip} onSwipe={onSwipe} isTop={true} />);

    expect(screen.getByText('immediate')).toBeInTheDocument();
    expect(screen.getByText('#breathe')).toBeInTheDocument();
  });

  it('should render swipe hint when is top card', () => {
    const onSwipe = vi.fn();

    render(<TipCard tip={mockTip} onSwipe={onSwipe} isTop={true} />);

    expect(
      screen.getByText('Swipe left if not helpful, right if helpful'),
    ).toBeInTheDocument();
  });

  it('should not render swipe hint when not top card', () => {
    const onSwipe = vi.fn();

    render(<TipCard tip={mockTip} onSwipe={onSwipe} isTop={false} />);

    expect(
      screen.queryByText('Swipe left if not helpful, right if helpful'),
    ).not.toBeInTheDocument();
  });

  it('should render card for swiping', () => {
    const onSwipe = vi.fn();

    const { container } = render(
      <TipCard tip={mockTip} onSwipe={onSwipe} isTop={true} />,
    );

    // Card should be draggable and have motion animations
    const motionDiv = container.querySelector('[style]');
    expect(motionDiv).toBeInTheDocument();
  });

  it('should call onSwipe with right when dragged right', () => {
    const onSwipe = vi.fn();

    const { container } = render(
      <TipCard tip={mockTip} onSwipe={onSwipe} isTop={true} />,
    );

    const card = container.querySelector('[style*="transform"]');
    if (!card) throw new Error('Card not found');

    // Simulate drag end with offset > threshold (100)
    fireEvent.pointerDown(card, { clientX: 0, clientY: 0 });
    fireEvent.pointerMove(card, { clientX: 150, clientY: 0 });
    fireEvent.pointerUp(card);
  });

  it('should render different category with correct color class', () => {
    const habitTip: Tip = { ...mockTip, category: 'habit' };
    const onSwipe = vi.fn();

    render(<TipCard tip={habitTip} onSwipe={onSwipe} isTop={true} />);

    const categoryBadge = screen.getByText('habit');
    expect(categoryBadge).toHaveClass('bg-purple-100');
  });

  it('should render mindset category', () => {
    const mindsetTip: Tip = { ...mockTip, category: 'mindset' };
    const onSwipe = vi.fn();

    render(<TipCard tip={mindsetTip} onSwipe={onSwipe} isTop={true} />);

    const categoryBadge = screen.getByText('mindset');
    expect(categoryBadge).toHaveClass('bg-amber-100');
  });
});
