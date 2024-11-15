import React, { useRef, useState } from "react";
import { TriangleAlert } from "lucide-react";
import moment from "moment-timezone";

const Error = () => {
  const vietnamTime = moment().tz("Asia/Ho_Chi_Minh").format("HH:mm:ss");
  console.log(vietnamTime);

  const [error, setError] = useState([
    { errorId: "1", Content: "Lỗi hệ thống" },
    {
      errorId: "2",
      Content: "Lệch đường",
    },
  ]);

  const formattedDate = moment().format("DD.MM.YYYY");
  return (
    <div className="mt-4 bg-white p-4 rounded-[10px]">
      {error.map((error, index) => (
        <div className="mb-4">
          <div
            key={error.errorId}
            className="p-4 mb-2 bg-[#E5FCF4] rounded-[10px] shadow-md"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center text-[#4B4B4B]">
                <TriangleAlert className="mr-2 text-red-700" />
                <p className="text-sm font-bold text-red-700">
                  error {index + 1}
                </p>
              </div>
              <p className="text-sm text-gray-600">{formattedDate}</p>
            </div>
            <hr className="my-2 border-gray-200 dark:border-gray-300" />
            <p className="text-sm text-gray-700">{error.Content}</p>
          </div>
          <p className="text-[10px] text-center text-gray-400 ">
            {" "}
            {vietnamTime}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Error;
