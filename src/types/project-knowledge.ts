export type KnowledgeEntryType =
  | "Note"
  | "Decision"
  | "Documentation"
  | "Error & Solution"
  | "Research"
  | "Meeting"
  | "Implementation Summary";

export type DecisionStatus =
  | "Proposed"
  | "Accepted"
  | "Superseded"
  | "Rejected";

export interface ProjectKnowledgeEntry {
  id: string;
  projectId: string;
  title: string;
  content: string;
  type: KnowledgeEntryType;
  status?: DecisionStatus; // For Decisions
  tags: string[];
  isPinned: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  relatedPhaseId?: string; // Linked roadmap phase
  relatedTaskId?: string; // Linked task
  
  // Decision specific
  decision?: string;
  rationale?: string;
  alternatives?: string;
  consequences?: string;

  // Error & Solution specific
  errorMessage?: string;
  solution?: string;
  context?: string;
  rootCause?: string;
  preventionNotes?: string;
}
