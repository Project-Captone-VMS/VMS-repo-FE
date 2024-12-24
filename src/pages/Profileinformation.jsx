import React, { useState, useEffect, useRef } from "react";
import { Camera } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription } from "../components/ui/alert";
import { getUserUsername } from "@/services/apiRequest";


const ProfileInformation = () => {
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    driverLicense: "",
    vehicleInfo: "",
    experience: "",
    birthDate: "",
    emergencyContact: "",
    avatar: null,
  });


  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dataUser,setDataUser] = useState([])

  const userRole = localStorage.getItem("userRole");
  const username = localStorage.getItem("username");

  const inputRef = useRef(null);
  const [image, setImage] = useState("");

  const handleImageClick = () => {
    inputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(event.target.files[0]);
  };

  // Giả lập fetch data từ API
  useEffect(() => {
    const fetchUserData = async (username) => {
      console.log(username)
      const results = await getUserUsername(username);
      console.log("results", results)
      setDataUser(results);
    }
    fetchUserData(username);
  }, [username]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation cho driver
    if (userRole === "driver") {
      const requiredFields = [
        "phone",
        "address",
        "driverLicense",
        "vehicleInfo",
        "experience",
        "birthDate",
        "emergencyContact",
      ];
      const emptyFields = requiredFields.filter((field) => !userInfo[field]);

      if (emptyFields.length > 0) {
        setError("Please fill in all required fields");
        return;
      }
    }

    try {
      // Thay thế bằng API call thực tế
      // await updateUserProfile(userInfo);
      setSuccess("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      setError("Failed to update profile");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Avatar Section */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div onClick={handleImageClick}>
                {image ? (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {" "}
                    <img src={URL.createObjectURL(image)} alt="" />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {userInfo.avatar ? (
                      <img
                        src={userInfo.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                )}
                <input
                  type="file"
                  ref={inputRef}
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </div>

              {isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute bottom-0 right-0 rounded-full"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Change
                </Button>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <Input
                  name="firstName"
                  value={dataUser.firstName}
                  disabled={true}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <Input
                  name="lastName"
                  value={dataUser.lastName}
                  disabled={true}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  value={dataUser.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number *
                </label>
                <Input
                  type="tel"
                  name="phone"
                  value={dataUser.phoneNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                License Number *
                </label>
                <Input
                  type="text"
                  name="license_number"
                  value={dataUser.licenseNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                Work schedule*
                </label>
                <Input
                  type="date"
                  name="workSchedule"
                  value={dataUser.workSchedule}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
            </div>



            {/* Error and Success Messages */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              {!isEditing ? (
                <Button type="button" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setError("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileInformation;
