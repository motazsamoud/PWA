"use client";
import BtnArrow from "@/svg/BtnArrow";
import Image from "next/image";
import Link from "next/link";
import { useAuthContext } from "@/context/AuthContext";

interface StyleType {
  style?: boolean;
}

const DashboardBanner = ({ style }: StyleType) => {
  const { user } = useAuthContext();

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:3000";

  const cover =
    user?.coverImage && user.coverImage.startsWith("/uploads")
      ? `${BACKEND_URL}${user.coverImage}`
      : "/assets/img/bg/instructor_dashboard_bg.jpg";

  const profile =
    user?.profileImage && user.profileImage.startsWith("/uploads")
      ? `${BACKEND_URL}${user.profileImage}`
      : "/assets/img/courses/details_instructors01.jpg";

  return (
    <div className="dashboard__top-wrap">
      <div
        className="dashboard__top-bg"
        style={{ backgroundImage: `url(${cover})` }}
      ></div>

      <div className="dashboard__instructor-info">
        <div className="dashboard__instructor-info-left">
          <div className="thumb">
            <Image
              src={profile}
              alt="profile"
              width={80}
              height={80}
              className="rounded-circle object-cover"
            />
          </div>
          <div className="content">
            <h4 className="title">{user?.username || user?.email || "User"}</h4>
            <div className="review__wrap review__wrap-two">
              <div className="rating">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <span>({user?.reviewsCount ?? 15} Reviews)</span>
            </div>
          </div>
        </div>

        <div className="dashboard__instructor-info-right">
          <Link href="#" className="btn btn-two arrow-btn">
            Create a New Course <BtnArrow />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardBanner;
