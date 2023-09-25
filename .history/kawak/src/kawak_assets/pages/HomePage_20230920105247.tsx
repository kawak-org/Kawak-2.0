import React, { useState, useContext, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { UserContext } from "../context/userContext";
import AnchorLink from "react-anchor-link-smooth-scroll";
import toast from "react-hot-toast";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import Navbar2 from "../components/shared/navbar/Navbar2";
import ErrorHandler from "../utils/ErrorHandler";
import { AiOutlineClose } from "react-icons/ai";
import { HiOutlineUserGroup } from "react-icons/hi";
import { FaBalanceScale } from "react-icons/fa";
import { BiPencil } from "react-icons/bi";
import { BsChatSquareText } from "react-icons/bs";
import { IoIosMenu } from "react-icons/io";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";
// import SplitType from 'split-type';

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Page() {
  const { trackPageView } = useMatomo();
  const { Auth, iiAuth, actor, changeAuthStatus } = useContext(UserContext);
  const [navBar, setNavBar] = useState<boolean>(false);
  const [showNavbar, setShowNavbar] = useState<boolean>(false);
  const navigate = useNavigate();
  const win: Window = window;
  let tl = gsap.timeline({ defaults: { ease: "power1.inOut", duration: 2 } });
  gsap.registerPlugin(ScrollTrigger);
  let logoAnim = useRef();
  let menu1 = useRef();
  let menu2 = useRef();
  let menu3 = useRef();
  let menu4 = useRef();
  let heading = useRef();
  let headingText = useRef();
  let image1 = useRef();
  let image2 = useRef();
  let image3 = useRef();
  let line_1 = useRef();
  let line_2 = useRef();
  let section = useRef();

  useEffect(() => {
    tl.from(
      logoAnim.current,
      {
        y: "100",
        duration: 1.6,
        opacity: 0,
      },
      1
    );
    tl.from(
      [menu1.current, menu2.current, menu3.current, menu4.current],
      {
        opacity: 0,
        y: 150,
        duration: 1.6,
        stagger: {
          amount: 0.5,
        },
      },
      1
    );

    tl.from(
      heading.current,
      {
        x: -200,
        opacity: 0,
        duration: 3,
        ease: "ease-in",
      },
      0.35
    );

    tl.from(
      headingText.current,
      {
        opacity: 0,
        y: 100,
        delay: 0.2,
      },
      "0.35"
    );

    gsap.from(image1.current, {
      y: 1200,
      duration: 1.7,
      ease: "power1.inOut",
      opacity: 0,
      scale: 1.6,
    });

    gsap.from(".mobileImage1", {
      y: 1200,
      duration: 1.7,
      ease: "power1.inOut",
      opacity: 0,
      scale: 1.6,
    });

    gsap.from(".mobileImage2", {
      y: 1200,
      duration: 2,
      ease: "power1.inOut",
      opacity: 0,
      scale: 1.6,
    });
    gsap.from(".mobileLine1", {
      x: -400,
      ease: "power4.inOut",
      opacity: 0,
      duration: 2.7,
    });
    gsap.from(".mobileLine2", {
      x: 200,
      ease: "power4.inOut",
      opacity: 0,
      duration: 3,
    });

    gsap.from(".mobileImage3", {
      y: 1200,
      duration: 2.5,
      ease: "power1.inOut",
      opacity: 0,
      scale: 1.6,
    });

    tl.from(
      image2.current,
      {
        y: 1200,
        duration: 1.7,
        ease: "power1.inOut",
        opacity: 0,
      },
      "-=1"
    ).from(
      image2.current,
      {
        scale: 1.6,
        duration: 1.7,
        ease: "power1.inOut",
      },
      "-=1"
    );

    tl.from(
      image3.current,
      {
        y: 1200,
        ease: "power1.inOut",
        opacity: 0,
        duration: 4,
      },
      "-1"
    ).from(
      image3.current,
      {
        scale: 1.6,
        duration: 4,
        ease: "power4.in",
      },
      1
    );

    tl.from(line_1.current, {
      x: -400,
      ease: "power4.inOut",
      opacity: 0,
      duration: 1,
    });

    tl.from(line_2.current, {
      x: 200,
      ease: "power4.inOut",
      opacity: 0,
      duration: 1,
    });

    gsap.from(section.current, {
      duration: 1,
      y: "100",
      opacity: 0,
      ease: "ease-in",
      scrollTrigger: {
        trigger: ".section-content",
        scrub: 5,
        start: "top 90%",
        end: "bottom 90%",
        toggleActions: "restart complete reverse reset",
      },
    });
    gsap.from(".card", {
      duration: 3,
      y: "100",
      opacity: 0,
      ease: "ease-in",
      scrollTrigger: {
        trigger: ".card-content",
        scrub: 1,
        start: "top 90%",
        end: "bottom 90%",
        toggleActions: "restart complete reverse reset",
      },
    });

    gsap.from(".tag", {
      duration: 3,
      x: -200,
      ease: "ease-in",
      opacity: 0,
      stagger: {
        amount: 0.5,
      },
      scrollTrigger: {
        trigger: ".tag-content",
        scrub: 3,
        start: "top 90%",
        end: "bottom 90%",
        toggleActions: "restart complete reverse reset",
      },
    });

    gsap.from(".tag2", {
      duration: 3,
      x: 200,
      ease: "ease-in",
      opacity: 0,
      scrollTrigger: {
        trigger: ".tag-content2",
        scrub: 3,
        start: "top 90%",
        end: "bottom 90%",
        toggleActions: "restart complete reverse reset",
      },
    });
    gsap.from(".anvil", {
      duration: 3,
      x: -200,
      ease: "ease-in",
      opacity: 0,
      stagger: {
        amount: 0.5,
      },
      scrollTrigger: {
        trigger: ".anvil-content",
        scrub: 3,
        start: "top 90%",
        end: "bottom 90%",
        toggleActions: "restart complete reverse reset",
      },
    });

    gsap.from(".anvil2", {
      duration: 3,
      x: 200,
      ease: "ease-in",
      opacity: 0,
      scrollTrigger: {
        trigger: ".anvil-content2",
        scrub: 3,
        start: "top 90%",
        end: "bottom 90%",
        toggleActions: "restart complete reverse reset",
      },
    });
    gsap.from(".tribunal", {
      duration: 3,
      x: -200,
      ease: "ease-in",
      opacity: 0,
      stagger: {
        amount: 0.5,
      },
      scrollTrigger: {
        trigger: ".tribunal-content",
        scrub: 3,
        start: "top 90%",
        end: "bottom 90%",
        toggleActions: "restart complete reverse reset",
      },
    });

    gsap.from(".tribunal2", {
      duration: 3,
      x: 200,
      ease: "ease-in",
      opacity: 0,
      scrollTrigger: {
        trigger: ".tribunal-content2",
        scrub: 3,
        start: "top 90%",
        end: "bottom 90%",
        toggleActions: "restart complete reverse reset",
      },
    });

    gsap.from(".try_kawak", {
      duration: 3,
      y: 200,
      ease: "ease-in",
      opacity: 0,
      scrollTrigger: {
        trigger: ".try_kawak2",
        scrub: 3,
        start: "top 90%",
        end: "bottom 90%",
        toggleActions: "restart complete reverse reset",
      },
    });

    gsap.from(".freq", {
      duration: 3,
      x: -200,
      ease: "ease-in",
      opacity: 0,
      scrollTrigger: {
        trigger: ".freq2",
        scrub: 3,
        start: "top 80%",
        end: "bottom 90%",
        toggleActions: "restart complete reverse reset",
      },
    });

    gsap.from(".fQ", {
      duration: 3,
      y: 200,
      ease: "ease-in",
      opacity: 0,
      scrollTrigger: {
        trigger: ".fQ2",
        scrub: 3,
        start: "top 80%",
        end: "bottom 90%",
        toggleActions: "restart complete reverse reset",
      },
    });
  }, [gsap]);

  const login_ = () => {
    actor
      ?.logIn()
      .then((d) => {
        if (d === true) {
          console.log("loggin function success response", d);
          changeAuthStatus();
          navigate("/forge");
          navigate(0);
          // window.location.reload();

          toast.success("signed in");
          return;
        }
        changeAuthStatus();
        console.log("loggin function success response", d);
        navigate("/onboarding1");
        navigate(0);
        // window.location.reload();
        // setIamNew(true);
      })
      .catch((err) => {
        console.log("loggin function error response", err);
        ErrorHandler(err);
        // alert(err);
      });
  };
  if (iiAuth) {
    login_();
  }

  const handleNavbar = () => {
    if (window.scrollY >= 100) {
      setNavBar(true);
    } else {
      setNavBar(false);
    }
  };

  window.addEventListener("scroll", handleNavbar);

  // Track page view
  useEffect(() => {
    const params = {
      documentTitle: "HomePage",
      href: window.location.href,
      customDimensions: false,
    };
    trackPageView(params);
  }, []);

  const forgeVid: any = document.getElementById("forgeVid");
  const anvilVid: any = document.getElementById("anvilVid");

  function isElementInViewPort(el) {
    // if(!ref.current) return
    if (!el) return;
    else {
      const rect = el.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <=
          (window.innerWidth || document.documentElement.clientWidth)
      );
    }
  }

  function handleVidPlayback() {
    if (isElementInViewPort(forgeVid) && isElementInViewPort(anvilVid)) {
      forgeVid.pause();
      anvilVid.pause();
    } else if (
      isElementInViewPort(forgeVid) &&
      !isElementInViewPort(anvilVid)
    ) {
      anvilVid.pause();
    } else if (
      isElementInViewPort(anvilVid) &&
      !isElementInViewPort(forgeVid)
    ) {
      forgeVid.pause();
    } else if (forgeVid && !isElementInViewPort(forgeVid)) {
      forgeVid.pause();
    } else if (anvilVid && !isElementInViewPort(anvilVid)) {
      anvilVid.pause();
    }
  }
  function setVideoStartTime(seconds) {
    if (forgeVid && seconds <= forgeVid.duration) {
      forgeVid.currentTime = seconds;
    }
    if (anvilVid && seconds <= anvilVid.duration) {
      anvilVid.currentTime = seconds;
    }
  }

  // Call the function with the desired starting time (e.g., 30 seconds)
  setVideoStartTime(1);

  document.addEventListener("scroll", handleVidPlayback);

  return (
    <div className="p-0 m-0">
      <section className="dark:bg-[#323f4b] bg-[#F98E2D]/10 h-screen  flex flex-col relative ">
        <img
          // ref={line_1}
          className="z-[-10] absolute hidden lg:block right-0 top-[.8rem]  mobileLine1"
          src={`line1.png`}
          alt=""
        />
        <img
          // ref={line_2}
          className="z-[-20] absolute hidden lg:block right-0 top-[3rem]  mobileLine2"
          src={`line2.png`}
          alt=""
        />

        <div
          className={
            navBar
              ? "flex flex-row justify-between mt-4 items-center w-full top-[-1rem] z-10 py-4 dark:bg-[#323f4b] fixed bg-[#08172E]   "
              : "flex flex-row justify-between mt-4 items-center mx-4 md:mx-16 "
          }
        >
          <div className={navBar ? "ml-4 md:ml-16" : ""}>
            <img
              className=" opacity-1 h-[20px]"
              src={navBar ? `logo.png` : `kawak-logo.svg`}
              alt=""
              ref={logoAnim}
            />
          </div>

          {iiAuth === false ? (
            <div className="block z-50 sm:hidden">
              <IoIosMenu
                onClick={() => setShowNavbar(!showNavbar)}
                className={
                  navBar
                    ? " mr-4 text-white w-[2rem] h-[2.2rem] cursor-pointer"
                    : "w-[2rem] h-[2.2rem] cursor-pointer"
                }
              />
              {showNavbar && (
                <div className="fixed h-screen flex flex-col w-[65%] p-4 right-0 top-0 bg-[#08172E]">
                  <div className="flex w-full justify-end ">
                    <AiOutlineClose
                      className=" text-white cursor-pointer"
                      onClick={() => setShowNavbar(false)}
                    />
                  </div>

                  <div className="border-b-[1px] bg-gray-400 my-8" />

                  <div className="flex flex-col w-full h-full justify-center items-center">
                    <AnchorLink href="#how-it-works">
                      <p
                        onClick={() => setShowNavbar(false)}
                        className="text-white text-base my-3 p-1 font-normal cursor-pointer"
                      >
                        How it works
                      </p>
                    </AnchorLink>

                    <AnchorLink href="#Faq">
                      <p
                        onClick={() => setShowNavbar(false)}
                        className="text-white text-base my-3 p-1 font-normal cursor-pointer"
                      >
                        Faq
                      </p>
                    </AnchorLink>
                  </div>

                  <div className="flex h-full my-3">
                    <div className="self-end w-full flex flex-col justify-center items-center">
                      <p
                        onClick={Auth}
                        className="text-white my-3 font-medium p-1 text-base cursor-pointer"
                      >
                        Sign In
                      </p>

                      <button
                        onClick={Auth}
                        className="text-[#08172E] bg-white text-base py-3 px-10"
                      >
                        Try Kawak
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="block z-50 sm:hidden">Loading...</div>
          )}

          <div
            className={
              navBar
                ? " hidden sm:flex flex-row justify-center items-center mr-4 md:mr-16"
                : " hidden sm:flex flex-row justify-center items-center"
            }
          >
            <AnchorLink href="#how-it-works">
              <p
                className={
                  navBar
                    ? "text-white text-sm font-normal mr-6 cursor-pointer "
                    : "text-[#08172E] text-sm font-normal mr-6 cursor-pointer "
                }
                ref={menu1}
              >
                How it works
              </p>
            </AnchorLink>
            <AnchorLink href="#Faq">
              <p
                className={
                  navBar
                    ? "text-white text-sm font-normal mr-6 cursor-pointer "
                    : "text-[#08172E] text-sm font-normal mr-6 cursor-pointer "
                }
                ref={menu2}
              >
                Faq
              </p>
            </AnchorLink>
            <div
              className={
                navBar
                  ? " border-r-2 border-white mr-6 h-[20px] cursor-pointer"
                  : " border-r-2 border-gray-400 mr-6 h-[20px] cursor-pointer"
              }
            ></div>
            {iiAuth === false ? (
              <>
                <button
                  onClick={Auth}
                  className={
                    navBar
                      ? " text-white hover:border-white hover:border-2  text-sm px-4 py-2 mr-6"
                      : " text-[#08172E] hover:border-[#08172E] hover:border-2  text-sm px-4 py-2 mr-6"
                  }
                  ref={menu3}
                >
                  Sign in
                </button>
                <button
                  onClick={Auth}
                  className={
                    navBar
                      ? " text-[#08172E] bg-[#ffffff] text-sm px-4 py-2 mr-6"
                      : " text-white bg-[#08172E] text-sm px-4 py-2 mr-6"
                  }
                  ref={menu4}
                >
                  Sign up
                </button>
              </>
            ) : (
              <div
                className={
                  navBar
                    ? "animate-pulse px-4 text-white text-sm"
                    : "animate-pulse text-[#08172E] px-4 text-sm"
                }
              >
                loading...
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-center lg:justify-start items-center mt-12 ">
          <div className="flex flex-col mx-4 sm:mx-16 lg:w-[60%] ">
            <h1
              ref={heading}
              className=" opacity-100 text-[#08172E] font-bold text-center lg:text-start text-3xl sm:text-3xl sm:leading-[4rem]   md:text-5xl md:leading-[4rem] 2xl:text-7xl  2xl:leading-[4rem]"
            >
              The <span className="text-[#F98E2D]">First Meritocratic</span>{" "}
              Writing Tool
            </h1>
            <p
              ref={headingText}
              className="opacity-100 text-[#152537] lg:w-[19rem] xl:w-[28rem] text-center lg:text-start text-sm mt-[30px]"
            >
              Valuing the development of thoughts, writing and expression by
              providing a tool that is accessible to anyone.
            </p>
          </div>

          <div className="relative flex w-full h-full justify-center mt-[7rem] items-center sm:hidden">
            <div className="">
              <img
                className="w-[30rem] forge mobileImage1"
                src={`mobile.png`}
                alt=""
              />
              <img
                className="z-[-10] absolute right-0 top-[-1rem] mobileLine1"
                src={`line1.png`}
                alt=""
              />
              <img
                className="z-[-20] absolute right-0 top-[1rem] mobileLine2"
                src={`line2.png`}
                alt=""
              />
              <img
                className="absolute left-[1rem] top-[2rem] mobileImage2"
                src={`frame34.png`}
                alt=""
              />
              <img
                className="absolute left-[1rem] top-[11rem] mobileImage3"
                src={`frame34.png`}
                alt=""
              />
            </div>
          </div>

          <div className="relative hidden sm:flex w-full h-full mt-[7rem] justify-center items-center lg:hidden">
            <div className="">
              <img
                className="md:w-[36rem] sm:w-[29rem] opacity-100 sm:h-[25rem] mx-4  md:h-[25rem] mobileImage1"
                src={`forgee.png`}
                alt=""
              />
              <img
                ref={line_1}
                className="z-[-10] absolute right-0 top-[.8rem]  "
                src={`line1.png`}
                alt=""
              />
              <img
                ref={line_2}
                className="z-[-20] absolute right-0 top-[3rem]  "
                src={`line2.png`}
                alt=""
              />
              <img
                className="absolute w-[10rem] opacity-100 h-[5rem] left-[3rem] top-[9rem] mobileImage2"
                src={`frame58.png`}
                alt=""
              />
              <img
                className="absolute w-[10rem] opacity-100 h-[5rem] left-[4rem] top-[22rem] mobileImage3"
                src={`frame59.png`}
                alt=""
              />
            </div>
          </div>

          <div className="relative hidden lg:block ">
            <img
              ref={image1}
              className="opacity-100"
              src={`forgee.png`}
              alt=""
            />
            <img
              ref={image2}
              className="absolute  w-[14rem] h-[6rem] opacity-100 left-[-11rem] lg:top-[13rem]  xl:top-[15rem] "
              src={`frame58.png`}
              alt=""
            />
            <img
              ref={image3}
              className="absolute w-[14rem] h-[6rem] opacity-100 left-[-9rem] hidden xl:block xl:top-[30rem] "
              src={`frame59.png`}
              alt=""
            />
          </div>
        </div>
      </section>

      <section
        className="bg-white z-50  flex flex-col mx-4 sm:mx-16"
        id="how-it-works"
      >
        <div
          ref={section}
          className="flex flex-col justify-center items-center mt-16 "
        >
          <h2 className="text-[#08172E] text-2xl sm:text-3xl font-bold section-content">
            How does Kawak Work
          </h2>
          <p className="text-[#152537] text-center max-w-[700px] text-sm mt-[15px]">
            Effort and time is the currency. The quality of the tool depends on
            you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 items-center mt-12 card ">
          <div className="group card-content">
            <div className="flex flex-row bg-white hover:shadow-lg px-4 py-8 border-2 border-[#08172E]/10 rounded-[10px] group-hover:bg-[#F98E2D] ">
              <div className="w-[15%] md:w-[10%] bg-[#F98E2D] group-hover:bg-white rounded-[6px] h-[53px] justify-center flex items-center">
                <HiOutlineUserGroup className="text-white group-hover:text-[#F98E2D]" />
              </div>
              <div className="flex flex-col w-[85%] md:w-[90%] ml-3">
                <h3 className="text-[#08172E] group-hover:text-white font-semibold font-lg">
                  Community Driven
                </h3>
                <p className="text-[#152537] group-hover:text-white  text-xs md:text-sm mt-5">
                  You hear it a lot but here it’s actually true. Every mind that
                  engages with the work of others has the opportunity to both
                  find and be a mentor.
                  <span className="text-[#F98E2D] group-hover:text-white ">
                    {" "}
                    Participation
                  </span>{" "}
                  is the metric used to measure
                  <span className="text-[#F98E2D] group-hover:text-white ">
                    {" "}
                    the weight of your vote
                  </span>
                  .
                </p>
              </div>
            </div>
          </div>

          <div className="group card-content">
            <div className="flex flex-row bg-white hover:shadow-lg  px-4 py-8 border-2 border-[#08172E]/10 rounded-[10px]  group-hover:bg-[#F98E2D]">
              <div className="w-[15%] md:w-[10%] bg-[#F98E2D] group-hover:bg-white rounded-[6px] h-[53px] justify-center flex items-center">
                <FaBalanceScale className="text-white group-hover:text-[#F98E2D]" />
              </div>
              <div className="flex flex-col w-[85%] md:w-[90%] ml-3">
                <h3 className="text-[#08172E] font-semibold font-lg group-hover:text-white ">
                  Meritocratic
                </h3>
                <p className="text-[#152537] group-hover:text-white text-xs md:text-sm mt-5">
                  Do not rate others generously based on how much they said{" "}
                  <span className="text-[#F98E2D] group-hover:text-white ">
                    {" "}
                    what you wanted to hear
                  </span>
                  . But rather the degree with which they genuinely engaged with
                  your work.
                </p>
              </div>
            </div>
          </div>

          <div className="group card-content">
            <div className="flex flex-row bg-white px-4 py-8 hover:shadow-lg border-2 border-[#08172E]/10 rounded-[10px] group-hover:bg-[#F98E2D]">
              <div className="w-[15%] md:w-[10%] bg-[#F98E2D] group-hover:bg-white rounded-[6px] h-[53px] justify-center flex items-center">
                <BiPencil className="text-white group-hover:text-[#F98E2D]" />
              </div>
              <div className="flex flex-col w-[85%] md:w-[90%] ml-3">
                <h3 className="text-[#08172E] group-hover:text-white  font-semibold font-lg">
                  Sharpen your writing
                </h3>
                <p className="text-[#152537] group-hover:text-white  text-xs md:text-sm mt-5">
                  We define good writing as{" "}
                  <span className="text-[#F98E2D] group-hover:text-white ">
                    clear
                  </span>{" "}
                  and{" "}
                  <span className="text-[#F98E2D] group-hover:text-white ">
                    concise
                  </span>
                  . Where sharp communcation and authentic crticism are vital
                  naviagtional tools for the 21st century.
                </p>
              </div>
            </div>
          </div>

          <div className="group card-content">
            <div className="flex flex-row bg-white px-4 py-8 hover:shadow-lg border-2 border-[#08172E]/10 rounded-[10px]  group-hover:bg-[#F98E2D]">
              <div className="w-[15%] md:w-[10%] bg-[#F98E2D] group-hover:bg-white rounded-[6px] h-[53px] justify-center flex items-center">
                <BsChatSquareText className="text-white group-hover:text-[#F98E2D]" />
              </div>
              <div className="flex flex-col w-[85%] md:w-[90%] ml-3">
                <h3 className="text-[#08172E] group-hover:text-white  font-semibold font-lg">
                  Access to Feedback
                </h3>
                <p className="text-[#152537] group-hover:text-white  text-xs md:text-sm mt-5">
                  Reducing the barrier of{" "}
                  <span className="text-[#F98E2D] group-hover:text-white ">
                    access to education is critical
                  </span>{" "}
                  in a time of global uncertainty. Miracles can only come from
                  the minds of those blessed with{" "}
                  <span className="text-[#F98E2D] group-hover:text-white ">
                    constructive feedback
                  </span>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className=" mx-8 sm:mx-16 mt-[8.3rem]">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-[4rem]">
          <div className="flex flex-col mt-8 tag">
            <div className="text-[#066042] bg-[#EDFDF8] w-fit font-semibold text-lg px-10 py-2 rounded-[10px] tag-content">
              Forge
            </div>
            <h2 className="text-[#08172E] text-base sm:text-xl font-bold mt-8 ">
              A quest board for free flowing ideas and essays of all sorts.
            </h2>
            <p className="text-[#152537]  text-sm mt-5 ">
              Crafts written by all will be displayed on The Forge. Providing
              feedback will unlock their reward. Test your writing in the heat
              of criticism.
            </p>

            <div className=" mt-3 flex flex-col">
              <div className="flex flex-row  my-3 ">
                <div className="bg-[#066042] w-4 h-4 p-3 rounded-full"></div>
                <p className="text-[#152537] ml-2 text-sm ">
                  First you must fuel the Forge
                </p>
              </div>
              <div className="flex flex-row  my-3 ">
                <div className="bg-[#066042] w-4 h-4 p-3 rounded-full"></div>
                <p
                  className="text-[#152537] ml-2 text-sm flex
                                 "
                >
                  Earn <span className="text-[#F98E2D] ml-1 "> Wood</span>{" "}
                  <img
                    src={`wood.png`}
                    alt=""
                    className="w-[20px] h-[20px] mx-1"
                  />{" "}
                  by shedding the deadwood in the crafts of others
                </p>
              </div>
              <div className="flex flex-row my-3">
                <div className="bg-[#066042] w-4 h-4 p-3 rounded-full"></div>
                <p className="text-[#152537] ml-2 text-sm ">
                  Your efforts are directly tied to the reward.
                </p>
              </div>
            </div>
          </div>

          {/* <div className="relative mt-[3.9rem] tag2">
            <img className="z-20 tag-content2" src={`forge-3.png`} alt="" />
            <img
              className="absolute z-[-20] bottom-0 left-[-13rem]"
              src={`blue.png`}
              alt=""
            />
            <img
              className="absolute w-[10rem] sm:w-[20rem] lg:w-[24rem] z-[-20] top-[4rem] right-[-1rem] md:right-[-4rem]"
              src={`pink.png`}
              alt=""
            />
          </div> */}
          <div className="relative mt-[3.9rem">
            <video
              id="forgeVid"
              className="relative h-auto w-40% m-auto"
              /* autoPlay  muted */ playsInline
              loop
              controls
            >
              <source src={`onboarding-videos/Forge.mp4`} type="video/mp4" />
              <source src={`onboarding-videos/Forge.ogg`} type="video/ogg" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-[4rem] mt-[10rem] ">
          <div className="relative mt-[3.9rem] ">
            <video
              id="anvilVid"
              className="relative h-auto w-40% m-auto"
              /* autoPlay  muted */ playsInline
              loop
              controls
            >
              <source
                /* className="w-[30%]" */ src={`onboarding-videos/Anvil.mp4`}
                type="video/mp4"
              />
              <source src={`onboarding-videos/Anvil.ogg`} type="video/ogg" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="flex flex-col anvil2 order-first md:order-last">
            <div className="text-[#F98E2D] bg-[#F98E2D]/20 w-fit font-semibold text-lg px-10 py-2 rounded-[10px] anvil-content2">
              Anvil
            </div>
            <h2 className="text-[#08172E] text-base sm:text-xl font-bold mt-8 ">
              Your private text editor and storage system.
            </h2>
            <p className="text-[#152537]  text-sm mt-5 ">
              Your private text editor and storage system. Your custom text
              editor and private storage tool. Write, dance, think, create,
              explore like no one is watching.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-[4rem] mt-[10rem]">
          <div className="flex flex-col mt-8 tribunal">
            <div className="text-[#1E4EAE] bg-[#F0F5FF] w-fit font-semibold text-lg px-10 py-2 rounded-[10px] tribunal-content">
              Tribunal
            </div>
            <h2 className="text-[#08172E] text-base sm:text-xl font-bold mt-8 ">
              It serves as a separate pool of tokens.
            </h2>
            <p className="text-[#152537]  text-sm mt-5 ">
              Engaged community members are incentivised to act as a neutral
              party in voting over any disagreements that can arise within the
              community. It serves as a separate pool of tokens where
              independent 3rd party users can vote on outcomes and be rewarded
              for doing so
            </p>

            <div className=" mt-3 flex flex-col">
              <div className="flex flex-row  my-3 ">
                <div className="bg-[#1E4EAE] w-4 h-4 p-3 rounded-full"></div>
                <p className="text-[#152537] ml-2 text-sm ">
                  This community is incentivized to eliminate bad actors or the
                  mere lazy user.
                </p>
              </div>
              <div className="flex flex-row  my-3 ">
                <div className="bg-[#1E4EAE] w-4 h-4 p-3 rounded-full"></div>
                <p className="text-[#152537] ml-2 text-sm ">
                  Independent 3rd party users can vote on outcomes
                </p>
              </div>
              {/* <div className='flex flex-row my-3'>
								<div className='bg-[#1E4EAE] w-4 h-4 p-3 rounded-full'></div>
								<p className='text-[#152537] ml-2 text-sm '>
									Lorem ipsum dolor sit amet, consectetur adipiscing elitneque
									nullap donec.
								</p>
							</div> */}
            </div>
          </div>

          <div className="relative mt-[3.9rem] tribunal2">
            <img
              className="z-20 tribunal-content2"
              src={`forge-3.png`}
              alt=""
            />
            <img
              className="absolute z-[-20] top-[-6rem] left-[-8rem]"
              src={`ellipse9.png`}
              alt=""
            />
            <img
              className="absolute w-[10rem] sm:w-[20rem] lg:w-[24rem] z-[-20] top-[4rem] right-[-1rem] md:right-[-4rem]"
              src={`pink.png`}
              alt=""
            />
          </div>
        </div>
      </section>

      <section className="bg-[#F98E2D]/10 w-full h-[17rem] mt-[10rem] mb-[3rem] flex justify-center items-center">
        <div className="flex flex-col justify-center items-center try_kawak">
          <h2 className="text-[#08172E] text-xl sm:text-3xl font-bold try_kawak2">
            Get started Today
          </h2>
          <p className="my-4 text-center mx-4 text-base sm:text-lg  max-w-[400px]">
            Sign up to KawaK today and get access to the first meritocratic
            writing tool
          </p>
          <button
            onClick={Auth}
            className=" text-white bg-[#08172E] text-xs px-4 py-2 "
          >
            Try Kawak
          </button>
        </div>
      </section>

      <section className="mx-4 sm:mx-16 mt-[5rem] freq" id="Faq">
        <h2 className="text-[#08172E] freq2 text-lg sm:text-3xl font-bold">
          Frequently asked questions
        </h2>
        <p className="my-4  max-w-[500px]">
          If you can’t find what you’re looking for, feel free to email our
          support team at
          <span
            onClick={() =>
              (win.location =
                "mailto:marvellous@kawak.org?subject=SendMail&body=Description")
            }
            className="text-[#F98E2D] cursor-pointer"
          >
            {" "}
            contact@kawak.org
          </span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-[3rem] mb-[1rem] fQ">
          {faqs.map((faq, index) => (
            <Disclosure as="div" key={index} className="fQ2">
              {({ open }) => (
                <>
                  <div className="text-base">
                    <Disclosure.Button className="w-full flex justify-between ">
                      <span className=" ml-[-1.2rem] font-medium text-[#08172E] ">
                        {faq.question}
                      </span>
                      <span className="ml-6 h-7 flex items-center">
                        <ChevronDownIcon
                          className={classNames(
                            open ? "-rotate-180" : "rotate-0",
                            "h-6 w-6 transform"
                          )}
                          aria-hidden="true"
                        />
                      </span>
                    </Disclosure.Button>
                  </div>
                  <Disclosure.Panel as="dd" className="mt-2 ">
                    <p className="text-sm text-[#08172E] ">{faq.answer}</p>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
        </div>
      </section>

      <footer className=" flex flex-col mt-[5rem] bg-[#08172E]">
        <section className=" mx-4 sm:mx-16 flex flex-col md:flex-row justify-between  py-3">
          <div className=" flex flex-col mt-[5rem]">
            <img className=" h-[30px] w-[9rem]" src={`logo.png`} />
            <p className="max-w-[400px] mt-[1rem] text-xs text-white/90">
              It is a free meritocratic tool where good feedback on peers’
              essays is rewarded by matching writers with others who provide the
              same quality of feedback.
            </p>
          </div>
          <div className="flex flex-row gap-16 lg:gap-32">
            <div className=" flex flex-col mt-[3rem] ">
              <h4 className="font-bold text-sm text-white/90">Kawak</h4>
              <ul>
                <a href="#">
                  <li className="text-sm my-2 text-white/50 hover:text-white/90 cursor-pointer">
                    About us
                  </li>
                </a>
                <AnchorLink href="#how-it-works">
                  <li className="text-sm my-2 text-white/50 hover:text-white/90 cursor-pointer">
                    How it works
                  </li>
                </AnchorLink>
                <AnchorLink href="#Faq">
                  <li className="text-sm my-2 text-white/50 hover:text-white/90 cursor-pointer">
                    Faq
                  </li>
                </AnchorLink>
              </ul>
            </div>

            {/* <div className=' flex flex-col mt-[3rem] '>
                            <h4 className='font-bold text-sm text-white/90'>Helpful Links</h4>
                            <ul>
                                <a href="#">
                                    <li className='text-sm my-2 text-white/50 hover:text-white/90 cursor-pointer'>
                                        Support
                                    </li>
                                </a>
                                <NavLink to="#">
                                    <li className='text-sm my-2 text-white/50 hover:text-white/90 cursor-pointer'>
                                        Terms and Conditions
                                    </li>
                                </NavLink>
                                <NavLink to="#">
                                    <li className='text-sm my-2 text-white/50 hover:text-white/90 cursor-pointer'>
                                        Privacy Policy
                                    </li>
                                </NavLink>
                            </ul>
                        </div> */}

            <div className=" flex flex-col mt-[3rem]">
              <h4 className="font-bold text-sm text-white/90">Socials</h4>
              <ul>
                <li
                  onClick={() =>
                    (win.location =
                      "mailto:marvellous@kawak.org?subject=SendMail&body=Description")
                  }
                  className="text-sm my-2 text-white/50 hover:text-white/90 cursor-pointer"
                >
                  Email Us
                </li>

                <a href="https://www.linkedin.com/company/kawakorg/">
                  <li className="text-sm my-2 text-white/50 hover:text-white/90 cursor-pointer">
                    Linkedin
                  </li>
                </a>
                <a href="https://twitter.com/KawaK_ICP">
                  <li className="text-sm my-2 text-white/50 hover:text-white/90 cursor-pointer">
                    Twitter
                  </li>
                </a>
                <a href="https://instagram.com/kawakorg?igshid=YmMyMTA2M2Y=">
                  <li className="text-sm my-2 text-white/50 hover:text-white/90 cursor-pointer">
                    Instagram
                  </li>
                </a>
              </ul>
            </div>
          </div>
        </section>

        <div className="mx-4 sm:mx-16 mt-[3rem]">
          <div className="border-b-[1px] border-white/50 " />
          <p className="text-xs my-6 text-center text-white/50 ">
            Copyright &copy; 2023 Kawak. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

const faqs = [
  {
    question: "Do I have to pay?",
    answer: "No. The barrier of entry is your effort alone. ",
  },
  {
    question: "What is NFID?",
    answer:
      "The fastest way to securely and pirvately authenticate with full stack blockchain applications.",
  },
  {
    question: "What about plagiarism? ",
    answer:
      "We display your essay only as many times as you allow it. In addition a timestamp when you publish your work is made providing you grownds for the originality of your work. ",
  },
  {
    question: "Why meritocratic?",
    answer:
      "While no system is perfect, meritocracy has demonstrated overtime a consistent ability in producing a net positive for humanity at large. Still sceptical? We suggest reading “The Aristocracy of Talent” by Alan Wooldridge",
  },
  {
    question: "What’s with the weird url?",
    answer:
      "Since the website aims to be owned by the community we are decentralized and running all computation on a blockchain. ",
  },
  {
    question: "Who are you? ",
    answer:
      "A bunch of students from Nigeria and the UK who grew tired of the complacency displayed by a wide range of academic institutions. ",
  },
];
