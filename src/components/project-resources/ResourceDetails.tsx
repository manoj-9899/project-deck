/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Calendar, 
  Layers, 
  Pencil, 
  Clipboard, 
  Check, 
  ExternalLink, 
  AlertTriangle, 
  Terminal, 
  Clock, 
  ShieldCheck,
  GitBranch,
  Globe,
  FileText,
  Database,
  Cloud,
  MessageSquare,
  HelpCircle,
  FileCode,
  ShieldAlert
} from "lucide-react";
import { ProjectResource } from "../../types/project-resource";
import { Sheet } from "../ui/Sheet";
import { Button } from "../ui/Button";
import { useToast } from "../ui/Toast";

interface ResourceDetailsProps {
  resource: ProjectResource | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (res: ProjectResource) => void;
  isEditable: boolean;
}

export default function ResourceDetails({
  resource,
  isOpen,
  onClose,
  onEdit,
  isEditable,
}: ResourceDetailsProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!resource) return null;

  const handleCopyValue = () => {
    const val = resource.localPath || resource.url || "";
    if (!val) return;

    navigator.clipboard.writeText(val);
    setCopied(true);
    toast({
      type: "success",
      title: "Value Copied",
      message: `Successfully copied the ${resource.localPath ? "local path" : "URL"} to your clipboard.`,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  // Type-specific icons
  const getResourceIcon = (type: string) => {
    const iconClass = "w-5 h-5";
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

  // Environment styles
  const getEnvBadgeClass = (env: string) => {
    switch (env) {
      case "Local":
        return "bg-slate-50 text-slate-600 border-slate-200";
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

  // Status styles
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Inactive":
        return "bg-gray-50 text-gray-500 border-gray-200";
      case "Broken":
        return "bg-red-50 text-red-700 border-red-200";
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Archived":
        return "bg-slate-50 text-slate-600 border-slate-200";
      default:
        return "bg-gray-50 text-gray-500 border-gray-100";
    }
  };

  const isLocalPath = resource.type === "Local Path";
  const displayAddress = resource.localPath || resource.url || "";

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title={resource.title}
      size="lg"
    >
      <div className="flex flex-col justify-between h-full font-sans pb-16" id="resource-details-sheet">
        {/* Main Content Scroll viewport */}
        <div className="grow overflow-y-auto px-6 py-4">
          
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-3 mb-5 pb-4 border-b border-gray-100">
            <span className="flex items-center gap-1 text-xs font-semibold bg-gray-50 text-gray-700 border border-gray-150 rounded-lg p-1.5 py-0.5 shrink-0">
              {getResourceIcon(resource.type)}
              <span className="uppercase text-[10px] tracking-wide ml-0.5">{resource.type}</span>
            </span>

            {resource.isFavorite && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-600 border border-rose-100">
                Favorite
              </span>
            )}

            {resource.isArchived && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                Archived
              </span>
            )}

            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-mono ml-auto">
              <Clock className="w-3.5 h-3.5 text-gray-300" />
              <span>Updated: {new Date(resource.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Safety Reminder Header Banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-5 flex gap-2.5 text-xs text-slate-600 leading-relaxed shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <strong>Security Safeguard:</strong> Store references only. Never save credentials, secrets, tokens, or private configurations in ProjectDock.
            </div>
          </div>

          {/* Broken Reference warning & troubleshooting panel */}
          {resource.status === "Broken" && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5 text-xs text-red-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-red-900">
                <ShieldAlert className="w-4.5 h-4.5 text-red-500" />
                <span>Troubleshooting Broken Connection</span>
              </div>
              <p className="leading-relaxed">
                This link or pathway is marked as broken. Standard checks for verification:
              </p>
              <ul className="list-disc list-inside space-y-1 text-red-700 font-medium">
                {isLocalPath ? (
                  <>
                    <li>Verify local repository folder exists at: <code className="bg-red-100/50 px-1 py-0.2 rounded font-mono">{resource.localPath}</code></li>
                    <li>Ensure the folder was not moved, deleted, or permissions altered.</li>
                    <li>Check if the active terminal workspace is in the correct root shell.</li>
                  </>
                ) : (
                  <>
                    <li>Confirm hosting certificates are valid and have not expired.</li>
                    <li>Check if deployment pipeline built successfully on remote servers.</li>
                    <li>Ensure you are authenticated in host systems (GitHub, Supabase, etc.).</li>
                  </>
                )}
              </ul>
            </div>
          )}

          {/* Address Link Panel */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-5">
            <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2.5">
              Reference Address
            </h4>

            <div className="flex items-center gap-2 bg-white border border-gray-150 p-2.5 rounded-xl text-xs font-mono select-all break-all shadow-sm">
              {isLocalPath ? (
                <div className="flex items-center gap-1.5 grow min-w-0 text-slate-700">
                  <Terminal className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{resource.localPath}</span>
                </div>
              ) : resource.url ? (
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 grow min-w-0 text-blue-600 hover:text-blue-700 hover:underline"
                >
                  <ExternalLink className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>{resource.url}</span>
                </a>
              ) : (
                <span className="text-gray-300 italic">No address linked</span>
              )}

              <button
                onClick={handleCopyValue}
                className="p-1.5 rounded-lg border border-gray-100 hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors shrink-0 outline-none"
                title={isLocalPath ? "Copy local path" : "Copy URL"}
                id="btn-details-copy-address"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Clipboard className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Description Block */}
          <div className="mb-5">
            <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">
              Description / Notes
            </h4>
            <div className="bg-white border border-gray-100 rounded-xl p-4 text-sm text-gray-700 leading-relaxed min-h-[80px]">
              {resource.description ? (
                <p className="whitespace-pre-wrap">{resource.description}</p>
              ) : (
                <p className="text-gray-400 italic">No description provided for this resource reference.</p>
              )}
            </div>
          </div>

          {/* Grid Coordinates Panel */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-5">
            <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2.5">
              Workspace Coordinates
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-white border border-gray-100 p-2.5 rounded-lg flex items-center justify-between">
                <span className="text-gray-400 font-medium">Environment:</span>
                <span className={`px-2 py-0.5 border rounded text-[10px] font-bold uppercase ${getEnvBadgeClass(resource.environment)}`}>
                  {resource.environment}
                </span>
              </div>

              <div className="bg-white border border-gray-100 p-2.5 rounded-lg flex items-center justify-between">
                <span className="text-gray-400 font-medium">Status:</span>
                <span className={`px-2 py-0.5 border rounded text-[10px] font-bold uppercase ${getStatusBadgeClass(resource.status)}`}>
                  {resource.status}
                </span>
              </div>

              {resource.provider && (
                <div className="bg-white border border-gray-100 p-2.5 rounded-lg flex items-center justify-between sm:col-span-2">
                  <span className="text-gray-400 font-medium">Service Provider / Host:</span>
                  <span className="font-bold text-gray-800 uppercase tracking-wide text-[11px]">{resource.provider}</span>
                </div>
              )}
            </div>
          </div>

          {/* Dates Log */}
          <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-4 mb-5">
            <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2.5">
              Registration Log
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white border border-gray-100/60 p-2 rounded-lg flex flex-col">
                <span className="text-[10px] font-semibold text-gray-400 uppercase mb-0.5">Created</span>
                <span className="font-mono text-gray-700">{new Date(resource.createdAt).toLocaleString()}</span>
              </div>
              <div className="bg-white border border-gray-100/60 p-2 rounded-lg flex flex-col">
                <span className="text-[10px] font-semibold text-gray-400 uppercase mb-0.5">Last Updated</span>
                <span className="font-mono text-gray-700">{new Date(resource.updatedAt).toLocaleString()}</span>
              </div>
              <div className="bg-white border border-gray-100/60 p-2 rounded-lg flex flex-col">
                <span className="text-[10px] font-semibold text-gray-400 uppercase mb-0.5">Last Accessed</span>
                <span className="font-mono text-gray-700">
                  {resource.lastOpenedAt ? new Date(resource.lastOpenedAt).toLocaleString() : "Never from ProjectDock"}
                </span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {resource.tags.length > 0 && (
            <div>
              <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">
                Resource Tags
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {resource.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer sticky bar with Copy & Edit/Close actions */}
        <div className="absolute bottom-0 left-0 right-0 h-16 border-t border-gray-100 bg-white/95 backdrop-blur-sm flex items-center justify-between px-6 z-10">
          {/* Copy value trigger */}
          <Button 
            onClick={handleCopyValue}
            variant="secondary"
            className="gap-1.5 h-10 px-4 text-xs font-semibold rounded-xl"
            id="btn-details-copy-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Clipboard className="w-4 h-4" />}
            {isLocalPath ? "Copy Local Path" : "Copy URL address"}
          </Button>

          <div className="flex gap-2">
            <Button
              onClick={onClose}
              variant="secondary"
              className="h-10 px-4 text-xs font-semibold rounded-xl"
            >
              Close
            </Button>
            
            {/* Restrictions: Hide edit action if not editable (e.g. archived project) */}
            {isEditable && (
              <Button
                onClick={() => {
                  onClose();
                  onEdit(resource);
                }}
                variant="primary"
                className="gap-1.5 h-10 px-4 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white"
                id="btn-details-edit"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit Reference
              </Button>
            )}
          </div>
        </div>
      </div>
    </Sheet>
  );
}
