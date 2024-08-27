import { DataContext } from "../context/DataContext";
import { useContext, useEffect } from "react";

const profile = () => {
  /*
  { Database connect }
  const {
    showUserDetails,
    userDetails,
  } = useContext(DataContext);

  useEffect(() => {
    showUserDetails(id)
  }, []);
 */

  return (
    <div className="flex justify-between p-10">
      {/* user info */}
      <div className="">
        <h1>Username:</h1>
        <h1>Email:</h1>
      </div>
      {/* user orders history */}

      <div className="bg-slate-300 w-max py-2 max-h-[970px] overflow-scroll overflow-x-hidden">
        test
</div>
    </div>
  );
};

export default profile;
