import api from "./axios";
import type { Enrollment } from "../types/enrollment";

export const enrollStudent = (data: Omit<Enrollment, "id" | "status">) =>
  api.post<Enrollment>("/enrollments", data);

export const getEnrollments = () =>
  api.get<Enrollment[]>("/enrollments");

export const updateEnrollmentStatus = (
  enrollmentId: number,
  status: "Enrolled" | "Dropped"
) =>
  api.patch<Enrollment>(
    `/enrollments/${enrollmentId}/status`,
    null,
    {
      params: { status },
    }
  );
