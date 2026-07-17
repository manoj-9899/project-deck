/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ProjectResource, ResourceStatus } from "../../types/project-resource";
import ResourceCard from "./ResourceCard";
import ResourceListItem from "./ResourceListItem";
import ResourcesEmptyState from "./ResourcesEmptyState";

interface ResourceListProps {
  resources: ProjectResource[];
  allResourcesCount: number;
  searchQuery: string;
  hasFilters: boolean;
  isGridView: boolean;
  onOpenDetails: (res: ProjectResource) => void;
  onEdit: (res: ProjectResource) => void;
  onDuplicate: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onChangeStatus: (id: string, s: ResourceStatus) => void;
  onDelete: (id: string) => void;
  onOpenResource: (id: string) => void;
  isEditable: boolean;
  onAddResource: () => void;
  onClearFilters: () => void;
}

export default function ResourceList({
  resources,
  allResourcesCount,
  searchQuery,
  hasFilters,
  isGridView,
  onOpenDetails,
  onEdit,
  onDuplicate,
  onToggleFavorite,
  onToggleArchive,
  onChangeStatus,
  onDelete,
  onOpenResource,
  isEditable,
  onAddResource,
  onClearFilters,
}: ResourceListProps) {
  if (resources.length === 0) {
    return (
      <ResourcesEmptyState
        hasFilters={hasFilters}
        searchQuery={searchQuery}
        onClearFilters={onClearFilters}
        onAddResource={onAddResource}
        isEditable={isEditable}
      />
    );
  }

  return (
    <div className="w-full animate-fade-in" id="project-resources-list-wrapper">
      {isGridView ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((res) => (
            <ResourceCard
              key={res.id}
              resource={res}
              onOpenDetails={onOpenDetails}
              onEdit={onEdit}
              onDuplicate={onDuplicate}
              onToggleFavorite={onToggleFavorite}
              onToggleArchive={onToggleArchive}
              onChangeStatus={onChangeStatus}
              onDelete={onDelete}
              onOpenResource={onOpenResource}
              isEditable={isEditable}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {resources.map((res) => (
            <ResourceListItem
              key={res.id}
              resource={res}
              onOpenDetails={onOpenDetails}
              onEdit={onEdit}
              onDuplicate={onDuplicate}
              onToggleFavorite={onToggleFavorite}
              onToggleArchive={onToggleArchive}
              onChangeStatus={onChangeStatus}
              onDelete={onDelete}
              onOpenResource={onOpenResource}
              isEditable={isEditable}
            />
          ))}
        </div>
      )}
    </div>
  );
}
