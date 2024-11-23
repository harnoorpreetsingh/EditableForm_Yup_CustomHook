import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import * as yup from "yup";

// Yup schema
const schema = yup.object().shape({
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

function App() {
  // Initial data with the birthday in the 'yyyy-mm-dd' format
  const [initialData, setInitialData] = useState({
    name: "John Doe",
    email: "john@gmail.com",
    birthday: "2024-11-21", // Date as string (yyyy-mm-dd)
    gender: "male",
    hobbies: ["Walk the dog", "Prepare lunch", "Evening walk"],
    qualifications: {
      diploma: true,
      graduation: true,
      tenth: false,
      twelth: false,
      postGraduation: false,
    },
  });

  const [currentData, setCurrentData] = useState({ ...initialData });
  const [isModified, setIsModified] = useState(false)


  // React Hook Form setup
  const { control, handleSubmit, formState: { errors }, getValues } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: initialData,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "hobbies",
  });

  // Handle form submission
  const onSubmit = (data) => {
    // Preparing the result in the desired format
    const result = {
      isModified: false,
      values: {}

    };
  
    // Compare all fields in the initialData with the data submitted
    Object.keys(initialData).forEach((key) => {
      let oldValue = initialData[key];
      let newValue = data[key];
  
      // Special case: If field is of type "Date" (e.g., birthday)
      if (key === "birthday") {
        oldValue = initialData[key]; // Date as string (yyyy-mm-dd)
        newValue = new Date(data[key]).toISOString(); // Convert to the full ISO string format (T18:30:00.000Z)
      }
  
      // Check if the value has changed and log the difference
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        result.isModified = true;
        result.values[key] = {
          old: oldValue,
          new: newValue,
        };
      }
    });


      //   if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
    //     result[key] = {
    //       old: oldValue,
    //       new: newValue,
    //     };
    //   }
    // });
  
    // Add isModified to the result
    result.isModified = true;
  
    // Log the result with the changes
    console.log(result);
  
    // Set the updated form data
    setCurrentData(data);
  };
  
  // console.log(isModified, "state checkingggg");
  

  return (
    <div className="w-full text-center bg-slate-500 text-white">
      <h1 className="text-4xl font-bold p-4">Edit User Details</h1>
      <div className="formarea border-2 rounded-lg p-6 border-black mx-24 mt-3">
        <form onSubmit={handleSubmit(onSubmit)} className="justify-between">
          {/* Name */}
          <label className="text-2xl font-semibold">Name:</label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                className="ml-2 bg-slate-400 hover:bg-slate-600 p-2 rounded-lg font-semibold mt-5 text-center"
                type="text"
              />
            )}
          />
          {errors.name && <p>{errors.name.message}</p>}
          <br />

          {/* Email */}
          <label className="text-2xl font-semibold">Email:</label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                className="ml-2 bg-slate-400 hover:bg-slate-600 p-2 rounded-lg font-semibold mt-5 text-center"
                type="email"
              />
            )}
          />
          {errors.email && <p>{errors.email.message}</p>}
          <br />

          {/* Birthday */}
          <label className="text-2xl font-semibold">Birthday:</label>
          <Controller
            name="birthday"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                className="ml-2 bg-slate-400 hover:bg-slate-600 p-2 rounded-lg font-semibold mt-5 text-center"
                type="date"
                value={field.value} // Keep the value as string for date input
                onChange={(e) => field.onChange(e.target.value)} // Ensure this updates the string correctly
              />
            )}
          />
          {errors.birthday && <p>{errors.birthday.message}</p>}
          <br />

          {/* Gender */}
          <label className="text-2xl mt-3 font-semibold">Gender:</label>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <>
                <input
                  {...field}
                  id="male"
                  className="bg-slate-400 hover:bg-slate-600 w-[30px] h-[18px] ml-4"
                  type="radio"
                  value="male"
                  checked={field.value === "male" ? true : false}
                />
                <label htmlFor="male" className="ml-2 text-xl">Male</label>

                <input
                  {...field}
                  id="female"
                  className="bg-slate-400 hover:bg-slate-600 w-[30px] h-[18px] ml-4"
                  type="radio"
                  value="female"
                  checked={field.value === "female" ? true : false}
                />
                <label htmlFor="female" className="ml-2 text-xl">Female</label>
              </>
            )}
          />
          {errors.gender && <p>{errors.gender.message}</p>}
          <br />

          {/* Hobbiess */}
          <label className="text-2xl font-semibold">Hobbies:</label>
          {fields.map((item, index) => (
            <div key={item.id}>
              <Controller
                name={`hobbies[${index}]`}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    className="ml-2 bg-slate-400 placeholder:text-yellow-300 hover:bg-slate-600 p-2 rounded-lg font-semibold mt-2 text-center"
                    type="text" placeholder="Fill this to add other hobby"
                  />
                )}
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mt-2 ml-2"
              >
                -
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append("")}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mt-2"
          >
            Add New hobby(+)
          </button>
          {errors.hobbies && <p>{errors.hobbies.message}</p>}

          <br />

          {/* Qualifications */}
          <label className="text-2xl font-semibold">Qualifications:</label>
          {["tenth", "twelth", "graduation", "postGraduation", "diploma"].map(
            (qualification) => (
              <div key={qualification} className="block mt-2">
                <Controller
                  name={`qualifications.${qualification}`}
                  control={control}
                  render={({ field }) => (
                    <label className="inline-flex items-center">
                      <input
                        {...field}
                        type="checkbox"
                        checked={field.value || false}
                        className="mr-2"
                        onChange={(e) => field.onChange(e.target.checked)}
                        
                        
                      />
                      {qualification.charAt(0).toUpperCase() +
                        qualification.slice(1)}
                    </label>
                  )}
                />
              </div>
            )
          )}
          {errors.qualifications && (
            <p className="text-red-500 font-bold bg-yellow-300">{errors.qualifications?.root.message}</p>
          )}

          <br />

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mt-4"
          >
            Submit
          </button>
        </form>

        {/* {Object.keys(currentData).length > 0 && (
          <div>
            <h3 className="mt-6 text-xl font-bold">Changes Detected:</h3>
            <pre>{JSON.stringify(currentData, null, 2)}</pre>
          </div>
        )} */}
      </div>
    </div>
  );
}

export default App;
 