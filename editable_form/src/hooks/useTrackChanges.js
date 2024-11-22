import { useState, useEffect } from "react";

function useTrackChanges(initialData, currentData) {
  const [changes, setChanges] = useState({});
  const [modified, setModified] = useState(false);

  useEffect(() => {
    // Compare old and new data and track changes
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

    const { modified, changes } = getChanges();
    setModified(modified);
    setChanges(changes);

    // Log the changes to the console
    if (modified) {
      console.log("Changed Fields:");
      Object.keys(changes).forEach((key) => {
        console.log(`${key}:`);
        console.log(`Old: ${JSON.stringify(changes[key].old)}`);
        console.log(`New: ${JSON.stringify(changes[key].new)}`);
      });
    }
  }, [initialData, currentData]);

  return { modified, changes };
}

export default useTrackChanges;
