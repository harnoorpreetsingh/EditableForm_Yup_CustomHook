import * as yup from "yup";

export const createValidationSchema = () => {
  return yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    birthday: yup
      .date()
      .required("Birthday is required")
      .typeError("Invalid date format"),
    gender: yup.string().oneOf(["male", "female"], "Gender is required"),
    hobbies: yup
      .array()
      .of(yup.string().min(1, "Hobby cannot be empty"))
      .required("At least one hobby is required")
      .min(
        1,
        "You must provide at least one hobby. Click on (+) button to add."
      ),
    qualifications: yup
      .object({
        tenth: yup.boolean(),
        twelth: yup.boolean(),
        graduation: yup.boolean(),
        postGraduation: yup.boolean(),
        diploma: yup.boolean(),
      })
      .test(
        "at-least-one-qualification",
        "At least one qualification must be selected before Submitting",
        (value) => {
          return Object.values(value || {}).some((val) => val === true);
        }
      ),
  });
};
