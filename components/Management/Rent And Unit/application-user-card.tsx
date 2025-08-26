import React from "react";
import { CheckCircle, X } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import UserTag from "@/components/Tags/user-tag";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";

// TypeScript interfaces for type safety
interface ContactAddress {
  address?: string;
  city?: string;
  state?: string;
  lg?: string; // Local Government
}

export interface UserProfileData {
  // Basic Info
  name: string;
  email: string;
  profileImage?: string;
  id: string;
  status?: "mobile" | "web";
  isVerified?: boolean;

  // Personal Details
  gender?: string;
  birthday?: string;
  religion?: string;
  phone?: string;
  maritalStatus?: string;

  // Contact Information
  contactAddress?: ContactAddress;
}

interface UserProfileCardProps {
  user: UserProfileData;
  onClose?: () => void;
  className?: string;
  showCloseButton?: boolean;
  isSticky?: boolean;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  user,
  onClose,
  className = "",
  showCloseButton = true,
  isSticky = true,
}) => {
  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "mobile":
      case "online":
      case "verified":
        return "bg-green-100 text-green-800";
      case "offline":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 ${
        isSticky ? "sticky top-6" : ""
      } ${className}`}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">User Profile</h2>
          {showCloseButton && onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Profile Image and Name */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 mx-auto mb-4 flex items-center justify-center overflow-hidden">
            {user.profileImage ? (
              <Image
                src={user.profileImage}
                alt={`${user.name}'s profile`}
                className="w-full h-full object-cover"
                width={80}
                height={80}
              />
            ) : (
              <span className="text-white font-semibold text-lg">
                {getInitials(user.name)}
              </span>
            )}
          </div>

          <div className="flex items-center justify-center gap-2">
            <h3 className="font-semibold text-gray-900">{user.name}</h3>
            <div className="flex justify-center items-center">
              <BadgeIcon color="green" />
            </div>
          </div>

          <p className="text-gray-600 text-sm mt-1">{user.email}</p>

          <div className="flex justify-center items-center mt-3">
            {user.status && <UserTag type={user.status} />}
          </div>
        </div>

        {/* ID */}
        <div className="text-center mb-6">
          <p className="font-mono text-sm text-gray-600">ID: {user.id}</p>
        </div>

        {/* About Section */}
        <div className="mb-6 space-y-2">
          <h4 className="font-semibold text-gray-900 mb-4">About</h4>
          <div className="space-y-3">
            {user.gender && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Gender</span>
                <span className="font-medium text-gray-900">{user.gender}</span>
              </div>
            )}
            {user.birthday && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Birthday</span>
                <span className="font-medium text-gray-900">
                  {user.birthday}
                </span>
              </div>
            )}
            {user.religion && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Religion</span>
                <span className="font-medium text-gray-900">
                  {user.religion}
                </span>
              </div>
            )}
            {user.phone && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Phone</span>
                <span className="font-medium text-gray-900">{user.phone}</span>
              </div>
            )}
            {user.maritalStatus && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Marital Status</span>
                <span className="font-medium text-gray-900">
                  {user.maritalStatus}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Contact Address Section */}
        {user.contactAddress && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">
              Contact Address
            </h4>
            <div className="space-y-3">
              {user.contactAddress.address && (
                <div className="flex justify-between items-start">
                  <span className="text-gray-600">Address</span>
                  <span className="font-medium text-gray-900 text-right max-w-[60%]">
                    {user.contactAddress.address}
                  </span>
                </div>
              )}
              {user.contactAddress.city && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">City</span>
                  <span className="font-medium text-gray-900">
                    {user.contactAddress.city}
                  </span>
                </div>
              )}
              {user.contactAddress.state && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">State</span>
                  <span className="font-medium text-gray-900">
                    {user.contactAddress.state}
                  </span>
                </div>
              )}
              {user.contactAddress.lg && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">L.G</span>
                  <span className="font-medium text-gray-900">
                    {user.contactAddress.lg}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default UserProfileCard;
