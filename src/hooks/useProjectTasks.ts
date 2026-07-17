import { useState, useEffect, useCallback, useMemo } from "react";
import { ProjectTask, TaskStatus } from "../types/project-task";
import { getInitialTasks, getFallbackTasks } from "../data/project-tasks";
import { MOCK_PROJECTS_DIRECTORY } from "../data/projects";
import { useToast } from "../components/ui/Toast";
import { Priority } from "../types";

// In-memory session store
let inMemoryTasks: Record<string, ProjectTask[]> = {};
let isTasksStoreInitialized = false;

const ensureTasksStoreInitialized = () => {
  if (!isTasksStoreInitialized) {
    inMemoryTasks = getInitialTasks();
    isTasksStoreInitialized = true;
  }
};

export const useProjectTasks = (projectId: string) => {
  const { toast } = useToast();
  ensureTasksStoreInitialized();

  // Find project details
  const project = MOCK_PROJECTS_DIRECTORY.find(
    (p) => p.id === projectId || p.slug === projectId
  );
  const cleanProjectId = project ? project.id : projectId;

  // Initialize if empty
  if (!inMemoryTasks[cleanProjectId]) {
    inMemoryTasks[cleanProjectId] = getFallbackTasks(cleanProjectId);
  }

  // React local states
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "board">("list");
  
  // Filtering & Sorting states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");
  const [phaseFilter, setPhaseFilter] = useState<string>("All");
  const [blockedFilter, setBlockedFilter] = useState<string>("All"); // "All" | "Blocked" | "Unblocked"
  const [dueFilter, setDueFilter] = useState<string>("All"); // "All" | "Overdue" | "Due Soon" | "No Due Date"
  const [archivedFilter, setArchivedFilter] = useState<string>("Active"); // "Active" | "Archived" | "All"
  const [sortBy, setSortBy] = useState<string>("updatedAt"); // "updatedAt" | "dueDate" | "priority" | "status" | "title"

  const syncState = useCallback(() => {
    setTasks([...(inMemoryTasks[cleanProjectId] || [])]);
  }, [cleanProjectId]);

  useEffect(() => {
    syncState();
  }, [syncState]);

  // Summary statistics calculated on the raw, unfiltered tasks for this project
  const summary = useMemo(() => {
    const rawList = inMemoryTasks[cleanProjectId] || [];
    const activeList = rawList.filter(t => !t.isArchived);
    
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(now.getDate() + 3);
    const threeDaysStr = threeDaysFromNow.toISOString().split('T')[0];

    const dueSoonCount = activeList.filter(t => {
      if (!t.dueDate || t.status === "Completed") return false;
      return t.dueDate >= todayStr && t.dueDate <= threeDaysStr;
    }).length;

    return {
      total: activeList.length,
      inProgress: activeList.filter(t => t.status === "In progress").length,
      dueSoon: dueSoonCount,
      blocked: activeList.filter(t => t.isBlocked).length,
      completed: activeList.filter(t => t.status === "Completed").length,
    };
  }, [tasks, cleanProjectId]);

  // Handle task actions
  const validateTitle = useCallback((title: string, excludeTaskId?: string): { valid: boolean; error?: string } => {
    const cleanTitle = title.trim().toLowerCase();
    if (!cleanTitle) {
      return { valid: false, error: "Task title is required" };
    }
    
    const rawList = inMemoryTasks[cleanProjectId] || [];
    const duplicate = rawList.find(t => 
      !t.isArchived && 
      t.id !== excludeTaskId && 
      t.title.trim().toLowerCase() === cleanTitle
    );

    if (duplicate) {
      return { valid: false, error: `A task named "${t => t.title}" already exists in this project.` };
    }
    return { valid: true };
  }, [cleanProjectId]);

  const addTask = useCallback((taskData: Partial<ProjectTask>): boolean => {
    if (!taskData.title) {
      toast({
        type: "error",
        title: "Validation Error",
        message: "Task title is required.",
      });
      return false;
    }

    const cleanTitle = taskData.title.trim();
    const rawList = inMemoryTasks[cleanProjectId] || [];
    const isDuplicate = rawList.some(t => !t.isArchived && t.title.toLowerCase() === cleanTitle.toLowerCase());
    if (isDuplicate) {
      toast({
        type: "error",
        title: "Duplicate Title",
        message: `An active task with the title "${cleanTitle}" already exists.`,
      });
      return false;
    }

    if (taskData.isBlocked && !taskData.blockerReason?.trim()) {
      toast({
        type: "error",
        title: "Validation Error",
        message: "A blocker reason is required for blocked tasks.",
      });
      return false;
    }

    const maxOrder = rawList.reduce((max, t) => t.order > max ? t.order : max, 0);

    const newTask: ProjectTask = {
      id: `${cleanProjectId}-task-${Date.now()}`,
      projectId: cleanProjectId,
      phaseId: taskData.phaseId || undefined,
      title: cleanTitle,
      description: taskData.description || "",
      status: taskData.status || "To do",
      priority: taskData.priority || "Medium",
      dueDate: taskData.dueDate || undefined,
      labels: taskData.labels || [],
      isBlocked: !!taskData.isBlocked,
      blockerReason: taskData.isBlocked ? taskData.blockerReason : undefined,
      notes: taskData.notes || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: taskData.status === "Completed" ? new Date().toISOString() : undefined,
      isArchived: false,
      order: maxOrder + 1,
    };

    inMemoryTasks[cleanProjectId] = [newTask, ...rawList];
    syncState();

    toast({
      type: "success",
      title: "Task Created",
      message: `"${cleanTitle}" has been added to your task list.`,
    });
    return true;
  }, [cleanProjectId, syncState, toast]);

  const updateTask = useCallback((taskId: string, taskData: Partial<ProjectTask>): boolean => {
    const rawList = inMemoryTasks[cleanProjectId] || [];
    const taskIndex = rawList.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return false;

    if (taskData.title) {
      const cleanTitle = taskData.title.trim();
      const isDuplicate = rawList.some(t => 
        t.id !== taskId && 
        !t.isArchived && 
        t.title.toLowerCase() === cleanTitle.toLowerCase()
      );
      if (isDuplicate) {
        toast({
          type: "error",
          title: "Duplicate Title",
          message: `An active task with the title "${cleanTitle}" already exists.`,
        });
        return false;
      }
    }

    if (taskData.isBlocked && !taskData.blockerReason?.trim()) {
      toast({
        type: "error",
        title: "Validation Error",
        message: "A blocker reason is required for blocked tasks.",
      });
      return false;
    }

    const currentTask = rawList[taskIndex];
    const originalStatus = currentTask.status;
    const nextStatus = taskData.status || originalStatus;

    let completedAt = currentTask.completedAt;
    if (nextStatus === "Completed" && originalStatus !== "Completed") {
      completedAt = new Date().toISOString();
    } else if (nextStatus !== "Completed") {
      completedAt = undefined;
    }

    const updatedTask: ProjectTask = {
      ...currentTask,
      ...taskData,
      completedAt,
      updatedAt: new Date().toISOString(),
    };

    const updatedList = [...rawList];
    updatedList[taskIndex] = updatedTask;
    inMemoryTasks[cleanProjectId] = updatedList;
    syncState();

    toast({
      type: "success",
      title: "Task Updated",
      message: `Task details have been saved.`,
    });
    return true;
  }, [cleanProjectId, syncState, toast]);

  const deleteTask = useCallback((taskId: string) => {
    const rawList = inMemoryTasks[cleanProjectId] || [];
    const taskToDelete = rawList.find(t => t.id === taskId);
    if (!taskToDelete) return;

    inMemoryTasks[cleanProjectId] = rawList.filter(t => t.id !== taskId);
    syncState();

    toast({
      type: "success",
      title: "Task Deleted",
      message: `"${taskToDelete.title}" was permanently deleted from local memory.`,
    });
  }, [cleanProjectId, syncState, toast]);

  const duplicateTask = useCallback((taskId: string) => {
    const rawList = inMemoryTasks[cleanProjectId] || [];
    const taskToDuplicate = rawList.find(t => t.id === taskId);
    if (!taskToDuplicate) return;

    const baseTitle = taskToDuplicate.title;
    const copiedTitle = `${baseTitle} Copy`;
    
    // Ensure no duplicate conflicts
    const isDuplicate = rawList.some(t => !t.isArchived && t.title.toLowerCase() === copiedTitle.toLowerCase());
    if (isDuplicate) {
      toast({
        type: "error",
        title: "Duplication Failed",
        message: `An active task named "${copiedTitle}" already exists.`,
      });
      return;
    }

    const maxOrder = rawList.reduce((max, t) => t.order > max ? t.order : max, 0);

    const duplicatedTask: ProjectTask = {
      ...taskToDuplicate,
      id: `${cleanProjectId}-task-${Date.now()}`,
      title: copiedTitle,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: taskToDuplicate.status === "Completed" ? new Date().toISOString() : undefined,
      order: maxOrder + 1,
    };

    inMemoryTasks[cleanProjectId] = [duplicatedTask, ...rawList];
    syncState();

    toast({
      type: "success",
      title: "Task Duplicated",
      message: `Duplicated "${baseTitle}" as "${copiedTitle}".`,
    });
  }, [cleanProjectId, syncState, toast]);

  const toggleArchiveTask = useCallback((taskId: string) => {
    const rawList = inMemoryTasks[cleanProjectId] || [];
    const taskIndex = rawList.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    const currentTask = rawList[taskIndex];
    const willArchive = !currentTask.isArchived;

    // If unarchiving, verify we do not introduce a duplicate active title
    if (!willArchive) {
      const isDuplicate = rawList.some(t => 
        t.id !== taskId && 
        !t.isArchived && 
        t.title.toLowerCase() === currentTask.title.toLowerCase()
      );
      if (isDuplicate) {
        toast({
          type: "error",
          title: "Restore Failed",
          message: `Cannot restore "${currentTask.title}" because an active task with this title already exists.`,
        });
        return;
      }
    }

    const updatedTask: ProjectTask = {
      ...currentTask,
      isArchived: willArchive,
      updatedAt: new Date().toISOString(),
    };

    const updatedList = [...rawList];
    updatedList[taskIndex] = updatedTask;
    inMemoryTasks[cleanProjectId] = updatedList;
    syncState();

    toast({
      type: "success",
      title: willArchive ? "Task Archived" : "Task Restored",
      message: willArchive
        ? `"${currentTask.title}" has been moved to archives.`
        : `"${currentTask.title}" has been restored to the active task pool.`,
    });
  }, [cleanProjectId, syncState, toast]);

  const resetTasksDemoState = useCallback(() => {
    const initial = getInitialTasks();
    if (initial[cleanProjectId]) {
      inMemoryTasks[cleanProjectId] = initial[cleanProjectId];
    } else {
      inMemoryTasks[cleanProjectId] = getFallbackTasks(cleanProjectId);
    }
    syncState();
    toast({
      type: "success",
      title: "Demo Reset",
      message: "The task list has been restored to its original mock values.",
    });
  }, [cleanProjectId, syncState, toast]);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setStatusFilter("All");
    setPriorityFilter("All");
    setPhaseFilter("All");
    setBlockedFilter("All");
    setDueFilter("All");
    setArchivedFilter("Active");
  }, []);

  // Filter and Sort implementation
  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // 1. Archive filter
    if (archivedFilter === "Active") {
      result = result.filter(t => !t.isArchived);
    } else if (archivedFilter === "Archived") {
      result = result.filter(t => t.isArchived);
    }

    // 2. Status filter
    if (statusFilter !== "All") {
      result = result.filter(t => t.status === statusFilter);
    }

    // 3. Priority filter
    if (priorityFilter !== "All") {
      result = result.filter(t => t.priority === priorityFilter);
    }

    // 4. Phase filter
    if (phaseFilter !== "All") {
      if (phaseFilter === "Unassigned") {
        result = result.filter(t => !t.phaseId);
      } else {
        result = result.filter(t => t.phaseId === phaseFilter);
      }
    }

    // 5. Blocked filter
    if (blockedFilter === "Blocked") {
      result = result.filter(t => t.isBlocked);
    } else if (blockedFilter === "Unblocked") {
      result = result.filter(t => !t.isBlocked);
    }

    // 6. Due state filter
    if (dueFilter !== "All") {
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(now.getDate() + 3);
      const threeDaysStr = threeDaysFromNow.toISOString().split('T')[0];

      if (dueFilter === "Overdue") {
        result = result.filter(t => t.dueDate && t.dueDate < todayStr && t.status !== "Completed");
      } else if (dueFilter === "Due Soon") {
        result = result.filter(t => t.dueDate && t.dueDate >= todayStr && t.dueDate <= threeDaysStr && t.status !== "Completed");
      } else if (dueFilter === "No Due Date") {
        result = result.filter(t => !t.dueDate);
      }
    }

    // 7. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(t => 
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.notes && t.notes.toLowerCase().includes(q)) ||
        t.labels.some(l => l.toLowerCase().includes(q))
      );
    }

    // 8. Sorting
    result.sort((a, b) => {
      if (sortBy === "updatedAt") {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      if (sortBy === "dueDate") {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      }
      if (sortBy === "priority") {
        const priorityWeight = { Critical: 4, High: 3, Medium: 2, Low: 1 };
        const weightA = priorityWeight[a.priority] || 0;
        const weightB = priorityWeight[b.priority] || 0;
        return weightB - weightA;
      }
      if (sortBy === "status") {
        const statusWeight = { "Backlog": 1, "To do": 2, "In progress": 3, "Blocked": 4, "Completed": 5 };
        const weightA = statusWeight[a.status] || 0;
        const weightB = statusWeight[b.status] || 0;
        return weightA - weightB;
      }
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return result;
  }, [tasks, searchQuery, statusFilter, priorityFilter, phaseFilter, blockedFilter, dueFilter, archivedFilter, sortBy]);

  return {
    tasks: filteredAndSortedTasks,
    allTasks: tasks,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    phaseFilter,
    setPhaseFilter,
    blockedFilter,
    setBlockedFilter,
    dueFilter,
    setDueFilter,
    archivedFilter,
    setArchivedFilter,
    sortBy,
    setSortBy,
    summary,
    addTask,
    updateTask,
    deleteTask,
    duplicateTask,
    toggleArchiveTask,
    resetTasksDemoState,
    clearFilters,
  };
};
