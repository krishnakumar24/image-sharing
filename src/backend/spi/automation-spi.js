import { checkUserWeek } from "backend/emailHooks.web.js";

/**
 * Autocomplete function declaration, do not delete
 * @param {import('./__schema__.js').Payload} options
 */

export const invoke = async ({ payload }) => {
  checkUserWeek();
  return {}; // The function must return an empty object, do not delete
};
