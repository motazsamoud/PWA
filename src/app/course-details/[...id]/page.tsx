import type { Metadata } from "next";
import { notFound } from "next/navigation";

import BreadcrumbOne from "@/components/common/breadcrumb/BreadcrumbOne";
import CourseDetailsArea from "@/components/courses/course-details/CourseDetailsArea";
import courses_data from "@/data/inner-data/InnerCourseData";
import FooterOne from "@/layouts/footers/FooterOne";
import HeaderOne from "@/layouts/headers/HeaderOne";
import Wrapper from "@/layouts/Wrapper";

export const metadata: Metadata = {
   title: "Course Details SkillGro - Online Courses & Education React Next js Template",
};

type Props = {
   params: Promise<{ id: string[] }>;
};

export default async function Page({ params }: Props) {

   const { id } = await params;
   const courseId = id[0];

   const courses = courses_data;
   const single_course = courses.find((item) => String(item.id) === courseId);

   if (!single_course) {
      notFound();
   }

   return (
      <Wrapper>
         <HeaderOne />
         <main className="main-area fix">
            <BreadcrumbOne title="Shop Details" sub_title="Shop Details" />
            <CourseDetailsArea single_course={single_course} />
         </main>
         <FooterOne />
      </Wrapper>
   )
}