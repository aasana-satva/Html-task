import { useEffect, useMemo, useState } from "react";
import { employees as initialEmployees } from "../data/employeeData";
import PageSkeleton from "../components/layout/PageSkeleton";

const STORAGE_KEY = "employeesData";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{10}$/;

function emptyForm() {
  return {
    employeeId: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  };
}

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/40";

export default function Employees() {
  const [employeeList, setEmployeeList] = useState(initialEmployees);
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

    if (!saved) {
      return;
    }

    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        setEmployeeList(parsed);
      }
    } catch {
      // Ignore invalid localStorage payload and keep defaults.
    }

    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(employeeList));
  }, [employeeList, hasHydrated]);

  const sortedEmployees = useMemo(() => {
    return [...employeeList].sort((a, b) => a.employeeId.localeCompare(b.employeeId));
  }, [employeeList]);

  const openAddModal = () => {
    setFormMode("add");
    setEditOriginalId(null);
    setFormData(emptyForm());
    setFormError("");
  };

  const openEditModal = (employee) => {
    setFormMode("edit");
    setEditOriginalId(employee.employeeId);
    setFormData({ ...employee });
    setFormError("");
  };

  const closeFormModal = () => {
    setFormMode(null);
    setEditOriginalId(null);
    setFormData(emptyForm());
    setFormError("");
  };

  const handleDeleteClick = (employeeId) => {
    setDeleteId(employeeId);
  };

  const cancelDelete = () => {
    setDeleteId(null);
  };

  const confirmDelete = () => {
    if (!deleteId) {
      return;
    }

    setEmployeeList((prev) => prev.filter((emp) => emp.employeeId !== deleteId));
    setDeleteId(null);
  };

  const handleFormSubmit = () => {
    const payload = {
      employeeId: formData.employeeId.trim(),
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phoneNumber: formData.phoneNumber.trim(),
    };

    if (!payload.employeeId || !payload.firstName || !payload.lastName || !payload.email || !payload.phoneNumber) {
      setFormError("All fields are required.");
      return;
    }

    if (!EMAIL_REGEX.test(payload.email)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    if (!PHONE_REGEX.test(payload.phoneNumber)) {
      setFormError("Phone number must be exactly 10 digits.");
      return;
    }

    const duplicateId = employeeList.some((emp) => {
      if (formMode === "edit") {
        return emp.employeeId === payload.employeeId && emp.employeeId !== editOriginalId;
      }
      return emp.employeeId === payload.employeeId;
    });

    if (duplicateId) {
      setFormError("Employee ID must be unique.");
      return;
    }

    if (formMode === "add") {
      setEmployeeList((prev) => [...prev, payload]);
      closeFormModal();
      return;
    }

    if (formMode === "edit") {
      setEmployeeList((prev) =>
        prev.map((emp) => (emp.employeeId === editOriginalId ? payload : emp))
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
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Employees</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">Manage employee records and contact details</p>
          </div>
          <button
            onClick={openAddModal}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            Add Employee
          </button>
        </div>

        <div className="space-y-3 md:hidden">
          {sortedEmployees.map((emp) => (
            <div key={emp.employeeId} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <div className="mb-2 flex items-center justify-between">
                <span className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                  {emp.employeeId}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {emp.firstName} {emp.lastName}
              </p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{emp.email}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{emp.phoneNumber}</p>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => openEditModal(emp)}
                  className="rounded-md bg-amber-500 px-3 py-1.5 text-white hover:bg-amber-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(emp.employeeId)}
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
                <th className="px-4 py-3">Employee ID</th>
                <th className="px-4 py-3">First Name</th>
                <th className="px-4 py-3">Last Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone Number</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {sortedEmployees.map((emp) => (
                <tr key={emp.employeeId} className="hover:bg-gray-50/70 dark:hover:bg-gray-700/40">
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">
                    <span className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                      {emp.employeeId}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{emp.firstName}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{emp.lastName}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{emp.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{emp.phoneNumber}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(emp)}
                        className="rounded-md bg-amber-500 px-3 py-1.5 text-white hover:bg-amber-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(emp.employeeId)}
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
                {formMode === "add" ? "Add Employee" : "Edit Employee"}
              </h2>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                {formMode === "add" ? "Create" : "Update"}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">Employee ID</label>
                <input
                  value={formData.employeeId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, employeeId: e.target.value }))}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">First Name</label>
                <input
                  value={formData.firstName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">Last Name</label>
                <input
                  value={formData.lastName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  className={inputClass}
                  placeholder="name@example.com"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">Phone Number</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      phoneNumber: e.target.value.replace(/\D/g, "").slice(0, 10),
                    }))
                  }
                  className={inputClass}
                  placeholder="10 digit phone number"
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
              Are you sure you want to delete this employee?
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
