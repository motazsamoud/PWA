"use client";

import Image from "next/image";
import bg_img from "@/assets/img/bg/dashboard_bg.jpg";
import DashboardBannerTwo from "@/dashboard/dashboard-common/DashboardBannerTwo";
import DashboardSidebarTwo from "@/dashboard/dashboard-common/DashboardSidebarTwo";
import InstructorSettingContent from "@/dashboard/instructor-dashboard/instructor-setting/InstructorSettingContent";

const StudentSettingArea = () => {
  return (
    <section className="dashboard__area section-pb-120">
      <div className="dashboard__bg">
        <Image src={bg_img} alt="Dashboard background" />
      </div>
      <div className="container">
        <DashboardBannerTwo />
        <div className="dashboard__inner-wrap">
          <div className="row">
            <DashboardSidebarTwo />
            {/* ✅ Appel du composant global qui contient les 3 onglets */}
            <InstructorSettingContent style={true} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentSettingArea;
