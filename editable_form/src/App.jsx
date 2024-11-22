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
  // Initial data and current form data state
  const [initialData, setInitialData] = useState({
    name: "John Doe",
    email: "john@gmail.com",
    birthday: "2024-11-21",
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
    console.log(data); // Check the form data on submission
    setCurrentData(data); // Set the updated form data
  };

  // Compare old data with new data
  const getChanges = () => {
    const changes = {};
    let modified = false;

    // Compare initial data with current data
    Object.keys(initialData).forEach((key) => {
      if (JSON.stringify(initialData[key]) !== JSON.stringify(currentData[key])) {
        changes[key] = {
          old: initialData[key],
          new: currentData[key],
        };
        modified = true;
      }
    });

    return { modified, changes };
  };

  // Get changes (fields that were modified)
  const { modified, changes } = getChanges();

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

          {/* Hobbies */}
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

          {/* "+" Button: Add hobby */}
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
                        checked={field.value || false} // Treating undefined as false
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

          {/* Display the qualifications error */}
          {errors.qualifications && (
            <p className="text-red-500 font-bold bg-yellow-300">{errors.qualifications?.root.message}</p>
          )}

          <br />

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Display changes (Old vs New) */}
      {modified && (
  <div className="p-4 mt-4 bg-slate-700 text-white">
    <h2 className="text-2xl font-bold mb-4">Changed Fields:</h2>
    <ul className="space-y-2">
      {Object.keys(changes).map((key) => (
        <li key={key} className="flex flex-col">
          <span className="font-semibold text-lg ">{key}:</span>
          
          {/* Old Value */}
          <div className="flex items-center">
            <span className="mr-2  text-gray-300 font-semibold text-lg">Old:</span>
            <span className="p-2 bg-gray-600 rounded-lg text-sm">{JSON.stringify(changes[key].old)}</span>
          </div>
          
          {/* New Value */}
          <div className="flex items-center mt-1">
            <span className="mr-2 font-semibold text-lg text-gray-300">New:</span>
            <span className="p-2 bg-green-600 rounded-lg text-sm">{JSON.stringify(changes[key].new)}</span>
          </div>
        </li>
      ))}
    </ul>
  </div>
)}

    </div>
  );
}

export default App;
