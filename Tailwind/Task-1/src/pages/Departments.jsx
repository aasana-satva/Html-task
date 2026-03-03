import { useEffect, useMemo, useState } from "react";
import { departments as initialDepartments } from "../data/departmnetData";
import PageSkeleton from "../components/layout/PageSkeleton";

const STORAGE_KEY = "departmentsData";

function emptyForm() {
  return {
    departmentId: "",
    departmentName: "",
    managerName: "",
    location: "",
  };
}

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/40";

export default function Departments() {
  const [departmentList, setDepartmentList] = useState(initialDepartments);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [formMode, setFormMode] = useState(null);
  const [editOriginalId, setEditOriginalId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState(emptyForm());
  const [formError, setFormError] = useState("");
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 450);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        setDepartmentList(parsed);
      }
    } catch {
      // ignore invalid data
    }

    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(departmentList));
  }, [departmentList, hasHydrated]);

  const sortedDepartments = useMemo(() => {
    return [...departmentList].sort((a, b) =>
      a.departmentId.localeCompare(b.departmentId)
    );
  }, [departmentList]);

  const openAddModal = () => {
    setFormMode("add");
    setEditOriginalId(null);
    setFormData(emptyForm());
    setFormError("");
  };

  const openEditModal = (department) => {
    setFormMode("edit");
    setEditOriginalId(department.departmentId);
    setFormData({ ...department });
    setFormError("");
  };

  const closeFormModal = () => {
    setFormMode(null);
    setEditOriginalId(null);
    setFormData(emptyForm());
    setFormError("");
  };

  const handleDeleteClick = (departmentId) => {
    setDeleteId(departmentId);
  };

  const cancelDelete = () => {
    setDeleteId(null);
  };

  const confirmDelete = () => {
    if (!deleteId) return;

    setDepartmentList((prev) =>
      prev.filter((dept) => dept.departmentId !== deleteId)
    );
    setDeleteId(null);
  };

  const handleFormSubmit = () => {
    const payload = {
      departmentId: formData.departmentId.trim(),
      departmentName: formData.departmentName.trim(),
      managerName: formData.managerName.trim(),
      location: formData.location.trim(),
    };

    if (
      !payload.departmentId ||
      !payload.departmentName ||
      !payload.managerName ||
      !payload.location
    ) {
      setFormError("All fields are required.");
      return;
    }

    const duplicateId = departmentList.some((dept) => {
      if (formMode === "edit") {
        return (
          dept.departmentId === payload.departmentId &&
          dept.departmentId !== editOriginalId
        );
      }
      return dept.departmentId === payload.departmentId;
    });

    if (duplicateId) {
      setFormError("Department ID must be unique.");
      return;
    }

    if (formMode === "add") {
      setDepartmentList((prev) => [...prev, payload]);
      closeFormModal();
      return;
    }

    if (formMode === "edit") {
      setDepartmentList((prev) =>
        prev.map((dept) =>
          dept.departmentId === editOriginalId ? payload : dept
        )
      );
      closeFormModal();
    }
  };

  if (isPageLoading) {
    return <PageSkeleton />;
  }

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-800/90">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Departments</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">Track teams, managers and office locations</p>
          </div>
          <button
            onClick={openAddModal}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            Add Department
          </button>
        </div>

        <div className="space-y-3 md:hidden">
          {sortedDepartments.map((dept) => (
            <div key={dept.departmentId} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <span className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                {dept.departmentId}
              </span>
              <p className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">{dept.departmentName}</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Manager: {dept.managerName}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Location: {dept.location}</p>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => openEditModal(dept)}
                  className="rounded-md bg-amber-500 px-3 py-1.5 text-white hover:bg-amber-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(dept.departmentId)}
                  className="rounded-md bg-red-500 px-3 py-1.5 text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 md:block">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50/80 dark:bg-gray-900/50">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                <th className="px-4 py-3">Department ID</th>
                <th className="px-4 py-3">Department Name</th>
                <th className="px-4 py-3">Manager</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {sortedDepartments.map((dept) => (
                <tr key={dept.departmentId} className="hover:bg-gray-50/70 dark:hover:bg-gray-700/40">
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">
                    <span className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                      {dept.departmentId}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{dept.departmentName}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{dept.managerName}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{dept.location}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(dept)}
                        className="rounded-md bg-amber-500 px-3 py-1.5 text-white hover:bg-amber-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(dept.departmentId)}
                        className="rounded-md bg-red-500 px-3 py-1.5 text-white hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {formMode ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {formMode === "add" ? "Add Department" : "Edit Department"}
              </h2>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                {formMode === "add" ? "Create" : "Update"}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4">
              <div>
                <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">Department ID</label>
                <input
                  value={formData.departmentId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      departmentId: e.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">Department Name</label>
                <input
                  value={formData.departmentName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      departmentName: e.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">Manager Name</label>
                <input
                  value={formData.managerName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      managerName: e.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">Location</label>
                <input
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </div>
            </div>

            {formError ? (
              <p className="mt-3 text-sm text-red-600">{formError}</p>
            ) : null}

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={closeFormModal}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleFormSubmit}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                {formMode === "add" ? "Add" : "Save"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {deleteId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Confirm Delete</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Are you sure you want to delete this department?
            </p>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
