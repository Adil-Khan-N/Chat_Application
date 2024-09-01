import React, { useEffect, useRef, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { FaTrash, FaPlus } from "react-icons/fa";
import * as Avatar from "@radix-ui/react-avatar"; // Check this import
import { useAppStore } from "../../store/index";
import { colors } from "@/lib/utils";
import apiClient from "../../../../server/lib/api-client";
import { ADD_PROFILE_IMAGE, UPDATE_PROFILE_ROUTE, REMOVE_PROFILE_IMAGE } from "../../../../server/utils/constants";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { HOST } from "../../../../server/utils/constants";

// Function to get selected color
const getColor = (colorIndex) => colors[colorIndex] || "#2c2e3b";

// Profile Component
const Profile = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0); // Using index to select color
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Validate Profile Function
  const validateProfile = () => {
    if (!firstName) {
      toast.error("First Name is Required");
      return false;
    }
    if (!lastName) {
      toast.error("Last Name is Required");
      return false;
    }
    return true;
  };

  // Save Changes Function
  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const response = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          { firstName, lastName, color: selectedColor },
          { withCredentials: true }
        );
        console.log("UPDATE_PROFILE_ROUTE response:", response); // Add logging here
        if (response.status === 200 && response.data) {
          const { firstName, lastName, color } = response.data;
          setUserInfo({ ...userInfo, firstName, lastName, color });
          toast.success("Profile Updated Successfully");
          navigate("/chat");
      }
      
      } catch (error) {
        console.log("Error updating profile:", error);
      }
    }
  };

  const { setUserInfo, userInfo } = useAppStore();

  // Navigate Handler
  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please Setup Profile");
    }
  };

  // Use Effect for Setting Initial Values
  useEffect(() => {
    if (userInfo) {
      console.log("Profile useEffect userInfo:", userInfo); // Add logging here
      if (userInfo.profileSetup) {
        setFirstName(userInfo.firstName);
        setLastName(userInfo.lastName);
        setSelectedColor(userInfo.color);
      }
      if (userInfo.image) {
        setImage(`${HOST}/${userInfo.image}`);
      }
    }
  }, [userInfo]);

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    console.log("Selected file:", file);
    if (file) {
      const formData = new FormData();
      formData.append("profile-image", file);
      try {
        const response = await apiClient.post(
          ADD_PROFILE_IMAGE, formData, { withCredentials: true }
        );
        console.log("ADD_PROFILE_IMAGE response:", response);
        if (response.status === 200 && response.data.image) {
          setUserInfo({ ...userInfo, image: response.data.image });
          toast.success("Image Updated Successfully");
        }
      } catch (error) {
        console.log("Error uploading image:", error);
      }
    }
  };

  const handleDeleteImage = async () => {
    try {
      const response = await apiClient.delete(REMOVE_PROFILE_IMAGE, {
        withCredentials: true,
      });
      console.log("REMOVE_PROFILE_IMAGE_ROUTE response:", response);
      if (response.status === 200) {
        setUserInfo({ ...userInfo, image: null });
        toast.success("Image removed successfully.");
        setImage(null);
      }
    } catch (error) {
      console.log("Error removing image:", error);
    }
  };

  // Render
  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div onClick={handleNavigate}>
          <IoArrowBack className="text-4xl lg:text-6xl text-white/90 cursor-pointer" />
        </div>
        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar.Root className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
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
                  {firstName ? firstName[0] : userInfo.email[0]}
                </div>
              )}
            </Avatar.Root>
            {hovered && (
              <div
                onClick={image ? handleDeleteImage : handleFileInputClick}
                className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full"
              >
                {image ? (
                  <FaTrash
                    className="text-white text-3xl cursor-pointer"
                    onClick={() => setImage(null)}
                  />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer" />
                )}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
              name="profile-image"
              accept=".png, .jpg, .jpeg, .svg, .webp"
            />
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
                    outline:
                      selectedColor === index ? "2px solid white" : "none",
                  }}
                  onClick={() => setSelectedColor(index)}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="w-full">
          <button
            className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
            onClick={saveChanges}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
