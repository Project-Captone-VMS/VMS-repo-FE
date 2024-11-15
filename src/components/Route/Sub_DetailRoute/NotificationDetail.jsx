import React, { useRef, useState } from "react";
import { Bell } from "lucide-react";
import moment from "moment-timezone";

const NotificationDetail = () => {
  const vietnamTime = moment().tz("Asia/Ho_Chi_Minh").format("HH:mm:ss");
  console.log(vietnamTime);

  const [noti, setNoti] = useState([
    { notificationId: "1", Content: "Lỗi hệ thống" },
    {
      notificationId: "2",
      Content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    },
  ]);

  const formattedDate = moment().format("DD.MM.YYYY");
  const inputRef = useRef();
  return (
    <div className="mt-4 bg-white p-4 rounded-[10px]">
      {noti.map((notification, index) => (
        <div className="mb-4">
          <div
            key={notification.notificationId}
            className="p-4 mb-2 bg-[#E5FCF4] rounded-[10px] shadow-md"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center text-[#4B4B4B]">
                <Bell className="mr-2" />
                <p className="text-sm font-bold">Notification {index + 1}</p>
              </div>
              <p className="text-sm text-gray-600">{formattedDate}</p>
            </div>
            <hr className="my-2 border-gray-200 dark:border-gray-300" />
            <p className="text-sm text-gray-700">{notification.Content}</p>
          </div>
          <p className="text-[10px] text-center text-gray-400 "> {vietnamTime}</p>
        </div>
      ))}
      <input
        ref={inputRef}
        type="text"
        className="w-full rounded-3xl border border-gray-300 bg-white text-left p-2 px-4 text-sm text-black mt-4 focus:outline-none focus:ring-2 focus:ring-gray-300"
        placeholder="Send"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const value = e.target.value;
            setNoti([
              ...noti,
              { notificationId: crypto.randomUUID(), Content: value },
            ]);
            inputRef.current.value = "";
          }
        }}
      />
    </div>
  );
};

export default NotificationDetail;
