import { useState, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Send } from 'lucide-react';

interface TextInputProps {
  onSubmit: (text: string) => Promise<void>;
  initialValue?: string;
  placeholder?: string;
  disabled?: boolean;
}

export interface TextInputRef {
  setText: (text: string) => void;
  getText: () => string;
  clear: () => void;
}

export const TextInput = forwardRef<TextInputRef, TextInputProps>(
  (
    {
      onSubmit,
      initialValue = '',
      placeholder = "What's on your mind? Let it all out...",
      disabled = false,
    },
    ref,
  ) => {
    const [text, setText] = useState(initialValue);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useImperativeHandle(ref, () => ({
      setText: (newText: string) => setText(newText),
      getText: () => text,
      clear: () => setText(''),
    }));

    const handleSubmit = async () => {
      if (!text.trim() || isSubmitting) return;

      setIsSubmitting(true);
      try {
        await onSubmit(text.trim());
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleSubmit();
      }
    };

    return (
      <div className="w-full space-y-4">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isSubmitting}
          className="w-full min-h-[200px] p-4 rounded-lg bg-transparent border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 resize-none text-lg"
          aria-label="Brain dump text input"
        />
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            {text.length > 0
              ? `${text.length} characters`
              : 'Ctrl/Cmd + Enter to submit'}
          </span>
          <Button
            onClick={handleSubmit}
            disabled={!text.trim() || isSubmitting || disabled}
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send />
                Submit
              </>
            )}
          </Button>
        </div>
      </div>
    );
  },
);

TextInput.displayName = 'TextInput';
