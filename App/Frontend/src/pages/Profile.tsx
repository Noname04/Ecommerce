import { DataContext } from "../context/DataContext";
import { useContext, useEffect } from "react";



const Profile = () => {
  /*
  { Database connect }
    */
  const { showUserDetails, userDetails } = useContext(DataContext);
  useEffect(() => {
    showUserDetails();
  }, []);
  return (
    <div className="flex-col justify-center px-10 ">
      {/* user info */}
      <div className="flex justify-center py-10 mr-[40px]">
        {userDetails !== null ? (
          <div className="bg-slate-300  py-4 px-8 rounded-lg">
            <h1>Username: {userDetails.username}</h1>
            <h1>Email: {userDetails.email}</h1>
            <button
              className="border border-gray-900 bg-gray-600 p-2 my-4 text-white transition-all hover:bg-black rounded-full w-full"
            >
              change password
            </button>
          </div>
        ) : (
          <div className="">
            <h1>Username: </h1>
            <h1>Email:</h1>
          </div>
        )}
      </div>

      {/* user orders history */}
      {/* id Customer name items price date status */}
      <h1 className="px-4 py-2 text-2xl font-semibold">Order history</h1>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Order ID
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Customer Name
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Ordered Items
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Total Price
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Order Date
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {userDetails !== null ? (
            userDetails?.orders !== null ? (
              userDetails.orders.map((data) => (
                <tr key={data.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {data.id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {data.firstName} {data.lastName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <ul className="list-disc list-inside">
                      {data.items.map((item) => (
                        <li key={item.item.id}>
                          {item.item.name} x {item.amount}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {data.fullPrice.toFixed(2)} USD
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(data.date).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {data.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No orders found
                </td>
              </tr>
            )
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4">
                No orders found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Profile;
