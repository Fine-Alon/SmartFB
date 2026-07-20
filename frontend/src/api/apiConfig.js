export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  },
  ANALYTICS: {
    GET_STATS: (formId) => `/analytics/forms/${formId}/stats`,
  },
  REVIEWS: {
    GET_QUEUE: '/reviews/queue',
    RESOLVE: (id) => `/reviews/${id}/resolve`,
  },
  SUBMISSIONS: {
    SUBMIT: (formId) => `/submissions/${formId}`,
  },
  CUSTOMERS: {
    LIST: '/customers',
  },
};
