import type { Metadata } from "next";
import { notFound } from "next/navigation";

import BreadcrumbOne from "@/components/common/breadcrumb/BreadcrumbOne";
import ProductDetailsArea from "@/components/inner-shop/product-details/ProductDetailsArea";
import product_data from "@/data/inner-data/InnerCourseData";
import FooterOne from "@/layouts/footers/FooterOne";
import HeaderOne from "@/layouts/headers/HeaderOne";
import Wrapper from "@/layouts/Wrapper";

export const metadata: Metadata = {
   title: "Shop Details SkillGro - Online Courses & Education React Next js Template",
};

type Props = {
   params: Promise<{ id: string[] }>;
};

export default async function Page({ params }: Props) {

   const { id } = await params;
   const productId = id[0];

   const products = product_data;
   const single_product = products.find((item) => String(item.id) === productId);

   if (!single_product) {
      notFound();
   }

   return (
      <Wrapper>
         <HeaderOne />
         <main className="main-area fix">
            <BreadcrumbOne title="Course Details" sub_title="Course Details" />
            <ProductDetailsArea single_product={single_product} />
         </main>
         <FooterOne />
      </Wrapper>
   )
}