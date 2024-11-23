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
  //resolver will use/call schema defined
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

  // Use field array for managing fields of hobby
  const { fields, append, remove } = useFieldArray({
    control,
    name: "hobbies",
  });

  // Handling form submission
  //data is provided by hook form having values
  //is modified returns default state's status must check it's structure
  //this structure gets logged out as object 
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
        oldValue = convertISODateString(initialData[key]); // Convert initial Date to ISO string
        newValue = convertISODateString(data[key]); // Convert changed Date to ISO string
        // console.log(oldValue, "old value");
        // console.log(newValue, "new value");
      }

      // Checking if the value has changed
      //checks which value changed & which didn't 
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        result.isModified = true;
        result.values[key] = { old: oldValue, new: newValue };
      }

      // console.log(result.values.hobbies?.new.length, "check in g resulttt")
    });

    //logging data on console conditioned on modified state
    if (result.isModified === false) {
      console.log(result);
    }
    // console.log(result);  
    //another check
    if (result.isModified) {
      console.log(result);
    }
    //setting data into state
    setCurrentData(data); // Update current data
  };

  //returning fields to be attached with form 
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
