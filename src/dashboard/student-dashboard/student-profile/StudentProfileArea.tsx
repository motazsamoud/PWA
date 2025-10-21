"use client";

import { useAuthContext } from "@/context/AuthContext"; // ✅ remplace useAuth
import Image from "next/image";
import DashboardSidebarTwo from "@/dashboard/dashboard-common/DashboardSidebarTwo";
import bg_img from "@/assets/img/bg/dashboard_bg.jpg";

const StudentProfileArea = () => {
  const { user, loading } = useAuthContext(); // ✅ récupère le user global + loading

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading profile...</p>;
  }

  if (!user) {
    return <p style={{ textAlign: "center", color: "red" }}>User not found. Please log in.</p>;
  }

  return (
    <section className="dashboard__area section-pb-120">
      <div className="dashboard__bg">
        <Image src={bg_img} alt="" />
      </div>
      <div className="container">
        <div className="dashboard__inner-wrap">
          <div className="row">
            <DashboardSidebarTwo />

            <div className="col-lg-9">
              <div className="dashboard__content-title">
                <h4 className="title">My Profile</h4>
              </div>

              <div className="dashboard__profile-info">
                <ul>
                  <li>
                    <strong>Username:</strong> {user.username || "N/A"}
                  </li>
                  <li>
                    <strong>Email:</strong> {user.email || "N/A"}
                  </li>
                  <li>
                    <strong>Date of Birth:</strong>{" "}
                    {user.dateOfBirth
                      ? new Date(user.dateOfBirth).toLocaleDateString()
                      : "N/A"}
                  </li>
                  <li>
                    <strong>Status:</strong> {user.status || "N/A"}
                  </li>
                  <li>
                    <strong>Role:</strong> {user.role || "N/A"}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentProfileArea;
