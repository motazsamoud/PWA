"use client";
import { ReactNode, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import ScrollToTop from "@/components/common/ScrollToTop";
import AOS from "aos";
import MotionAnimation from "@/hooks/MotionAnimation";

if (typeof window !== "undefined") {
    require("bootstrap/dist/js/bootstrap");
}

type WrapperProps = {
    children: ReactNode;
};

const Wrapper = ({ children }: WrapperProps) => {

    useEffect(() => {
        AOS.init();
    }, [])

    MotionAnimation();

    return <>
        {children}
        <ScrollToTop />
        <ToastContainer position="top-center" />
    </>;
}

export default Wrapper
