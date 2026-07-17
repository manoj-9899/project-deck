import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { WorkspaceOutletContext } from "../project-workspace/ProjectWorkspaceLayout";
import { useProjectTasks } from "../../hooks/useProjectTasks";
import { useProjectRoadmap } from "../../hooks/useProjectRoadmap";
import { ProjectTask, TaskStatus } from "../../types/project-task";

// Component imports
import TasksSummary from "./TasksSummary";
import TasksToolbar from "./TasksToolbar";
import TaskList from "./TaskList";
import TaskBoard from "./TaskBoard";
import TaskDetails from "./TaskDetails";
import TaskFormDialog from "./TaskFormDialog";

// UI imports
import { Dialog } from "../ui/Dialog";
import { Button } from "../ui/Button";

export default function ProjectTasksPage() {
  const { project } = useOutletContext<WorkspaceOutletContext>();
  
  // Custom Hooks
  const tasksState = useProjectTasks(project.id);
  const roadmapState = useProjectRoadmap(project.id);

  const isReadOnly = project.isArchived;
  const isEditable = !isReadOnly;

  // Active Phase lists for selectors (for form linkages and toolbar filters)
  const phasesList = React.useMemo(() => {
    return roadmapState.phases.map((p) => ({
      id: p.id,
      title: p.title,
    }));
  }, [roadmapState.phases]);

  // Modal / Sheet Dialog controllers
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ProjectTask | null>(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeDetailsTask, setActiveDetailsTask] = useState<ProjectTask | null>(null);

  // In-app custom confirmation state
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    confirmVariant?: "primary" | "danger";
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    description: "",
    confirmLabel: "",
    confirmVariant: "primary",
    onConfirm: () => {},
  });

  // Action: Open Create Task Form
  const handleOpenCreateForm = () => {
    if (!isEditable) return;
    setEditingTask(null);
    setIsFormOpen(true);
  };

  // Action: Open Edit Task Form
  const handleOpenEditForm = (task: ProjectTask) => {
    if (!isEditable) return;
    setEditingTask(task);
    setIsFormOpen(true);
  };

  // Action: Submit Create or Edit Form
  const handleFormSubmit = (data: any) => {
    if (!isEditable) return;
    
    let success = false;
    if (editingTask) {
      success = tasksState.updateTask(editingTask.id, data);
    } else {
      success = tasksState.addTask(data);
    }

    if (success) {
      setIsFormOpen(false);
      setEditingTask(null);
    }
  };

  // Action: Open Details Sheet
  const handleOpenDetails = (task: ProjectTask) => {
    // We want details to sync with any active updates. Fetch most up-to-date task ref
    const freshRef = tasksState.allTasks.find((t) => t.id === task.id) || task;
    setActiveDetailsTask(freshRef);
    setIsDetailsOpen(true);
  };

  // Action: Quick Status lane update
  const handleChangeStatus = (taskId: string, status: TaskStatus) => {
    if (!isEditable) return;
    tasksState.updateTask(taskId, { status });
  };

  // Action: Toggle Archive with confirmation
  const handleToggleArchive = (taskId: string) => {
    if (!isEditable) return;
    const task = tasksState.allTasks.find((t) => t.id === taskId);
    if (!task) return;

    if (!task.isArchived) {
      // Archive confirmation
      setConfirmState({
        isOpen: true,
        title: "Archive Project Task?",
        description: `Are you sure you want to archive "${task.title}"? This hides it from your active workspace lists.`,
        confirmLabel: "Archive Task",
        confirmVariant: "danger",
        onConfirm: () => {
          tasksState.toggleArchiveTask(taskId);
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
        },
      });
    } else {
      // Direct restore (no warning needed for unarchive)
      tasksState.toggleArchiveTask(taskId);
    }
  };

  // Action: Temporary Deletion with confirmation
  const handleDeleteTask = (taskId: string) => {
    if (!isEditable) return;
    const task = tasksState.allTasks.find((t) => t.id === taskId);
    if (!task) return;

    setConfirmState({
      isOpen: true,
      title: "Permanently Delete Task?",
      description: `Are you sure you want to delete "${task.title}"? This action is in-memory and will reset upon page refresh.`,
      confirmLabel: "Delete Task",
      confirmVariant: "danger",
      onConfirm: () => {
        tasksState.deleteTask(taskId);
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Action: Reset Demo state with confirmation
  const handleResetDemo = () => {
    if (!isEditable) return;
    setConfirmState({
      isOpen: true,
      title: "Reset Task Demo State?",
      description: "Are you sure you want to restore the task list to original mock values? Any temporary changes you made will be discarded.",
      confirmLabel: "Reset State",
      confirmVariant: "danger",
      onConfirm: () => {
        tasksState.resetTasksDemoState();
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const hasActiveFilters = 
    tasksState.statusFilter !== "All" ||
    tasksState.priorityFilter !== "All" ||
    tasksState.phaseFilter !== "All" ||
    tasksState.blockedFilter !== "All" ||
    tasksState.dueFilter !== "All" ||
    tasksState.archivedFilter !== "Active" ||
    tasksState.searchQuery !== "";

  return (
    <div className="flex flex-col gap-5 w-full font-sans max-w-full overflow-hidden" id="project-tasks-page">
      
      {/* 1. Header and subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-base font-sans font-semibold text-text-primary tracking-tight">
            Project Tasks
          </h2>
          <p className="text-xs text-text-tertiary">
            Organize, prioritize, search, and track engineering tasks, blocker states, and deliverables.
          </p>
        </div>
      </div>

      {/* 2. Demo Mode Notice Banner (Only if project is editable) */}
      <div className="flex flex-wrap items-center gap-2 px-4 py-3 bg-status-warning/5 border border-status-warning/20 rounded-xl text-xs text-text-secondary leading-relaxed shadow-3xs font-medium">
        <span className="flex h-2 w-2 rounded-full bg-status-warning animate-pulse" />
        <span>Demo mode: task changes are stored in-memory and will reset after refreshing your browser tab.</span>
        {!isReadOnly && (
          <button 
            onClick={handleResetDemo}
            className="text-accent-primary hover:underline font-semibold ml-auto focus:outline-none"
          >
            Reset Tasks Now
          </button>
        )}
      </div>

      {/* 3. Compact Tasks Summary Panel */}
      <TasksSummary summary={tasksState.summary} />

      {/* 4. Filter Toolbar Actions */}
      <TasksToolbar
        viewMode={tasksState.viewMode}
        setViewMode={tasksState.setViewMode}
        searchQuery={tasksState.searchQuery}
        setSearchQuery={tasksState.setSearchQuery}
        statusFilter={tasksState.statusFilter}
        setStatusFilter={tasksState.setStatusFilter}
        priorityFilter={tasksState.priorityFilter}
        setPriorityFilter={tasksState.setPriorityFilter}
        phaseFilter={tasksState.phaseFilter}
        setPhaseFilter={tasksState.setPhaseFilter}
        blockedFilter={tasksState.blockedFilter}
        setBlockedFilter={tasksState.setBlockedFilter}
        dueFilter={tasksState.dueFilter}
        setDueFilter={tasksState.setDueFilter}
        archivedFilter={tasksState.archivedFilter}
        setArchivedFilter={tasksState.setArchivedFilter}
        sortBy={tasksState.sortBy}
        setSortBy={tasksState.setSortBy}
        clearFilters={tasksState.clearFilters}
        phases={phasesList}
        onAddTask={handleOpenCreateForm}
        onResetDemo={handleResetDemo}
        isEditable={isEditable}
        resultCount={tasksState.tasks.length}
      />

      {/* 5. Results Count Indicator for Non-Desktop viewports */}
      {hasActiveFilters && (
        <p className="lg:hidden text-xs text-text-tertiary font-sans font-medium px-1">
          Showing {tasksState.tasks.length} matching deliverables out of {tasksState.allTasks.length} total active tasks.
        </p>
      )}

      {/* 6. Tasks View Container: List vs Board lanes */}
      <div id="tasks-main-content-area" className="flex flex-col min-w-full">
        {tasksState.viewMode === "list" ? (
          <TaskList
            tasks={tasksState.tasks}
            allTasks={tasksState.allTasks}
            phases={phasesList}
            searchQuery={tasksState.searchQuery}
            hasActiveFilters={hasActiveFilters}
            archivedFilter={tasksState.archivedFilter}
            isEditable={isEditable}
            onAddTask={handleOpenCreateForm}
            onClearFilters={tasksState.clearFilters}
            onOpenDetails={handleOpenDetails}
            onEdit={handleOpenEditForm}
            onDuplicate={tasksState.duplicateTask}
            onChangeStatus={handleChangeStatus}
            onToggleArchive={handleToggleArchive}
            onDelete={handleDeleteTask}
          />
        ) : (
          <TaskBoard
            tasks={tasksState.tasks}
            allTasks={tasksState.allTasks}
            phases={phasesList}
            searchQuery={tasksState.searchQuery}
            hasActiveFilters={hasActiveFilters}
            statusFilter={tasksState.statusFilter}
            archivedFilter={tasksState.archivedFilter}
            isEditable={isEditable}
            onAddTask={handleOpenCreateForm}
            onClearFilters={tasksState.clearFilters}
            onOpenDetails={handleOpenDetails}
            onEdit={handleOpenEditForm}
            onDuplicate={tasksState.duplicateTask}
            onChangeStatus={handleChangeStatus}
            onToggleArchive={handleToggleArchive}
            onDelete={handleDeleteTask}
          />
        )}
      </div>

      {/* 7. Task Form Dialog Modal (Creation and editing) */}
      <TaskFormDialog
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTask(null);
        }}
        initialData={editingTask || undefined}
        phases={phasesList}
        allTasks={tasksState.allTasks}
        onSubmit={handleFormSubmit}
      />

      {/* 8. Full specifications details panel drawer */}
      <TaskDetails
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setActiveDetailsTask(null);
        }}
        task={activeDetailsTask}
        phases={phasesList}
        onEdit={handleOpenEditForm}
        onDuplicate={tasksState.duplicateTask}
        onChangeStatus={handleChangeStatus}
        onToggleArchive={handleToggleArchive}
        onDelete={handleDeleteTask}
        isEditable={isEditable}
      />

      {/* 9. Reusable generic In-App Confirmation Dialog */}
      <Dialog
        id="task-generic-confirm-dialog"
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
        title={confirmState.title}
        description={confirmState.description}
        footer={
          <div className="flex justify-end gap-2.5">
            <Button
              id="task-confirm-cancel-btn"
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
            >
              Cancel Action
            </Button>
            <Button
              id="task-confirm-action-btn"
              type="button"
              variant={confirmState.confirmVariant || "primary"}
              size="sm"
              onClick={confirmState.onConfirm}
            >
              {confirmState.confirmLabel}
            </Button>
          </div>
        }
      >
        <p className="text-xs text-text-secondary leading-relaxed">
          Are you sure you want to proceed with this operation? In demo mode, changes reside in the tab memory and are reset after refreshing.
        </p>
      </Dialog>

    </div>
  );
}
