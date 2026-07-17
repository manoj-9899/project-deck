/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "../ui/Button";

interface GlobalSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export const GlobalSearchInput: React.FC<GlobalSearchInputProps> = ({
  value,
  onChange,
  onKeyDown,
  placeholder = "Search projects, tasks, roadmaps, knowledge, prompts...",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Auto-focus input on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`relative flex items-center border-b px-4 bg-surface shrink-0 h-14 transition-all duration-150 ${
      isFocused 
        ? "border-accent-primary/40 ring-1 ring-accent-primary/10" 
        : "border-border-subtle"
    }`}>
      {/* Search Icon */}
      <Search className={`w-5 h-5 mr-3 shrink-0 transition-colors duration-150 ${
        isFocused ? "text-accent-primary" : "text-text-tertiary"
      }`} />

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="flex-1 h-full bg-transparent border-none text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-0 outline-none w-full min-w-0"
        aria-autocomplete="list"
        aria-controls="search-results-listbox"
        role="combobox"
        aria-expanded={true}
      />

      {/* Clear or Close Controls */}
      {value ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            onChange("");
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }}
          className="p-1 rounded-md h-7 w-7 text-text-secondary hover:text-text-primary hover:bg-muted-surface border-transparent"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </Button>
      ) : (
        <div className="hidden sm:flex items-center gap-1.5 shrink-0 select-none">
          <kbd className="px-1.5 py-0.5 bg-muted-surface border border-border-subtle rounded-md font-mono text-[9px] text-text-tertiary font-medium shadow-xs">
            ESC
          </kbd>
        </div>
      )}
    </div>
  );
};
