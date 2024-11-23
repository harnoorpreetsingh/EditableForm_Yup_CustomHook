/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { convertISODateString } from "../utils/dateConvertISO";
import { createValidationSchema } from "../validations/yupSchema";

export const useFormWithValidation = (initialData) => {
  const [currentData, setCurrentData] = useState({ ...initialData });
  const [isModified, setIsModified] = useState(false);

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(createValidationSchema()),
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
    alert("Check Console!");
    const result = {
      isModified: false,
      values: {},
    };

    // Comparing all fields in the initialData with the data submitted
    Object.keys(initialData).forEach((key) => {
      let oldValue = initialData[key];
      let newValue = data[key];

      // console.log(newValue, "newValue");

      // For date fields ( birthday)
      if (key === "birthday") {
        oldValue = convertISODateString(initialData[key]); // Date as string (yyyy-mm-dd)
        newValue = convertISODateString(data[key]); // Convert to ISO string
        // console.log(oldValue, "old value");
        // console.log(newValue, "new value");
      }

      // Checking if the value has changed
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        result.isModified = true;
        result.values[key] = { old: oldValue, new: newValue };
      }

      // console.log(result.values.hobbies?.new.length, "check in g resulttt")
    });


    if (result.isModified === false) {
      console.log(result);
    }
    // console.log(result);  
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
