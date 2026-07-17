/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Heart, Copy, Check, ArrowRight, Sparkles } from "lucide-react";
import { ProjectPrompt } from "../../types/project-prompt";
import { useToast } from "../ui/Toast";

interface FavoritePromptsProps {
  favorites: ProjectPrompt[];
  onOpenDetails: (prompt: ProjectPrompt) => void;
}

export default function FavoritePrompts({
  favorites,
  onOpenDetails,
}: FavoritePromptsProps) {
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (e: React.MouseEvent, prompt: ProjectPrompt) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(prompt.prompt);
      setCopiedId(prompt.id);
      toast({
        type: "success",
        title: "Prompt Copied",
        message: `The prompt text for "${prompt.title}" was copied to your clipboard.`,
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast({
        type: "error",
        title: "Copy Failed",
        message: "Failed to copy the text. Please try selecting it manually.",
      });
    }
  };

  if (favorites.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2.5 pb-2 border-b border-gray-100" id="prompts-favorites-section">
      <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 tracking-wide uppercase">
        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
        <span>Favorite Prompts ({favorites.length})</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {favorites.map((fav) => (
          <div
            key={fav.id}
            onClick={() => onOpenDetails(fav)}
            className="flex flex-col justify-between p-3.5 bg-gradient-to-br from-rose-50/20 via-white to-slate-50 border border-gray-200 hover:border-rose-200 rounded-xl hover:shadow-md transition-all cursor-pointer group relative min-w-0"
            id={`fav-card-${fav.id}`}
          >
            {/* Top Row: Details */}
            <div className="min-w-0 mb-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-600 border border-rose-100">
                  {fav.category}
                </span>
                <span className="text-[10px] text-gray-400 font-mono">
                  {fav.tool}
                </span>
              </div>
              <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-slate-900 transition-colors">
                {fav.title}
              </h4>
              <p className="text-xs text-gray-400 font-mono mt-1 line-clamp-1">
                {fav.prompt}
              </p>
            </div>

            {/* Bottom Row: Actions */}
            <div className="flex items-center justify-between border-t border-gray-100/70 pt-2.5 mt-auto">
              <button
                onClick={(e) => handleCopy(e, fav)}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 px-2.5 py-1.5 rounded-lg border border-gray-100 shadow-sm transition-all shrink-0 focus:outline-none focus:ring-1 focus:ring-slate-500"
                title="Copy prompt text to clipboard"
                id={`btn-fav-copy-${fav.id}`}
              >
                {copiedId === fav.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-gray-400" />
                    <span>Copy Prompt</span>
                  </>
                )}
              </button>

              <span className="text-[11px] font-semibold text-slate-400 group-hover:text-slate-700 transition-colors flex items-center gap-0.5">
                Details
                <ArrowRight className="w-3 h-3 translate-x-0 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
