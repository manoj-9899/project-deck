/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Heart, Copy, Check, ExternalLink, ArrowRight } from "lucide-react";
import { ProjectResource } from "../../types/project-resource";
import { useToast } from "../ui/Toast";

interface FavoriteResourcesProps {
  favorites: ProjectResource[];
  onOpenDetails: (resource: ProjectResource) => void;
  onOpenResource: (id: string) => void;
}

export default function FavoriteResources({
  favorites,
  onOpenDetails,
  onOpenResource,
}: FavoriteResourcesProps) {
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyPath = async (e: React.MouseEvent, res: ProjectResource) => {
    e.stopPropagation();
    const copyValue = res.localPath || res.url || "";
    if (!copyValue) return;

    try {
      await navigator.clipboard.writeText(copyValue);
      setCopiedId(res.id);
      toast({
        type: "success",
        title: res.localPath ? "Path Copied" : "URL Copied",
        message: `"${res.title}" ${res.localPath ? 'local path' : 'URL'} was copied to clipboard.`,
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast({
        type: "error",
        title: "Copy Failed",
        message: "Failed to copy text. Please try copying manually.",
      });
    }
  };

  const handleExternalClick = (res: ProjectResource) => {
    onOpenResource(res.id);
  };

  if (favorites.length === 0) {
    return null;
  }

  // Get color configurations for different resource types
  const getTypeBadgeStyle = (type: string) => {
    switch (type) {
      case "Repository":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "Deployment":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "Documentation":
      case "API Reference":
        return "bg-purple-50 text-purple-600 border-purple-100";
      case "Design":
        return "bg-pink-50 text-pink-600 border-pink-100";
      case "Database":
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "AI Conversation":
        return "bg-indigo-50 text-indigo-600 border-indigo-100";
      case "Local Path":
        return "bg-slate-50 text-slate-600 border-slate-100";
      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  return (
    <div className="flex flex-col gap-2.5 pb-2 border-b border-gray-100 animate-fade-in" id="resources-favorites-section">
      <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 tracking-wide uppercase">
        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
        <span>Favorite Resources ({favorites.length})</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {favorites.map((res) => {
          const isLocal = res.type === "Local Path";
          const displayLink = res.localPath || res.url || "";

          return (
            <div
              key={res.id}
              onClick={() => onOpenDetails(res)}
              className="flex flex-col justify-between p-3.5 bg-gradient-to-br from-rose-50/10 via-white to-slate-50/50 border border-gray-200 hover:border-rose-200 rounded-xl hover:shadow-md transition-all cursor-pointer group relative min-w-0"
              id={`fav-resource-card-${res.id}`}
            >
              {/* Top Row: Info */}
              <div className="min-w-0 mb-3">
                <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${getTypeBadgeStyle(res.type)}`}>
                    {res.type}
                  </span>
                  {res.provider && (
                    <span className="text-[10px] text-gray-400 font-medium">
                      via {res.provider}
                    </span>
                  )}
                </div>
                
                <h4 className="text-sm font-semibold text-gray-900 truncate group-hover:text-slate-900 transition-colors">
                  {res.title}
                </h4>
                
                <p className="text-xs text-gray-400 font-mono mt-1 truncate max-w-full">
                  {displayLink}
                </p>
              </div>

              {/* Bottom Row: Actions */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-2.5 mt-auto">
                {isLocal ? (
                  <button
                    onClick={(e) => handleCopyPath(e, res)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 px-2.5 py-1.5 rounded-lg border border-gray-100 shadow-sm transition-all shrink-0 focus:outline-none"
                    title="Copy local path"
                    id={`btn-fav-copy-path-${res.id}`}
                  >
                    {copiedId === res.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-gray-400" />
                        <span>Copy Path</span>
                      </>
                    )}
                  </button>
                ) : res.url ? (
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleExternalClick(res)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-white hover:bg-blue-50/50 px-2.5 py-1.5 rounded-lg border border-blue-50 shadow-sm transition-all shrink-0 focus:outline-none"
                    title="Open live link"
                    id={`btn-fav-open-link-${res.id}`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Link</span>
                  </a>
                ) : (
                  <div className="h-8 shrink-0" /> // spacer
                )}

                <span className="text-[11px] font-semibold text-slate-400 group-hover:text-slate-700 transition-colors flex items-center gap-0.5">
                  Details
                  <ArrowRight className="w-3 h-3 translate-x-0 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
