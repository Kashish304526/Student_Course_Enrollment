import api from "./axios";
import type { Course } from "../types/course";

export const getCourses = () => api.get<Course[]>("/courses");

export const createCourse = (data: Omit<Course, "id">) =>
  api.post<Course>("/courses", data);

export const updateCourse = (
  id: number,
  data: Omit<Course, "id">
) =>
  api.put<Course>(`/courses/${id}`, data);

export const deleteCourse = (id: number) =>
  api.delete(`/courses/${id}`);

