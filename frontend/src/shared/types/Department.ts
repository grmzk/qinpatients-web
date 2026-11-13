import DEPARTMENTS from "../config/departments";

type Department = (typeof DEPARTMENTS)[number];

export function isDepartment(entity: unknown): entity is Department {
  const department = entity as Department;
  return DEPARTMENTS.includes(department);
}

export default Department;
