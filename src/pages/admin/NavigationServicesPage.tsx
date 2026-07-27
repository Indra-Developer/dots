import {
  AlertCircle,
  CheckCircle2,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router";

import DeleteNavigationItemModal from "../../components/admin/navigation-services/DeleteNavigationItemModal";
import NavigationCategoryPanel from "../../components/admin/navigation-services/NavigationCategoryPanel";
import NavigationItemDrawer from "../../components/admin/navigation-services/NavigationItemDrawer";
import NavigationServicePanel from "../../components/admin/navigation-services/NavigationServicePanel";
import {
  createEmptyCategoryForm,
  createEmptyServiceForm,
  slugifyNavigationValue,
} from "../../constants/navigationServices";
import {
  deleteNavigationCategory,
  deleteNavigationService,
  getNavigationManagerData,
  saveNavigationCategory,
  saveNavigationService,
  updateNavigationCategoryActive,
  updateNavigationCategoryOrder,
  updateNavigationServiceActive,
  updateNavigationServiceOrder,
} from "../../services/admin/navigationServicesService";
import type {
  CategoryFormState,
  DeleteNavigationTarget,
  NavigationCategory,
  NavigationDrawerMode,
  NavigationService,
  ServiceFormState,
} from "../../types/navigationServices";

function normalizeOrders<T extends { displayOrder: number }>(
  items: T[],
): T[] {
  return items.map((item, index) => ({
    ...item,
    displayOrder: index + 1,
  }));
}

function reorderItems<T extends { id: string; displayOrder: number }>(
  items: T[],
  sourceId: string,
  targetId: string,
): T[] {
  const sourceIndex = items.findIndex((item) => item.id === sourceId);
  const targetIndex = items.findIndex((item) => item.id === targetId);

  if (
    sourceIndex < 0 ||
    targetIndex < 0 ||
    sourceIndex === targetIndex
  ) {
    return items;
  }

  const nextItems = [...items];
  const [movedItem] = nextItems.splice(sourceIndex, 1);
  nextItems.splice(targetIndex, 0, movedItem);

  return normalizeOrders(nextItems);
}

function moveItem<T extends { id: string; displayOrder: number }>(
  items: T[],
  itemId: string,
  direction: -1 | 1,
): T[] {
  const currentIndex = items.findIndex((item) => item.id === itemId);
  const targetIndex = currentIndex + direction;

  if (
    currentIndex < 0 ||
    targetIndex < 0 ||
    targetIndex >= items.length
  ) {
    return items;
  }

  const nextItems = [...items];
  [nextItems[currentIndex], nextItems[targetIndex]] = [
    nextItems[targetIndex],
    nextItems[currentIndex],
  ];

  return normalizeOrders(nextItems);
}

function NavigationServicesPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState<NavigationCategory[]>([]);
  const [services, setServices] = useState<NavigationService[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [notice, setNotice] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] =
    useState<NavigationDrawerMode>("category");
  const [editingCategory, setEditingCategory] =
    useState<NavigationCategory | null>(null);
  const [editingService, setEditingService] =
    useState<NavigationService | null>(null);
  const [categoryForm, setCategoryForm] =
    useState<CategoryFormState>(createEmptyCategoryForm());
  const [serviceForm, setServiceForm] =
    useState<ServiceFormState>(createEmptyServiceForm());
  const [formErrors, setFormErrors] =
    useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] =
    useState<DeleteNavigationTarget | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState("");

  const [draggedCategoryId, setDraggedCategoryId] = useState("");
  const [draggedServiceId, setDraggedServiceId] = useState("");
  const [reorderingCategories, setReorderingCategories] =
    useState(false);
  const [reorderingServices, setReorderingServices] = useState(false);

  const serviceCounts = useMemo(() => {
    return services.reduce<Record<string, number>>(
      (counts, service) => {
        counts[service.categoryId] =
          (counts[service.categoryId] || 0) + 1;
        return counts;
      },
      {},
    );
  }, [services]);

  const selectedCategory = useMemo(
    () =>
      categories.find(
        (category) => category.id === selectedCategoryId,
      ) || null,
    [categories, selectedCategoryId],
  );

  const selectedServices = useMemo(
    () =>
      services
        .filter(
          (service) =>
            service.categoryId === selectedCategoryId,
        )
        .sort(
          (first, second) =>
            first.displayOrder - second.displayOrder ||
            first.name.localeCompare(second.name),
        ),
    [services, selectedCategoryId],
  );

  const loadManager = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setLoadError("");

      const data = await getNavigationManagerData();
      setCategories(data.categories);
      setServices(data.services);

      setSelectedCategoryId((currentCategoryId) => {
        if (
          currentCategoryId &&
          data.categories.some(
            (category) =>
              category.id === currentCategoryId,
          )
        ) {
          return currentCategoryId;
        }

        return data.categories[0]?.id || "";
      });
    } catch (error: unknown) {
      console.error(
        "Navigation and services loading failed:",
        error,
      );
      setLoadError(
        "Navigation data could not be loaded. Check Firebase permissions and try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadManager();
  }, [loadManager]);

  useEffect(() => {
    if (!notice) {
      return undefined;
    }

    const timer = window.setTimeout(
      () => setNotice(""),
      3500,
    );

    return () => window.clearTimeout(timer);
  }, [notice]);

  const clearRequestedAction = useCallback((): void => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("action");
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const openAddCategory = useCallback((): void => {
    setDrawerMode("category");
    setEditingCategory(null);
    setEditingService(null);
    setCategoryForm(
      createEmptyCategoryForm(categories.length + 1),
    );
    setFormErrors({});
    setDrawerOpen(true);
  }, [categories.length]);

  function openEditCategory(
    category: NavigationCategory,
  ): void {
    setDrawerMode("category");
    setEditingCategory(category);
    setEditingService(null);
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      iconName:
        category.iconName || "BriefcaseBusiness",
      displayOrder: category.displayOrder,
      active: category.active,
    });
    setFormErrors({});
    setDrawerOpen(true);
  }

  const openAddService = useCallback((): void => {
    if (!selectedCategoryId) {
      setNotice("Create or select a category first.");
      return;
    }

    setDrawerMode("service");
    setEditingService(null);
    setEditingCategory(null);
    setServiceForm(
      createEmptyServiceForm(
        selectedCategoryId,
        selectedServices.length + 1,
      ),
    );
    setFormErrors({});
    setDrawerOpen(true);
  }, [selectedCategoryId, selectedServices.length]);

  function openEditService(
    service: NavigationService,
  ): void {
    setDrawerMode("service");
    setEditingService(service);
    setEditingCategory(null);
    setServiceForm({
      name: service.name,
      slug: service.slug,
      categoryId: service.categoryId,
      shortDescription:
        service.shortDescription || "",
      displayOrder: service.displayOrder,
      active: service.active,
      status: service.status || "draft",
    });
    setFormErrors({});
    setDrawerOpen(true);
  }

  useEffect(() => {
    if (loading) {
      return;
    }

    const requestedAction = searchParams.get("action");

    if (requestedAction === "add-category") {
      openAddCategory();
      clearRequestedAction();
    } else if (requestedAction === "add-service") {
      openAddService();
      clearRequestedAction();
    }
  }, [
    clearRequestedAction,
    loading,
    openAddCategory,
    openAddService,
    searchParams,
  ]);

  function closeDrawer(): void {
    if (saving) {
      return;
    }

    setDrawerOpen(false);
    setEditingCategory(null);
    setEditingService(null);
    setFormErrors({});
  }

  function changeCategoryField<
    K extends keyof CategoryFormState,
  >(
    field: K,
    value: CategoryFormState[K],
  ): void {
    setCategoryForm((currentForm) => {
      if (field === "name") {
        const nextName = String(value);
        const previousGeneratedSlug =
          slugifyNavigationValue(currentForm.name);

        return {
          ...currentForm,
          name: nextName,
          slug:
            !currentForm.slug ||
            currentForm.slug === previousGeneratedSlug
              ? slugifyNavigationValue(nextName)
              : currentForm.slug,
        };
      }

      return {
        ...currentForm,
        [field]: value,
      };
    });

    setFormErrors((currentErrors) => ({
      ...currentErrors,
      [field]: "",
    }));
  }

  function changeServiceField<
    K extends keyof ServiceFormState,
  >(
    field: K,
    value: ServiceFormState[K],
  ): void {
    setServiceForm((currentForm) => {
      if (field === "name") {
        const nextName = String(value);
        const previousGeneratedSlug =
          slugifyNavigationValue(currentForm.name);

        return {
          ...currentForm,
          name: nextName,
          slug:
            !currentForm.slug ||
            currentForm.slug === previousGeneratedSlug
              ? slugifyNavigationValue(nextName)
              : currentForm.slug,
        };
      }

      return {
        ...currentForm,
        [field]: value,
      };
    });

    setFormErrors((currentErrors) => ({
      ...currentErrors,
      [field]: "",
    }));
  }

  function validateCategory(): Record<string, string> {
    const errors: Record<string, string> = {};
    const name = categoryForm.name.trim();
    const slug = slugifyNavigationValue(
      categoryForm.slug,
    );

    if (!name) {
      errors.name = "Category name is required.";
    }

    if (!slug) {
      errors.slug = "A valid category slug is required.";
    }

    if (
      categories.some(
        (category) =>
          category.id !== editingCategory?.id &&
          category.slug.toLowerCase() ===
            slug.toLowerCase(),
      )
    ) {
      errors.slug = "This category slug is already used.";
    }

    if (
      !Number.isFinite(categoryForm.displayOrder) ||
      categoryForm.displayOrder < 1
    ) {
      errors.displayOrder =
        "Display order must be 1 or greater.";
    }

    return errors;
  }

  function validateService(): Record<string, string> {
    const errors: Record<string, string> = {};
    const name = serviceForm.name.trim();
    const slug = slugifyNavigationValue(
      serviceForm.slug,
    );

    if (!serviceForm.categoryId) {
      errors.categoryId = "Select a category.";
    }

    if (!name) {
      errors.name = "Service name is required.";
    }

    if (!slug) {
      errors.slug = "A valid service slug is required.";
    }

    if (
      services.some(
        (service) =>
          service.id !== editingService?.id &&
          service.slug.toLowerCase() ===
            slug.toLowerCase(),
      )
    ) {
      errors.slug = "This service slug is already used.";
    }

    if (
      !Number.isFinite(serviceForm.displayOrder) ||
      serviceForm.displayOrder < 1
    ) {
      errors.displayOrder =
        "Display order must be 1 or greater.";
    }

    return errors;
  }

  async function submitDrawer(): Promise<void> {
    const errors =
      drawerMode === "category"
        ? validateCategory()
        : validateService();

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      setSaving(true);

      if (drawerMode === "category") {
        const savedId =
          await saveNavigationCategory(
            {
              ...categoryForm,
              slug: slugifyNavigationValue(
                categoryForm.slug,
              ),
            },
            editingCategory?.id,
          );

        setSelectedCategoryId(savedId);
        setNotice(
          editingCategory
            ? "Category updated successfully."
            : "Category added successfully.",
        );
      } else {
        await saveNavigationService(
          {
            ...serviceForm,
            slug: slugifyNavigationValue(
              serviceForm.slug,
            ),
          },
          categories,
          editingService?.id,
        );

        setSelectedCategoryId(
          serviceForm.categoryId,
        );
        setNotice(
          editingService
            ? "Service updated successfully."
            : "Service added successfully.",
        );
      }

      setDrawerOpen(false);
      await loadManager();
    } catch (error: unknown) {
      console.error("Navigation item save failed:", error);
      setFormErrors({
        form:
          error instanceof Error
            ? error.message
            : "The item could not be saved.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function toggleCategory(
    category: NavigationCategory,
    active: boolean,
  ): Promise<void> {
    try {
      setTogglingId(category.id);
      await updateNavigationCategoryActive(
        category.id,
        active,
      );
      setCategories((currentCategories) =>
        currentCategories.map((item) =>
          item.id === category.id
            ? { ...item, active }
            : item,
        ),
      );
    } catch (error: unknown) {
      console.error("Category status update failed:", error);
      setNotice("Category status could not be updated.");
    } finally {
      setTogglingId("");
    }
  }

  async function toggleService(
    service: NavigationService,
    active: boolean,
  ): Promise<void> {
    try {
      setTogglingId(service.id);
      await updateNavigationServiceActive(
        service.id,
        active,
      );
      setServices((currentServices) =>
        currentServices.map((item) =>
          item.id === service.id
            ? { ...item, active }
            : item,
        ),
      );
    } catch (error: unknown) {
      console.error("Service status update failed:", error);
      setNotice("Service status could not be updated.");
    } finally {
      setTogglingId("");
    }
  }

  async function persistCategoryOrder(
    nextCategories: NavigationCategory[],
  ): Promise<void> {
    const previousCategories = categories;

    try {
      setReorderingCategories(true);
      setCategories(nextCategories);
      await updateNavigationCategoryOrder(
        nextCategories,
      );
    } catch (error: unknown) {
      console.error("Category reorder failed:", error);
      setCategories(previousCategories);
      setNotice("Category order could not be saved.");
    } finally {
      setReorderingCategories(false);
      setDraggedCategoryId("");
    }
  }

  async function persistServiceOrder(
    nextSelectedServices: NavigationService[],
  ): Promise<void> {
    const previousServices = services;
    const nextServiceMap = new Map(
      nextSelectedServices.map((service) => [
        service.id,
        service,
      ]),
    );

    const nextAllServices = services.map(
      (service) =>
        nextServiceMap.get(service.id) || service,
    );

    try {
      setReorderingServices(true);
      setServices(nextAllServices);
      await updateNavigationServiceOrder(
        nextSelectedServices,
      );
    } catch (error: unknown) {
      console.error("Service reorder failed:", error);
      setServices(previousServices);
      setNotice("Service order could not be saved.");
    } finally {
      setReorderingServices(false);
      setDraggedServiceId("");
    }
  }

  async function confirmDelete(): Promise<void> {
    if (!deleteTarget) {
      return;
    }

    if (
      deleteTarget.type === "category" &&
      Number(deleteTarget.serviceCount || 0) > 0
    ) {
      return;
    }

    try {
      setDeleting(true);

      if (deleteTarget.type === "category") {
        await deleteNavigationCategory(
          deleteTarget.id,
        );
        setNotice("Category deleted successfully.");
      } else {
        await deleteNavigationService(
          deleteTarget.id,
        );
        setNotice("Service deleted successfully.");
      }

      setDeleteTarget(null);
      await loadManager();
    } catch (error: unknown) {
      console.error("Navigation item deletion failed:", error);
      setNotice("The item could not be deleted.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section className="px-4 py-5 sm:px-6 sm:py-6 lg:px-7">
      <div className="mb-5">
        <h2 className="text-2xl font-bold tracking-[-0.02em] text-slate-900 sm:text-[28px]">
          Navigation and Service Manager
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Manage website navigation categories and the services shown under them.
        </p>
      </div>

      {notice && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <p>{notice}</p>
        </div>
      )}

      {loadError && (
        <div className="mb-5 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>{loadError}</p>
          </div>

          <button
            type="button"
            onClick={() => void loadManager()}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 font-semibold transition hover:bg-red-100"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      )}

      {formErrors.form && drawerOpen && (
        <div className="fixed bottom-5 left-1/2 z-[80] -translate-x-1/2 rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-xl">
          {formErrors.form}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
          Loading navigation and services...
        </div>
      ) : (
        <>
          <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm xl:hidden">
            <label
              htmlFor="mobile-category-selector"
              className="block text-sm font-semibold text-slate-800"
            >
              Selected Category
            </label>

            <div className="mt-2 flex gap-2">
              <select
                id="mobile-category-selector"
                value={selectedCategoryId}
                onChange={(event) =>
                  setSelectedCategoryId(
                    event.target.value,
                  )
                }
                className="h-12 min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={openAddCategory}
                className="inline-flex h-12 items-center gap-2 rounded-lg bg-[#1266f1] px-4 text-sm font-semibold text-white"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>

            {selectedCategory && (
              <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-50 p-3">
                <div>
                  <p className="font-semibold text-slate-800">
                    {selectedCategory.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {serviceCounts[selectedCategory.id] || 0} service
                    {(serviceCounts[selectedCategory.id] || 0) === 1
                      ? ""
                      : "s"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      openEditCategory(selectedCategory)
                    }
                    className="rounded-lg border border-blue-200 p-2 text-blue-600"
                    aria-label={`Edit ${selectedCategory.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setDeleteTarget({
                        type: "category",
                        id: selectedCategory.id,
                        name: selectedCategory.name,
                        serviceCount:
                          serviceCounts[
                            selectedCategory.id
                          ] || 0,
                      })
                    }
                    className="rounded-lg border border-red-200 p-2 text-red-500"
                    aria-label={`Delete ${selectedCategory.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,0.94fr)_minmax(0,1.36fr)]">
            <div className="hidden min-w-0 xl:block">
              <NavigationCategoryPanel
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                serviceCounts={serviceCounts}
                togglingId={togglingId}
                reordering={reorderingCategories}
                draggedId={draggedCategoryId}
                onAdd={openAddCategory}
                onSelect={setSelectedCategoryId}
                onEdit={openEditCategory}
                onDelete={(category) =>
                  setDeleteTarget({
                    type: "category",
                    id: category.id,
                    name: category.name,
                    serviceCount:
                      serviceCounts[category.id] || 0,
                  })
                }
                onToggle={(category, active) =>
                  void toggleCategory(
                    category,
                    active,
                  )
                }
                onDragStart={setDraggedCategoryId}
                onDrop={(targetId) => {
                  if (!draggedCategoryId) {
                    return;
                  }

                  void persistCategoryOrder(
                    reorderItems(
                      categories,
                      draggedCategoryId,
                      targetId,
                    ),
                  );
                }}
                onDragEnd={() =>
                  setDraggedCategoryId("")
                }
                onMove={(categoryId, direction) =>
                  void persistCategoryOrder(
                    moveItem(
                      categories,
                      categoryId,
                      direction,
                    ),
                  )
                }
              />
            </div>

            <NavigationServicePanel
              category={selectedCategory}
              services={selectedServices}
              togglingId={togglingId}
              reordering={reorderingServices}
              draggedId={draggedServiceId}
              onAdd={openAddService}
              onEdit={openEditService}
              onOpenEditor={(service) =>
                navigate(`/admin/service-editor/${service.id}`)
              }
              onDelete={(service) =>
                setDeleteTarget({
                  type: "service",
                  id: service.id,
                  name: service.name,
                })
              }
              onToggle={(service, active) =>
                void toggleService(service, active)
              }
              onDragStart={setDraggedServiceId}
              onDrop={(targetId) => {
                if (!draggedServiceId) {
                  return;
                }

                void persistServiceOrder(
                  reorderItems(
                    selectedServices,
                    draggedServiceId,
                    targetId,
                  ),
                );
              }}
              onDragEnd={() =>
                setDraggedServiceId("")
              }
              onMove={(serviceId, direction) =>
                void persistServiceOrder(
                  moveItem(
                    selectedServices,
                    serviceId,
                    direction,
                  ),
                )
              }
            />
          </div>
        </>
      )}

      <NavigationItemDrawer
        open={drawerOpen}
        mode={drawerMode}
        editing={Boolean(
          editingCategory || editingService,
        )}
        categoryForm={categoryForm}
        serviceForm={serviceForm}
        categories={categories}
        errors={formErrors}
        saving={saving}
        onClose={closeDrawer}
        onCategoryFieldChange={changeCategoryField}
        onServiceFieldChange={changeServiceField}
        onSubmit={() => void submitDrawer()}
        onOpenFullEditor={() => {
          if (!editingService) {
            return;
          }

          navigate(
            `/admin/service-editor?serviceId=${editingService.id}`,
          );
        }}
      />

      <DeleteNavigationItemModal
        target={deleteTarget}
        deleting={deleting}
        onClose={() => {
          if (!deleting) {
            setDeleteTarget(null);
          }
        }}
        onConfirm={() => void confirmDelete()}
      />
    </section>
  );
}

export default NavigationServicesPage;
