import { useState } from "react";
import { useForm,  useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Yup validation schema
const createValidationSchema = (fields) => {
  return yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    birthday: yup.date().required("Birthday is required"),
    gender: yup.string().oneOf(["male", "female"], "Gender is required"),
    hobbies: yup
      .array()
      .of(yup.string().min(1, "Hobby cannot be empty"))
      .required("At least one hobby is required")
      .min(1, "You must provide at least one hobby. Click on (+) button to add."),
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

export const useFormWithValidation = (initialData) => {
  const [currentData, setCurrentData] = useState({ ...initialData });
  const [isModified, setIsModified] = useState(false);

  // React Hook Form setup
  const { control, handleSubmit, formState: { errors }, getValues } = useForm({
    resolver: yupResolver(createValidationSchema(initialData)),
    mode: "onChange",
    defaultValues: initialData,
  });

  // Use field array 
  const { fields, append, remove } = useFieldArray({
    control,
    name: "hobbies",
  });

  // Handling form submission
  const onSubmit = (data) => {
    const result = {
      isModified: false,
      values: {},
    };

    // Comparing all fields in the initialData with the data submitted
    Object.keys(initialData).forEach((key) => {
      let oldValue = initialData[key];
      let newValue = data[key];

      // Special case for date fields (e.g., birthday)
      if (key === "birthday") {
        oldValue = initialData[key]; // Date as string (yyyy-mm-dd)
        newValue = new Date(data[key]).toISOString(); // Convert to ISO string
      }

      // Checking if the value has changed
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        result.isModified = true;
        result.values[key] = { old: oldValue, new: newValue };
      }
      
      // console.log(result.values.hobbies?.new.length, "check in g resulttt")
    }
  );

  //another check
    if (result.isModified) {
      console.log(result);
    }
    //setting data
    setCurrentData(data); // Update current data
  };

  return {
    control,
    handleSubmit,
    errors,
    fields,
    append,
    remove,
    isModified,
    onSubmit,
  };
};
