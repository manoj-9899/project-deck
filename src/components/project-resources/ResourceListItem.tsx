/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Heart, 
  ExternalLink, 
  Copy, 
  Check, 
  AlertTriangle, 
  Terminal, 
  GitBranch,
  Globe,
  FileText,
  Layers,
  Database,
  Cloud,
  MessageSquare,
  HelpCircle,
  FileCode
} from "lucide-react";
import { ProjectResource, ResourceStatus } from "../../types/project-resource";
import ResourceMenu from "./ResourceMenu";
import { useToast } from "../ui/Toast";

interface ResourceListItemProps {
  key?: string | number;
  resource: ProjectResource;
  onOpenDetails: (res: ProjectResource) => void;
  onEdit: (res: ProjectResource) => void;
  onDuplicate: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onChangeStatus: (id: string, s: ResourceStatus) => void;
  onDelete: (id: string) => void;
  onOpenResource: (id: string) => void;
  isEditable: boolean;
}

export default function ResourceListItem({
  resource,
  onOpenDetails,
  onEdit,
  onDuplicate,
  onToggleFavorite,
  onToggleArchive,
  onChangeStatus,
  onDelete,
  onOpenResource,
  isEditable,
}: ResourceListItemProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  // Type-specific icons
  const getResourceIcon = (type: string) => {
    const iconClass = "w-4 h-4";
    switch (type) {
      case "Repository":
        return <GitBranch className={`${iconClass} text-blue-500`} />;
      case "Deployment":
        return <Globe className={`${iconClass} text-emerald-500`} />;
      case "Documentation":
        return <FileText className={`${iconClass} text-purple-500`} />;
      case "API Reference":
        return <FileCode className={`${iconClass} text-pink-500`} />;
      case "Design":
        return <Layers className={`${iconClass} text-indigo-500`} />;
      case "Database":
        return <Database className={`${iconClass} text-amber-500`} />;
      case "Hosting":
        return <Cloud className={`${iconClass} text-sky-500`} />;
      case "AI Conversation":
        return <MessageSquare className={`${iconClass} text-violet-500`} />;
      case "Local Path":
        return <Terminal className={`${iconClass} text-slate-500`} />;
      default:
        return <HelpCircle className={`${iconClass} text-gray-400`} />;
    }
  };

  // Environment badge styles
  const getEnvBadgeClass = (env: string) => {
    switch (env) {
      case "Local":
        return "bg-slate-50 text-slate-600 border-slate-200/60";
      case "Development":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "Preview":
        return "bg-purple-50 text-purple-600 border-purple-100";
      case "Production":
        return "bg-emerald-50 text-emerald-700 border-emerald-100 font-bold";
      default:
        return "bg-gray-50 text-gray-500 border-gray-100";
    }
  };

  // Status badge styles
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
      case "Inactive":
        return "bg-gray-100 text-gray-500 border-gray-200";
      case "Broken":
        return "bg-red-50 text-red-700 border-red-200 animate-pulse";
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Archived":
        return "bg-slate-100 text-slate-600 border-slate-200";
      default:
        return "bg-gray-50 text-gray-500 border-gray-100";
    }
  };

  const handleCopyPath = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const val = resource.localPath || resource.url || "";
    if (!val) return;

    try {
      await navigator.clipboard.writeText(val);
      setCopied(true);
      toast({
        type: "success",
        title: resource.localPath ? "Local Path Copied" : "URL Copied",
        message: `"${resource.title}" reference was copied to clipboard successfully.`,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {
      toast({
        type: "error",
        title: "Copy Failed",
        message: "Failed to copy reference. Try copying manually.",
      });
    }
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenResource(resource.id);
  };

  const isLocalPath = resource.type === "Local Path";
  const displayAddress = resource.localPath || resource.url || "";

  return (
    <div
      onClick={() => onOpenDetails(resource)}
      className={`group flex flex-col md:flex-row md:items-center justify-between gap-4 p-3 bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm rounded-xl transition-all cursor-pointer relative min-w-0 ${
        resource.status === "Broken" ? "border-red-100 bg-red-50/5 hover:border-red-300" : ""
      }`}
      id={`resource-list-item-${resource.id}`}
    >
      {/* 1. Left Side: Icon + Title + Description */}
      <div className="flex items-start gap-3 grow min-w-0 md:max-w-[45%]">
        <div className="p-2 bg-gray-50 border border-gray-100 rounded-lg shrink-0 mt-0.5">
          {getResourceIcon(resource.type)}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="text-sm font-bold text-gray-900 group-hover:text-slate-900 transition-colors truncate">
              {resource.title}
            </h4>
            <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-semibold bg-gray-50 border border-gray-100 text-gray-500 uppercase tracking-wide">
              {resource.type}
            </span>
          </div>

          {resource.description ? (
            <p className="text-xs text-gray-500 line-clamp-1 leading-relaxed">
              {resource.description}
            </p>
          ) : (
            <p className="text-xs text-gray-300 italic">No description provided.</p>
          )}
        </div>
      </div>

      {/* 2. Middle Column: Copyable path / External link */}
      <div className="flex items-center min-w-0 md:max-w-[25%] lg:max-w-[30%]">
        <div className="flex items-center gap-1.5 text-xs font-mono text-gray-400 bg-gray-50/50 hover:bg-gray-50 border border-gray-100/50 rounded-lg p-1.5 py-1 w-full min-w-0 transition-colors">
          {isLocalPath ? (
            <button
              onClick={handleCopyPath}
              className="flex items-center gap-1.5 grow min-w-0 text-left hover:text-gray-700 outline-none focus:outline-none"
              title="Click to copy local path"
              id={`btn-copy-address-list-${resource.id}`}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> : <Copy className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
              <span className="truncate font-semibold text-[11px] text-gray-600">
                {copied ? "Copied Path!" : displayAddress}
              </span>
            </button>
          ) : resource.url ? (
            <div className="flex items-center justify-between gap-1.5 grow min-w-0">
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkClick}
                className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 hover:underline grow min-w-0"
                title="Open safe external link"
                id={`link-open-list-${resource.id}`}
              >
                <ExternalLink className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="truncate text-[11px] font-semibold">{displayAddress}</span>
              </a>
              <button
                onClick={handleCopyPath}
                className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none shrink-0"
                title="Copy URL"
                id={`btn-copy-url-list-${resource.id}`}
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          ) : (
            <span className="text-[11px] italic text-gray-300">No URL/path linked</span>
          )}
        </div>
      </div>

      {/* 3. Right Columns: Badges + Action menus */}
      <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`px-1.5 py-0.5 rounded border text-[9px] font-semibold uppercase ${getEnvBadgeClass(resource.environment)}`}>
            {resource.environment}
          </span>
          <span className={`px-1.5 py-0.5 rounded border text-[9px] font-semibold uppercase ${getStatusBadgeClass(resource.status)}`}>
            {resource.status}
          </span>
          {resource.status === "Broken" && (
            <AlertTriangle className="w-3.5 h-3.5 text-red-500 animate-pulse shrink-0" title="Broken reference connection!" />
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Favorite Indicator Icon */}
          {isEditable && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(resource.id);
              }}
              className={`p-1.5 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none ${
                resource.isFavorite ? "text-rose-500" : "text-gray-300 hover:text-gray-400"
              }`}
              title={resource.isFavorite ? "Remove favorite" : "Mark as favorite"}
              id={`btn-favorite-res-list-${resource.id}`}
            >
              <Heart className={`w-3.5 h-3.5 ${resource.isFavorite ? "fill-rose-500" : ""}`} />
            </button>
          )}

          <ResourceMenu
            resource={resource}
            onOpenDetails={() => onOpenDetails(resource)}
            onEdit={() => onEdit(resource)}
            onDuplicate={() => onDuplicate(resource.id)}
            onToggleFavorite={() => onToggleFavorite(resource.id)}
            onToggleArchive={() => onToggleArchive(resource.id)}
            onDelete={() => onDelete(resource.id)}
            onChangeStatus={(s) => onChangeStatus(resource.id, s)}
            isEditable={isEditable}
          />
        </div>
      </div>
    </div>
  );
}
