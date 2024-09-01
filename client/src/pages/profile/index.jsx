import React, { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { FaTrash, FaPlus } from "react-icons/fa";
import { Avatar } from "@radix-ui/react-avatar";
import { useAppStore } from "../../store/index";
import { colors } from "@/lib/utils";

const getColor = (colorIndex) => colors[colorIndex] || "#2c2e3b"; // Default color

const Profile = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0); // Using index to select color

  const { setUserInfo, userInfo } = useAppStore();

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <IoArrowBack className="text-4xl lg:text-6xl text-white/90 cursor-pointer" />
        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {image ? (
                <Avatar.Image
                  src={image}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full`}
                  style={{ backgroundColor: getColor(selectedColor) }}
                >
                  {firstName
                    ? firstName[0]
                    : userInfo.email[0]}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full">
                {image ? (
                  <FaTrash 
                    className="text-white text-3xl cursor-pointer" 
                    onClick={() => setImage(null)} 
                  />
                ) : (
                  <FaPlus 
                    className="text-white text-3xl cursor-pointer" 
                    onClick={() => {
                      // Logic to add a new image
                    }} 
                  />
                )}
              </div>
            )}
          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full">
              <input
                placeholder="Email"
                type="email"
                disabled
                value={userInfo.email}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none w-full"
              />
            </div>

            <div className="w-full">
              <input
                placeholder="First Name"
                type="text"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none w-full"
              />
            </div>

            <div className="w-full">
              <input
                placeholder="Last Name"
                type="text"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none w-full"
              />
            </div>
            <div className="w-full flex gap-5">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className={`h-8 w-8 rounded-full cursor-pointer transition-all duration-300`}
                  style={{
                    backgroundColor: color,
                    outline: selectedColor === index ? "2px solid white" : "none",
                  }}
                  onClick={() => setSelectedColor(index)}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="w-full">
          <button className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300" /*onClick={saveChanges}*/>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
