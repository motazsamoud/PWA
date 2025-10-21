"use client";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";

const DashboardSidebarTwo = () => {
  const { user } = useAuthContext();
  const pathname = usePathname();

  const sidebar_data = [
    {
      id: 1,
      title: `Welcome, ${user?.username || user?.email || "Loading..."}`,
      sidebar_details: [
        { id: 1, link: "/student-dashboard", icon: "fas fa-home", title: "Dashboard" },
        { id: 2, link: "/student-profile", icon: "skillgro-avatar", title: "My Profile" },
        { id: 3, link: "/student-enrolled-courses", icon: "skillgro-book", title: "Enrolled Courses" },
        { id: 4, link: "/student-wishlist", icon: "skillgro-label", title: "Wishlist" },
        { id: 5, link: "/student-review", icon: "skillgro-book-2", title: "Reviews" },
        { id: 6, link: "/student-attempts", icon: "skillgro-question", title: "My Quiz Attempts" },
        { id: 7, link: "/student-history", icon: "skillgro-satchel", title: "Order History" },
      ],
    },
    {
      id: 2,
      title: "User",
      class_name: "mt-30",
      sidebar_details: [
        { id: 1, link: "/student-setting", icon: "skillgro-settings", title: "Settings" },
        { id: 2, link: "/", icon: "skillgro-logout", title: "Logout" },
      ],
    },
  ];

  return (
    <div className="col-lg-3">
      <div className="dashboard__sidebar-wrap">
        {sidebar_data.map((item) => (
          <React.Fragment key={item.id}>
            <div className={`dashboard__sidebar-title mb-20 ${item.class_name || ""}`}>
              <h6 className="title">{item.title}</h6>
            </div>
            <nav className="dashboard__sidebar-menu">
              <ul className="list-wrap">
                {item.sidebar_details.map((list) => (
                  <li key={list.id} className={pathname === list.link ? "active" : ""}>
                    <Link href={list.link}>
                      <i className={list.icon}></i>
                      {list.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default DashboardSidebarTwo;
