"use client";
import BtnArrow from "@/svg/BtnArrow";
import Image from "next/image";
import Link from "next/link";
import InjectableSvg from "@/hooks/InjectableSvg";
import { useAuthContext } from "@/context/AuthContext";
import { useRef, useState } from "react";

const DashboardBannerTwo = () => {
  const { user, uploadProfileImage, uploadCoverImage } = useAuthContext();
  const profileInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const [previewProfile, setPreviewProfile] = useState<string | null>(null);
  const [previewCover, setPreviewCover] = useState<string | null>(null);

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:3000";

  // --- Détermine quelle image afficher ---
  const cover =
    previewCover ||
    (user?.coverImage && user.coverImage.startsWith("/uploads")
      ? `${BACKEND_URL}${user.coverImage}`
      : "/assets/img/bg/student_bg.jpg");

  const profile =
    previewProfile ||
    (user?.profileImage && user.profileImage.startsWith("/uploads")
      ? `${BACKEND_URL}${user.profileImage}`
      : "/assets/img/courses/details_instructors02.jpg");

  // --- Upload handlers ---
  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setPreviewProfile(previewUrl); // ✅ affiche instantanément
      await uploadProfileImage(file); // 🔁 met à jour dans Mongo + user global
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setPreviewCover(previewUrl);
      await uploadCoverImage(file);
    }
  };

  return (
    <div className="dashboard__top-wrap relative">
      {/* --- Photo de couverture --- */}
      <div
        className="dashboard__top-bg relative"
        style={{
          backgroundImage: `url(${cover})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* 🔵 Bouton stylé (icône camera circulaire) */}
        <button
          onClick={() => coverInputRef.current?.click()}
          className="absolute top-4 right-4 bg-white rounded-full shadow-md hover:shadow-lg w-9 h-9 flex items-center justify-center text-skillgro-primary transition-all"
          title="Change cover photo"
        >
          <i className="fa-solid fa-camera"></i>
        </button>
        <input
          type="file"
          accept="image/*"
          ref={coverInputRef}
          className="hidden"
          onChange={handleCoverUpload}
        />
      </div>

      {/* --- Photo de profil --- */}
      <div className="dashboard__instructor-info">
        <div className="dashboard__instructor-info-left relative">
          <div className="thumb relative">
            <div className="relative inline-block">
              <Image
                src={profile}
                alt="profile"
                width={90}
                height={90}
                className="rounded-full object-cover border-4 border-white shadow-md"
              />

              {/* 🟣 Bouton camera miniaturisé */}
              <button
                onClick={() => profileInputRef.current?.click()}
                className="absolute bottom-1 right-1 bg-skillgro-primary hover:bg-skillgro-secondary text-white p-2 rounded-full shadow-sm transition"
                title="Change profile photo"
              >
                <i className="fa-solid fa-camera text-xs"></i>
              </button>
              <input
                type="file"
                accept="image/*"
                ref={profileInputRef}
                className="hidden"
                onChange={handleProfileUpload}
              />
            </div>
          </div>

          <div className="content">
            <h4 className="title">{user?.username || user?.email || "Loading..."}</h4>
            <ul className="list-wrap">
              <li>
                <InjectableSvg
                  src="/assets/img/icons/course_icon03.svg"
                  alt="img"
                  className="injectable"
                />
                {user?.coursesEnrolled ?? 0} Courses Enrolled
              </li>
              <li>
                <InjectableSvg
                  src="/assets/img/icons/course_icon05.svg"
                  alt="img"
                  className="injectable"
                />
                {user?.certificates ?? 0} Certificates
              </li>
            </ul>
          </div>
        </div>

        <div className="dashboard__instructor-info-right">
          <Link href="#" className="btn btn-two arrow-btn">
            Become an Instructor <BtnArrow />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardBannerTwo;
