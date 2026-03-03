import { useEffect, useMemo, useState } from "react";
import { hrRecords as initialHrData } from "../data/hrData";

const STORAGE_KEY = "hrData";

function emptyForm() {
  return {
    hrId: "",
    employeeName: "",
    dateOfJoining: "",
    contractStartDate: "",
    contractEndDate: "",
    probationEndDate: "",
    salaryBand: "",
    gradeLevel: "",
    systemRole: "",
  };
}

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/40";

export default function Hr() {
  const [hrList, setHrList] = useState(initialHrData || []);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [formMode, setFormMode] = useState(null);
  const [editOriginalId, setEditOriginalId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState(emptyForm());
  const [formError, setFormError] = useState("");

 
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        setHrList(parsed);
      }
    } catch {
      // Ignore invalid data
    }

    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(hrList));
  }, [hrList, hasHydrated]);

  const sortedHr = useMemo(() => {
    return [...hrList].sort((a, b) =>
      (a.hrId || "").localeCompare(b.hrId || "")
    );
  }, [hrList]);

  const openAddModal = () => {
    setFormMode("add");
    setEditOriginalId(null);
    setFormData(emptyForm());
    setFormError("");
  };

  const openEditModal = (hr) => {
    setFormMode("edit");
    setEditOriginalId(hr.hrId);
    setFormData({ ...hr });
    setFormError("");
  };

  const closeFormModal = () => {
    setFormMode(null);
    setEditOriginalId(null);
    setFormData(emptyForm());
    setFormError("");
  };

  const handleDeleteClick = (hrId) => {
    setDeleteId(hrId);
  };

  const cancelDelete = () => {
    setDeleteId(null);
  };

  const confirmDelete = () => {
    if (!deleteId) return;

    setHrList((prev) => prev.filter((hr) => hr.hrId !== deleteId));
    setDeleteId(null);
  };

  const handleFormSubmit = () => {
    const payload = {
      ...formData,
      hrId: formData.hrId.trim(),
      employeeName: formData.employeeName.trim(),
    };

    if (!payload.hrId || !payload.employeeName) {
      setFormError("HR ID and Employee Name are required.");
      return;
    }

    const duplicateId = hrList.some((hr) => {
      if (formMode === "edit") {
        return hr.hrId === payload.hrId && hr.hrId !== editOriginalId;
      }
      return hr.hrId === payload.hrId;
    });

    if (duplicateId) {
      setFormError("HR ID must be unique.");
      return;
    }

    if (formMode === "add") {
      setHrList((prev) => [...prev, payload]);
      closeFormModal();
      return;
    }

    if (formMode === "edit") {
      setHrList((prev) =>
        prev.map((hr) => (hr.hrId === editOriginalId ? payload : hr))
      );
      closeFormModal();
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-800/90">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">HR Records</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">Employment and payroll metadata by employee</p>
          </div>
          <button
            onClick={openAddModal}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            Add HR
          </button>
        </div>

        <div className="space-y-3 md:hidden">
          {sortedHr.map((hr) => (
            <div key={hr.hrId} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <span className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                {hr.hrId}
              </span>
              <p className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">{hr.employeeName}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">DOJ: {hr.dateOfJoining}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Band: {hr.salaryBand}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Role: {hr.systemRole}</p>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => openEditModal(hr)}
                  className="rounded-md bg-amber-500 px-3 py-1.5 text-white hover:bg-amber-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(hr.hrId)}
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
                <th className="px-4 py-3">HR ID</th>
                <th className="px-4 py-3">Employee Name</th>
                <th className="px-4 py-3">DOJ</th>
                <th className="px-4 py-3">Salary Band</th>
                <th className="px-4 py-3">Grade</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {sortedHr.map((hr) => (
                <tr key={hr.hrId} className="hover:bg-gray-50/70 dark:hover:bg-gray-700/40">
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">
                    <span className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                      {hr.hrId}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{hr.employeeName}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{hr.dateOfJoining}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{hr.salaryBand}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{hr.gradeLevel}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{hr.systemRole}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(hr)}
                        className="rounded-md bg-amber-500 px-3 py-1.5 text-white hover:bg-amber-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(hr.hrId)}
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
          <div className="w-full max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {formMode === "add" ? "Add HR" : "Edit HR"}
              </h2>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                {formMode === "add" ? "Create" : "Update"}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">HR ID</label>
                <input
                  value={formData.hrId}
                  onChange={(e) => setFormData({ ...formData, hrId: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">Employee Name</label>
                <input
                  value={formData.employeeName}
                  onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">Date Of Joining</label>
                <input
                  type="date"
                  value={formData.dateOfJoining}
                  onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">Contract Start Date</label>
                <input
                  type="date"
                  value={formData.contractStartDate}
                  onChange={(e) => setFormData({ ...formData, contractStartDate: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">Contract End Date</label>
                <input
                  type="date"
                  value={formData.contractEndDate}
                  onChange={(e) => setFormData({ ...formData, contractEndDate: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">Probation End Date</label>
                <input
                  type="date"
                  value={formData.probationEndDate}
                  onChange={(e) => setFormData({ ...formData, probationEndDate: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">Salary Band</label>
                <input
                  value={formData.salaryBand}
                  onChange={(e) => setFormData({ ...formData, salaryBand: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">Grade Level</label>
                <input
                  value={formData.gradeLevel}
                  onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">System Role</label>
                <input
                  value={formData.systemRole}
                  onChange={(e) => setFormData({ ...formData, systemRole: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            {formError ? <p className="mt-3 text-sm text-red-600">{formError}</p> : null}

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
              Are you sure you want to delete this HR record?
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
