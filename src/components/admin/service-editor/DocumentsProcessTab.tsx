import {
  ArrowDown,
  ArrowUp,
  GripVertical,
  Plus,
  Trash2,
} from "lucide-react";

import {
  createEmptyDocumentGroup,
  createEmptyProcessStep,
  serviceIconOptions,
} from "../../../constants/serviceEditor";
import type {
  ServiceDocumentGroup,
  ServiceProcessStep,
} from "../../../types/serviceEditor";

interface DocumentsProcessTabProps {
  documentGroups: ServiceDocumentGroup[];
  processSteps: ServiceProcessStep[];
  onDocumentGroupsChange: (groups: ServiceDocumentGroup[]) => void;
  onProcessStepsChange: (steps: ServiceProcessStep[]) => void;
}

const inputClass =
  "h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
const textareaClass =
  "w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

function moveItem<T>(items: T[], index: number, direction: -1 | 1): T[] {
  const targetIndex = index + direction;

  if (targetIndex < 0 || targetIndex >= items.length) {
    return items;
  }

  const nextItems = [...items];
  [nextItems[index], nextItems[targetIndex]] = [
    nextItems[targetIndex],
    nextItems[index],
  ];
  return nextItems;
}

function DocumentsProcessTab({
  documentGroups,
  processSteps,
  onDocumentGroupsChange,
  onProcessStepsChange,
}: DocumentsProcessTabProps) {
  function updateDocumentGroup<K extends keyof ServiceDocumentGroup>(
    groupId: string,
    field: K,
    value: ServiceDocumentGroup[K],
  ): void {
    onDocumentGroupsChange(
      documentGroups.map((group) =>
        group.id === groupId ? { ...group, [field]: value } : group,
      ),
    );
  }

  function addDocumentItem(groupId: string): void {
    onDocumentGroupsChange(
      documentGroups.map((group) =>
        group.id === groupId
          ? { ...group, items: [...group.items, ""] }
          : group,
      ),
    );
  }

  function updateDocumentItem(
    groupId: string,
    itemIndex: number,
    value: string,
  ): void {
    onDocumentGroupsChange(
      documentGroups.map((group) => {
        if (group.id !== groupId) {
          return group;
        }

        return {
          ...group,
          items: group.items.map((item, index) =>
            index === itemIndex ? value : item,
          ),
        };
      }),
    );
  }

  function removeDocumentItem(groupId: string, itemIndex: number): void {
    onDocumentGroupsChange(
      documentGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              items: group.items.filter((_, index) => index !== itemIndex),
            }
          : group,
      ),
    );
  }

  function updateProcessStep<K extends keyof ServiceProcessStep>(
    stepId: string,
    field: K,
    value: ServiceProcessStep[K],
  ): void {
    onProcessStepsChange(
      processSteps.map((step) =>
        step.id === stepId ? { ...step, [field]: value } : step,
      ),
    );
  }

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Required Documents
            </h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Create groups such as Applicant Documents, Business Documents and
              Address Documents.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              onDocumentGroupsChange([
                ...documentGroups,
                createEmptyDocumentGroup(documentGroups.length + 1),
              ])
            }
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1266f1] px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Document Group
          </button>
        </div>

        {documentGroups.length === 0 ? (
          <div className="mt-5 rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">
            No document groups added yet.
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {documentGroups.map((group, groupIndex) => (
              <article
                key={group.id}
                className="rounded-xl border border-slate-200 p-4 sm:p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                  <div className="flex items-center gap-2 text-slate-400">
                    <GripVertical className="h-5 w-5" />
                    <span className="text-sm font-bold text-slate-700">
                      {groupIndex + 1}
                    </span>
                  </div>

                  <div className="grid min-w-0 flex-1 gap-4 sm:grid-cols-[minmax(0,1fr)_190px]">
                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold text-slate-600">
                        Group Heading
                      </span>
                      <input
                        value={group.title}
                        onChange={(event) =>
                          updateDocumentGroup(
                            group.id,
                            "title",
                            event.target.value,
                          )
                        }
                        className={inputClass}
                        placeholder="Applicant Documents"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold text-slate-600">
                        Icon
                      </span>
                      <select
                        value={group.iconName}
                        onChange={(event) =>
                          updateDocumentGroup(
                            group.id,
                            "iconName",
                            event.target.value,
                          )
                        }
                        className={inputClass}
                      >
                        {serviceIconOptions.map((option) => (
                          <option key={option.name} value={option.name}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onDocumentGroupsChange(
                          moveItem(documentGroups, groupIndex, -1),
                        )
                      }
                      disabled={groupIndex === 0}
                      className="rounded-lg border border-slate-200 p-2 text-slate-500 disabled:opacity-25"
                      aria-label={`Move ${group.title} up`}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onDocumentGroupsChange(
                          moveItem(documentGroups, groupIndex, 1),
                        )
                      }
                      disabled={groupIndex === documentGroups.length - 1}
                      className="rounded-lg border border-slate-200 p-2 text-slate-500 disabled:opacity-25"
                      aria-label={`Move ${group.title} down`}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onDocumentGroupsChange(
                          documentGroups.filter(
                            (item) => item.id !== group.id,
                          ),
                        )
                      }
                      className="rounded-lg border border-red-200 p-2 text-red-500 transition hover:bg-red-50"
                      aria-label={`Delete ${group.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-5 rounded-lg bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-700">
                      Checklist Items
                    </p>
                    <button
                      type="button"
                      onClick={() => addDocumentItem(group.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Item
                    </button>
                  </div>

                  <div className="mt-3 space-y-2.5">
                    {group.items.length === 0 && (
                      <p className="text-xs text-slate-400">
                        No checklist items added.
                      </p>
                    )}

                    {group.items.map((item, itemIndex) => (
                      <div key={`${group.id}-${itemIndex}`} className="flex gap-2">
                        <input
                          value={item}
                          onChange={(event) =>
                            updateDocumentItem(
                              group.id,
                              itemIndex,
                              event.target.value,
                            )
                          }
                          className={inputClass}
                          placeholder="PAN Card of the applicant"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            removeDocumentItem(group.id, itemIndex)
                          }
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-red-200 text-red-500 transition hover:bg-red-50"
                          aria-label="Remove checklist item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Service Process
            </h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Build the numbered process shown as a timeline on desktop and
              vertically on mobile.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              onProcessStepsChange([
                ...processSteps,
                createEmptyProcessStep(processSteps.length + 1),
              ])
            }
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1266f1] px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Process Step
          </button>
        </div>

        {processSteps.length === 0 ? (
          <div className="mt-5 rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">
            No process steps added yet.
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {processSteps.map((step, index) => (
              <article
                key={step.id}
                className="grid gap-4 rounded-xl border border-slate-200 p-4 sm:p-5 lg:grid-cols-[56px_minmax(0,0.9fr)_minmax(0,1.4fr)_180px_auto] lg:items-start"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {index + 1}
                </div>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-600">
                    Step Heading
                  </span>
                  <input
                    value={step.heading}
                    onChange={(event) =>
                      updateProcessStep(
                        step.id,
                        "heading",
                        event.target.value,
                      )
                    }
                    className={inputClass}
                    placeholder="Initial consultation"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-600">
                    Short Description
                  </span>
                  <textarea
                    value={step.description}
                    onChange={(event) =>
                      updateProcessStep(
                        step.id,
                        "description",
                        event.target.value,
                      )
                    }
                    rows={3}
                    className={textareaClass}
                    placeholder="Explain what happens during this step."
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-600">
                    Icon
                  </span>
                  <select
                    value={step.iconName}
                    onChange={(event) =>
                      updateProcessStep(
                        step.id,
                        "iconName",
                        event.target.value,
                      )
                    }
                    className={inputClass}
                  >
                    {serviceIconOptions.map((option) => (
                      <option key={option.name} value={option.name}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="flex items-center gap-2 lg:pt-6">
                  <button
                    type="button"
                    onClick={() =>
                      onProcessStepsChange(moveItem(processSteps, index, -1))
                    }
                    disabled={index === 0}
                    className="rounded-lg border border-slate-200 p-2 text-slate-500 disabled:opacity-25"
                    aria-label={`Move ${step.heading} up`}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onProcessStepsChange(moveItem(processSteps, index, 1))
                    }
                    disabled={index === processSteps.length - 1}
                    className="rounded-lg border border-slate-200 p-2 text-slate-500 disabled:opacity-25"
                    aria-label={`Move ${step.heading} down`}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onProcessStepsChange(
                        processSteps.filter((item) => item.id !== step.id),
                      )
                    }
                    className="rounded-lg border border-red-200 p-2 text-red-500 transition hover:bg-red-50"
                    aria-label={`Delete ${step.heading}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default DocumentsProcessTab;
