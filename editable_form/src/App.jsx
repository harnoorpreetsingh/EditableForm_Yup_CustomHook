import { useFormWithValidation } from "./hooks/useFormWithValidation.js";
import { Controller } from "react-hook-form";

function App() {
  // Initial data for the form
  const initialData = {
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
  };

  const {
    control,
    handleSubmit,
    errors,
    fields,
    append,
    remove,
    isModified,
    onSubmit,
  } = useFormWithValidation(initialData);

  const getLength = (res) => {
    console.log(res);
  };
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
                <label htmlFor="male" className="ml-2 text-xl">
                  Male
                </label>

                <input
                  {...field}
                  id="female"
                  className="bg-slate-400 hover:bg-slate-600 w-[30px] h-[18px] ml-4"
                  type="radio"
                  value="female"
                  checked={field.value === "female" ? true : false}
                />
                <label htmlFor="female" className="ml-2 text-xl">
                  Female
                </label>
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
                    type="text"
                    placeholder="Fill this to add other hobby"
                  />
                )}
              />
              <button
                type="button"
                onClick={() => {
                  if (fields.length > 1) {
                    remove(index);
                  }
                }}
                disabled={
                  fields.length === 1
                } /* Disable the '-' button when there is only one hobby */
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
            <p className="text-red-500 font-bold bg-yellow-300">
              {errors.qualifications?.root.message}
            </p>
          )}

          <br />

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mt-4"
          >
            Submit
          </button>
        </form>

        {isModified && (
          <p className="text-red-500 mt-4">Form has been modified.</p>
        )}
      </div>
    </div>
  );
}

export default App;
