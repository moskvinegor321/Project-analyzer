"use client";

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Plus, X, Link, Globe, ExternalLink } from 'lucide-react';

interface DocumentationInputProps {
  urls: string[];
  onChange: (urls: string[]) => void;
}

export function DocumentationInput({ urls, onChange }: DocumentationInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addUrl();
    }
  };

  const addUrl = () => {
    if (inputValue.trim() && !urls.includes(inputValue.trim())) {
      onChange([...urls, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeUrl = (urlToRemove: string) => {
    onChange(urls.filter(url => url !== urlToRemove));
  };

  const clearAll = () => {
    onChange([]);
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const getDomainFromUrl = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  return (
    <div className="space-y-4">
      {/* Input section */}
      <div className="space-y-3">
        <div className="relative">
          <div className={`
            relative flex items-center rounded-lg border transition-all duration-200
            ${isInputFocused 
              ? 'border-media-tv/50 bg-card/50' 
              : 'border-border/30 bg-card/30 hover:border-border/50'
            }
          `}>
            {/* Input icon */}
            <div className="flex items-center justify-center w-10 h-10">
              <Link className={`
                w-4 h-4 transition-colors duration-200
                ${isInputFocused ? 'text-media-tv' : 'text-muted-foreground'}
              `} />
            </div>
            
            {/* Input field */}
            <input
              type="url"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              placeholder="https://docs.example.com"
              className="flex-1 h-10 bg-transparent border-0 outline-none font-heading-sm text-foreground placeholder:text-muted-foreground/60"
            />
            
            {/* Add button */}
            <div className="pr-2">
              <Button
                onClick={addUrl}
                disabled={!inputValue.trim() || urls.includes(inputValue.trim())}
                className={`
                  w-8 h-8 rounded-md border-0 p-0 transition-all duration-200
                  ${inputValue.trim() && !urls.includes(inputValue.trim())
                    ? 'bg-media-tv/20 hover:bg-media-tv/30 text-media-tv'
                    : 'bg-muted/10 text-muted-foreground/50 cursor-not-allowed'
                  }
                `}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Validation feedback */}
          {inputValue.trim() && !isValidUrl(inputValue) && (
            <p className="text-xs text-destructive mt-1 font-heading-xs">
              Please enter a valid URL
            </p>
          )}
        </div>
      </div>

      {/* URLs list */}
      {urls.length > 0 && (
        <div className="space-y-3">
          {/* Header with clear all */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <span className="font-heading-sm text-foreground">
                Documentation Sources ({urls.length})
              </span>
            </div>
            <Button
              onClick={clearAll}
              className="h-7 px-3 rounded-md bg-destructive/10 hover:bg-destructive/20 border-0 text-destructive font-heading-xs"
            >
              Clear All
            </Button>
          </div>

          {/* URLs grid */}
          <div className="space-y-2">
            {urls.map((url, index) => (
              <div
                key={index}
                className="group relative bg-muted/20 border border-border/30 rounded-lg p-3 transition-all duration-200 hover:bg-muted/30 hover:border-border/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {/* URL icon */}
                    <div className="w-8 h-8 rounded-md bg-card border border-border/30 flex items-center justify-center flex-shrink-0">
                      <ExternalLink className="w-4 h-4 text-media-tv" />
                    </div>
                    
                    {/* URL info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-heading-sm text-foreground truncate">
                        {getDomainFromUrl(url)}
                      </p>
                      <p className="font-heading-xs text-muted-foreground truncate">
                        {url}
                      </p>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                      onClick={() => window.open(url, '_blank')}
                      className="w-7 h-7 rounded-md bg-card/50 hover:bg-card border border-border/30 p-0"
                    >
                      <ExternalLink className="w-3 h-3 text-muted-foreground" />
                    </Button>
                    <Button
                      onClick={() => removeUrl(url)}
                      className="w-7 h-7 rounded-md bg-destructive/10 hover:bg-destructive/20 border-0 p-0"
                    >
                      <X className="w-3 h-3 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-card/30 border border-border/20 rounded-lg p-3">
            <p className="font-heading-xs text-muted-foreground text-center">
              {urls.length} documentation {urls.length === 1 ? 'source' : 'sources'} added for enhanced analysis context
            </p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {urls.length === 0 && (
        <div className="text-center py-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-muted/20 flex items-center justify-center mb-3">
            <Globe className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="font-heading text-muted-foreground mb-1">No documentation URLs added</p>
          <p className="font-heading-xs text-muted-foreground/60">
            Add documentation links to improve analysis accuracy
          </p>
        </div>
      )}
    </div>
  );
} 