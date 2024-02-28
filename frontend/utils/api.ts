import axios from "axios";
import { endpoints } from "./endpoints";

//? Get access token from local storage
const getAccessToken = (): string | null => localStorage.getItem("access");

//? Create headers for axios requests
const createHeaders = () => {
  const token = getAccessToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

//? Handle login and get access and refresh tokens
export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${endpoints.user}token/`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

//? Handle registration and get access and refresh tokens

interface RegisterData {
  full_name: string;
  email: string;
  password: string;
  role: string;
}

export const register = async (data: RegisterData) => {
  try {
    const response = await axios.post(endpoints.user, data);
    return response.data;
  } catch (error) {
    return error;
  }
};

//?create admin user
export const createAdmin = async (data: any) => {
  try {
    const response = await axios.post(endpoints.user, data, createHeaders());
    return response.data;
  } catch (error) {
    return error;
  }
};

//?get User data
export const getUser = async () => {
  try {
    const response = await axios.get(endpoints.user, createHeaders());
    return response.data;
  } catch (error) {
    return error;
  }
};

//?update user data
export const updateUser = async (data: any) => {
  try {
    const response = await axios.patch(
      `${endpoints.user}${localStorage.getItem("user_id")}/`,
      data,
      createHeaders()
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

//?delete user data
export const deleteUser = async (id: any) => {
  try {
    const response = await axios.delete(
      `${endpoints.user}${id}/`,
      createHeaders()
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

//?get user data by role
export const getUserByRole = async (role: string) => {
  try {
    const endpoint = `${endpoints.user}?role=${role}`;
    const response = await axios.get(endpoint);
    return response.data;
  } catch (error) {
    return error;
  }
};

//? fetch course summaries
export const fetchCourseSummaries = async (category?: string) => {
  try {
    const url = category
      ? `${endpoints.courseSummary}?category=${category}`
      : endpoints.courseSummary;

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    return error;
  }
};

//? fetch course categories
export const fetchCategories = async () => {
  try {
    const response = await axios.get(endpoints.categories);
    return response.data;
  } catch (error) {
    return error;
  }
};

//? fetch course details
export const fetchCourseDetails = async (slug: any) => {
  try {
    const response = await axios.get(
      `${endpoints.courses}${slug}/`,
      createHeaders()
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

//? fetch section modules
export const fetchSectionModules = async (id: string) => {
  try {
    const response = await axios.get(
      `${endpoints.sections}${id}/`,
      createHeaders()
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

//? get free modules for a course
// http://127.0.0.1:8000/api/modules/?slug=introduction-to-java-programming&is_free=true

export const fetchFreeModules = async (slug: any) => {
  try {
    const response = await axios.get(
      `${endpoints.modules}?slug=${slug}&is_free=true`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

//?check if quiz is already taken
export const checkQuizTaken = async (id: any) => {
  try {
    const response = await axios.get(
      `${endpoints.quizScore}is_completed?section_id=${id}`,
      createHeaders()
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

//? check enrollment
export const checkEnrollment = async (courseId: any) => {
  try {
    const response = await axios.get(
      `${endpoints.enrollment}is_enrolled?course_id=${courseId}`,
      createHeaders()
    );

    return response.data.enrolled;
  } catch (error) {
    console.error("Error checking enrollment:", error);
    return false;
  }
};

//?get enrolled courses
export const fetchEnrolledCourses = async () => {
  try {
    const response = await axios.get(endpoints.enrollment, createHeaders());
    return response.data;
  } catch (error) {
    return error;
  }
};

//? enroll course
export const enrollCourse = async (courseId: any) => {
  try {
    const response = await axios.post(
      endpoints.enrollment,
      { course_id: courseId, user_id: localStorage.getItem("user_id") },
      createHeaders()
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

//?create payment
export const createPayment = async (data: any) => {
  try {
    const response = await axios.post(endpoints.payment, data, createHeaders());
    return response.data;
  } catch (error) {
    return error;
  }
};

//? reply to a comment
export const replyToComment = async (data: any) => {
  try {
    const response = await axios.post(endpoints.replies, data, createHeaders());
    return response.data;
  } catch (error) {
    return error;
  }
};

//? post a comment
export const postComment = async (data: any) => {
  try {
    const response = await axios.post(
      endpoints.comments,
      data,
      createHeaders()
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

//? create discussion
export const createDiscussion = async (data: any) => {
  try {
    const response = await axios.post(
      endpoints.discussions,
      data,
      createHeaders()
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

//?get instructor by id
export const getInstructorById = async (id: any) => {
  try {
    const response = await axios.get(`${endpoints.user}?instructor_id=${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

//? get course summary of a teacher
export const getCourseSummaryByTeacher = async (id: any) => {
  try {
    const response = await axios.get(
      `${endpoints.courseSummary}?instructor_id=${id}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

//? get quiz by section_id
export const getQuizBySectionId = async (id: any) => {
  try {
    const response = await axios.get(
      `${endpoints.quiz}?section_id=${id}`,
      createHeaders()
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

//? add quiz score
export const addQuizScore = async (data: any) => {
  try {
    const response = await axios.post(
      endpoints.quizScore,
      data,
      createHeaders()
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

//?add review
export const addReview = async (data: any) => {
  try {
    const response = await axios.post(endpoints.review, data, createHeaders());
    return response.data;
  } catch (error) {
    return error;
  }
};

//?check course progress

export const checkCourseProgress = async (courseId: any) => {
  try {
    const response = await axios.get(
      `${endpoints.progress}modules_completed_in_course?course_id=${courseId}`,
      createHeaders()
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

//? check if module is completed

export const checkModuleCompletion = async (moduleId: any) => {
  try {
    const response = await axios.get(
      `${endpoints.progress}check_module_completion?module_id=${moduleId}`,
      createHeaders()
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

//?create progress

export const createProgress = async (data: any) => {
  try {
    const response = await axios.post(
      endpoints.progress,
      data,
      createHeaders()
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

//? get certificate
export const getCertificate = async (courseId: any) => {
  try {
    const response = await axios.get(
      `${endpoints.certificate}?course_id=${courseId}`,
      createHeaders()
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

//?create certificate
export const createCertificate = async (data: any) => {
  try {
    const response = await axios.post(
      endpoints.certificate,
      data,
      createHeaders()
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

//? get courses for instructor
// http://127.0.0.1:8000/api/courses/?my_courses
export const getCoursesForInstructor = async () => {
  try {
    const response = await axios.get(
      `${endpoints.courses}?my_courses`,
      createHeaders()
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

//? get courses for instructor
// http://127.0.0.1:8000/api/courses/python-programming-for-beginners
export const getCourseBySlug = async (slug: any) => {
  try {
    const response = await axios.get(
      `${endpoints.courses}${slug}/`,
      createHeaders()
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

//?create course
export const createCourse = async (data: any) => {
  try {
    const response = await axios.post(endpoints.courses, data, createHeaders());
    return response.data;
  } catch (error) {
    return error;
  }
};

//? update course
export const updateCourse = async (slug: any, data: any) => {
  try {
    const response = await axios.patch(
      `${endpoints.courses}${slug}/`,
      data,
      createHeaders()
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

//? delete course
export const deleteCourse = async (slug: any) => {
  try {
    const response = await axios.delete(
      `${endpoints.courses}${slug}/`,
      createHeaders()
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

//? delete section
export const deleteSection = async (id: any) => {
  try {
    const response = await axios.delete(
      `${endpoints.sections}${id}/`,
      createHeaders()
    );
    return response;
  } catch (error) {
    return error;
  }
};

//?create section
export const createSection = async (data: any) => {
  try {
    const response = await axios.post(
      endpoints.sections,
      data,
      createHeaders()
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

//? get section by id
export const getSectionById = async (id: any) => {
  try {
    const response = await axios.get(
      `${endpoints.sections}${id}/`,
      createHeaders()
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

//?update section
export const updateSection = async (id: any, data: any) => {
  try {
    const response = await axios.patch(
      `${endpoints.sections}${id}/`,
      data,
      createHeaders()
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

//?create module
export const createModule = async (data: any) => {
  try {
    const response = await axios.post(endpoints.modules, data, createHeaders());
    return response.data;
  } catch (error) {
    return error;
  }
};

//? get module by id
export const getModuleById = async (id: any) => {
  try {
    const response = await axios.get(
      `${endpoints.modules}${id}/`,
      createHeaders()
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

//?delete module
export const deleteModule = async (id: any) => {
  try {
    const response = await axios.delete(
      `${endpoints.modules}${id}/`,
      createHeaders()
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

//?update module
export const updateModule = async (data: any, id: any) => {
  try {
    const response = await axios.patch(
      `${endpoints.modules}${id}/`,
      data,
      createHeaders()
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

//?create quiz
export const createQuiz = async (data: any) => {
  try {
    const response = await axios.post(endpoints.quiz, data, createHeaders());
    return response.data;
  } catch (error) {
    return error;
  }
};

//?get quiz by id
export const getQuizById = async (id: any) => {
  try {
    const response = await axios.get(
      `${endpoints.quiz}${id}/`,
      createHeaders()
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

//?delete quiz
export const deleteQuiz = async (id: any) => {
  try {
    const response = await axios.delete(
      `${endpoints.quiz}${id}/`,
      createHeaders()
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

//?update quiz
export const updateQuiz = async (id: any, data: any) => {
  try {
    const response = await axios.patch(
      `${endpoints.quiz}${id}/`,
      data,
      createHeaders()
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

//?create resources
export const createResource = async (data: any) => {
  try {
    const response = await axios.post(
      endpoints.resources,
      data,
      createHeaders()
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

//?delete resource
export const deleteResource = async (id: any) => {
  try {
    const response = await axios.delete(
      `${endpoints.resources}${id}/`,
      createHeaders()
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

//?get module count
// http://127.0.0.1:8000/api/courses/get_modules_count?course_id=6hnpVTihfgiamDZakMnExx
export const getModuleCount = async (id: any) => {
  try {
    const response = await axios.get(
      `${endpoints.courses}get_modules_count?course_id=${id}`,
      createHeaders()
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

//? get dashboard details
// http://127.0.0.1:8000/api/courses/get_detail

export const getDashboardDetails = async () => {
  try {
    const response = await axios.get(
      `${endpoints.courses}get_detail`,
      createHeaders()
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

// http://127.0.0.1:8000/user/get_info/
export const getAdminDashboardDetails = async () => {
  try {
    const response = await axios.get(
      `${endpoints.user}get_info`,
      createHeaders()
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

//?delete user
//127.0.0.1:8000/api/change-user/Gvb4KMMVVYLDhVqEkff33m/

export const deleteUserById = async (id: any) => {
  try {
    const response = await axios.delete(
      `${endpoints.changeUser}${id}/`,
      createHeaders()
    );
    return response.data;
  } catch (error) {
    return error;
  }
};
