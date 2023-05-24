import React, { useEffect, useState, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useFetchProfile } from "../../../functions/contract";
import { useAppSelector } from "../../../redux/hooks";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
// import { useGetAllNFTs } from "../../../functions/contract";
import { AiOutlineClose } from "react-icons/ai";
import { IoIosMenu } from "react-icons/io";
import SignOutModal from "../../Modal/SignOutModal";
import { DarkModeToggle } from "react-dark-mode-toggle-2";

const Navbar = () => {
  const [activePage, setActivePage] = useState(0);
  const [openProfile, setOpenProfile] = useState<boolean>(false);
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [showNavbar, setShowNavbar] = useState<boolean>(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const user = useAppSelector((state) => state.profile);
  const nfts = useAppSelector((state) => state.myNFT);

  const [theme, setTheme] = useState(localStorage.theme);
  const colorTheme = theme === "dark" ? "light" : "dark"
  const [isDarkMode, setIsDarkMode] = useState<boolean>(colorTheme === "light" ? true : false );

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeSwitch = (isDarkMode: any) => {
    setTheme(colorTheme);
    setIsDarkMode(isDarkMode)
  };

  // const { handleGetNFTs } = useGetAllNFTs();

  // useEffect(() => {
  //   if (nfts.length < 1) {
  //     handleGetNFTs();
  //   }
  // }, []);

  const { handleFetch } = useFetchProfile();
  useEffect(() => {
    handleFetch();
  }, []);

  // const handleSetActivePage = (number: number) => {
  //   setActivePage(number);
  // };

  // const handleSignOut = () => {
  //   window.localStorage.clear();
  //   window.location.reload();
  //   // navigate("/");
  // };

  return (
    <div className="fixed dark:bg-[#323f4b] top-0 z-30 bg-white sm:bg-[#08172E] h-[4rem] flex flex-rol items-center justify-between w-full">
      <div>
        <img
          className="w-[7rem] h-[20px] ml-8 hidden sm:flex"
          src={`logo.png`}
          alt="logo"
        />
        <img
          className="w-[7rem] h-[20px] ml-4 flex sm:hidden"
          src={`logo!.png`}
          alt="logo"
        />
      </div>

      <div className=" flex sm:hidden mx-4">
        <IoIosMenu
          className="w-[2rem] h-[2.2rem] cursor-pointer"
          onClick={() => setShowNavbar(true)}
        />
        {showNavbar && (
          <div className="fixed h-screen flex flex-col w-[80%] p-4 right-0 top-0 bg-[#08172E]">
            <div className="flex w-full justify-end ">
              <AiOutlineClose
                className=" text-white cursor-pointer"
                onClick={() => setShowNavbar(false)}
              />
            </div>

            <div
              onClick={() => setOpenProfile(!openProfile)}
              className="relative flex  items-center"
            >
              <img
                className="cursor-pointer w-10 h-10 bg-white rounded-full py-1 px-1"
                src={user.avatar}
                alt=""
              />
              {openProfile ? (
                <IoIosArrowDown className="text-lg ml-2 text-white cursor-pointer" />
              ) : (
                <IoIosArrowUp className="text-lg ml-2 text-white cursor-pointer" />
              )}

              {openProfile && (
                <div className="bg-white absolute top-[3.7rem] right-[.5rem] shadow-md  flex z-20 flex-col rounded-[5px] p-4  w-[200px] h-[290px] ">
                  <div className=" flex flex-col  justify-between  ">
                    <p className="text-gray-400 my-2 text-xs font-normal">
                      Signed in as
                    </p>
                    <h2 className="text-[#141414] font-semibold text-sm">
                      {user.username}
                    </h2>
                  </div>
                  <div className="border-b-[1px] bg-gray-400 my-3" />
                  <div className="flex flex-col">
                    <p
                      className="text-gray-500 text-xs my-2  relative hover:bg-gray-200 p-1 hover:w-full font-normal cursor-pointer"
                      onClick={() => setShowProfile(!showProfile)}
                    >
                      My Profile
                    </p>
                    {/* <p className='text-gray-500 text-xs my-2 hover:bg-gray-200 p-1 hover:w-full font-normal cursor-pointer'>
										Display Settings
									</p> */}

                    <Link to="/terms-and-conditions">
                      <p className="text-gray-500 text-xs my-2 hover:bg-gray-200 p-1 hover:w-full font-normal cursor-pointer">
                        Terms of Use
                      </p>
                    </Link>
                    <Link to="/privacy-policy">
                      <p className="text-gray-500 text-xs my-2 hover:bg-gray-200 p-1 hover:w-full font-normal cursor-pointer">
                        Privacy Policy
                      </p>
                    </Link>
                  </div>
                  <div className="border-b-[1px] bg-gray-400 my-3" />
                  <div className="flex flex-row  ">
                    <p
                      onClick={() => setModalIsOpen(true)}
                      className="text-[#EF4444] font-medium hover:bg-gray-200 p-1 hover:w-full text-sm cursor-pointer"
                    >
                      Sign Out
                    </p>
                  </div>
                  {/* </div> */}
                </div>
              )}
            </div>

            <div className="border-b-[1px] bg-gray-400 my-3 w-full" />

            <div className=" flex flex-col justify-center mt-20 items-center w-full ">
              <NavLink
                to="/forge"
                className={({ isActive }) =>
                  isActive
                    ? " text-white text-sm bg-[white]/10 px-6 py-2 mt-7 rounded-[4px]"
                    : "text-white   mt-7 text-sm"
                }
              >
                Forge
              </NavLink>
              <NavLink
                to="/my-essay/all-essays"
                className={({ isActive }) =>
                  isActive
                    ? " text-white text-sm bg-[white]/10 px-6 py-2 mt-7 rounded-[4px]"
                    : " text-white  mt-7 text-sm"
                }
              >
                My Essay
              </NavLink>
              <NavLink
                to="/my-NFTs"
                className={({ isActive }) =>
                  isActive
                    ? " text-white text-sm bg-[white]/10 px-6 py-2 mt-7 rounded-[4px]"
                    : "text-white  mt-7 text-sm"
                }
              >
                My NFts
              </NavLink>

              <NavLink
                to="/marketplace"
                className={({ isActive }) =>
                  isActive
                    ? " text-white text-sm bg-[white]/10 px-6 py-2 mt-7 rounded-[4px]"
                    : "text-white  mt-7 text-sm"
                }
              >
                Marketplace
              </NavLink>
            </div>

            <div className="flex h-full my-3">
              <div className="self-end w-full flex flex-col justify-center items-center">
                <div className="border-b-[1px] bg-gray-400 my-3 w-full" />
                <p
                  onClick={() => setModalIsOpen(true)}
                  className="text-[#EF4444]  font-medium p-1 text-sm cursor-pointer"
                >
                  Sign Out
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className=" hidden sm:flex mr-5 justify-center items-center ">
        <NavLink
          to="/forge"
          className={({ isActive }) =>
            isActive
              ? " text-white text-sm bg-[white]/10 px-6 py-2 ml-7 rounded-[4px]"
              : "text-white   ml-7 text-sm"
          }
        >
          Forge
        </NavLink>
        <NavLink
          to="/my-essay/all-essays"
          className={({ isActive }) =>
            isActive
              ? " text-white text-sm bg-[white]/10 px-6 py-2 ml-7 rounded-[4px]"
              : " text-white  ml-7 text-sm"
          }
        >
          My Essay
        </NavLink>
        <NavLink
          to="/my-NFTs"
          className={({ isActive }) =>
            isActive
              ? " text-white text-sm bg-[white]/10 px-6 py-2 ml-7 rounded-[4px]"
              : "text-white  ml-7 text-sm"
          }
        >
          My NFts
        </NavLink>
        <NavLink
          to="/marketplace"
          className={({ isActive }) =>
            isActive
              ? " text-white text-sm bg-[white]/10 px-6 py-2 ml-7 rounded-[4px]"
              : "text-white  ml-7 text-sm"
          }
        >
          Marketplace
        </NavLink>
      </div>

      <div
        className="hidden sm:flex flex-row relative justify-center items-center mr-8 "
        onClick={() => setOpenProfile(!openProfile)}
      >
        <img
          className="cursor-pointer w-10 h-10 bg-white rounded-full py-1 px-1"
          // src={user.avatar ? user.avatar : ""}
          src={user.avatar}
          alt=""
        />
        {openProfile ? (
          <IoIosArrowDown className="text-lg ml-2 text-white cursor-pointer" />
        ) : (
          <IoIosArrowUp className="text-lg ml-2 text-white cursor-pointer" />
        )}

        {openProfile && (
          <div className="dark:bg-[#323f4b] bg-white absolute top-[3.4rem] right-[-1.5rem] shadow-md  flex z-20 flex-col rounded-[5px] p-4  w-[13.75rem] h-[20rem] ">
            <div className=" flex flex-col  justify-between  ">
              <p className="text-gray-400 my-2 text-xs font-normal">
                Signed in as
              </p>
              <h2 className="text-[#141414] dark:text-gray-400  font-semibold text-sm">
                {user.username}
              </h2>
            </div>

            <div className="border-b-[1px] bg-gray-400 my-3" />

            <div className="flex flex-col">
              <p
                className="text-gray-500 text-xs my-2  relative hover:bg-gray-200 p-1 hover:w-full font-normal cursor-pointer"
                onClick={() => setShowProfile(!showProfile)}
              >
                My Profile
              </p>
              {/* <p className='text-gray-500 text-xs my-2 hover:bg-gray-200 p-1 hover:w-full font-normal cursor-pointer'>
								Display Settings
							</p> */}

              <Link to="/terms-and-conditions">
                <p className="text-gray-500 text-xs my-2 hover:bg-gray-200 p-1 hover:w-full font-normal cursor-pointer">
                  Terms of Use
                </p>
              </Link>
              <Link to="/privacy-policy">
                <p className="text-gray-500 text-xs my-2 hover:bg-gray-200 p-1 hover:w-full font-normal cursor-pointer">
                  Privacy Policy
                </p>
              </Link>
              <div
                className="flex items-center justify-between text-gray-500 text-xs my-2  p-1 hover:w-full font-normal cursor-pointer"
              >
                <p> Toggle mode</p>
                <DarkModeToggle
                  onChange={handleThemeSwitch}
                  isDarkMode={isDarkMode}
                  size={50}
                />
              </div>
            </div>
            <div className="border-b-[1px] bg-gray-400 my-3" />
            <div className="flex flex-row  ">
              <p
                onClick={() => setModalIsOpen(true)}
                className="text-[#EF4444] font-medium hover:bg-gray-200 p-1 hover:w-full text-sm cursor-pointer"
              >
                Sign Out
              </p>
            </div>
            {/* </div> */}
          </div>
        )}
      </div>
      {showProfile && (
        <div className="absolute bg-white z-10 right-[1rem] top-[5rem] shadow-lg p-2 sm:p-6 flex flex-col w-[70%] sm:w-[28rem] h-fit sm:h-[30rem] rounded-xl justify-center items-center ">
          <AiOutlineClose
            onClick={() => setShowProfile(!showProfile)}
            className="absolute right-4 top-4 text-xl cursor-pointer"
          />
          <div className="flex flex-col justify-center items-center">
            <img
              className=" w-[60px] h-[60px] sm:w-[120px] sm:h-[120px]"
              src={user.avatar}
              /* src={user.avatar ? user.avatar : ""} */ alt=""
            />
            <h4 className="text-[#141414] font-semibold mt-2 text-base sm:text-lg">
              {user.username}
            </h4>
            {/* <p className='text-gray-400 text-xs my-1 font-normal cursor-pointer'>
							username
						</p> */}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 mt-4">
            <Link to="/my-essay/all-essays">
              <div
                className="bg-[#F98E2D]/30 h-[6rem] w-[6.2rem] sm:h-[7rem] sm:w-[7.2rem] rounded-[10px] cursor-pointer flex flex-col items-center
															p-6"
              >
                <h1 className="text-[#141414] font-bold text-lg sm:text-2xl">
                  {user.noOfEssays}
                </h1>
                <h1 className="text-[#141414] font-medium text-xs ">
                  My Essays
                </h1>
              </div>
            </Link>
            <div
              className="bg-[#F98E2D]/30 h-[6rem] w-[6.2rem] sm:h-[7rem] sm:w-[7.2rem] rounded-[10px] flex flex-col items-center
														 p-6"
            >
              <h1 className="text-[#141414] font-bold text-lg sm:text-2x">
                {user.reviewingEssay}
              </h1>
              <h1 className="text-[#141414] font-medium text-xs text-center ">
                Reviewing Essay
              </h1>
            </div>
            <Link to="/my-NFTs">
              <div
                className="bg-[#F98E2D]/30 h-[6rem] w-[6.2rem] sm:h-[7rem] sm:w-[7.2rem] cursor-pointer rounded-[10px] flex flex-col items-center
															p-6"
              >
                <h1 className="text-[#141414] font-bold text-lg sm:text-2x">
                  {nfts?.length}
                </h1>
                <h1 className="text-[#141414] font-medium text-xs ">My Nfts</h1>
              </div>
            </Link>
            <Link to="/my-essay/draft">
              <div
                className="bg-[#F98E2D]/30 h-[6rem] w-[6.2rem] sm:h-[7rem] sm:w-[7.2rem] cursor-pointer rounded-[10px] flex flex-col items-center
															p-6"
              >
                <h1 className="text-[#141414] font-bold text-lg sm:text-2x">
                  {user?.noOfDrafts}
                </h1>
                <h1 className="text-[#141414] font-medium text-xs ">Drafts</h1>
              </div>
            </Link>
            <div
              className="bg-[#F98E2D]/30 h-[6rem] w-[6.2rem] sm:h-[7rem] sm:w-[7.2rem] rounded-[10px] flex flex-col items-center
														 p-6"
            >
              <div className="flex ">
                <img className="" src={`token2.png`} />
                <h1 className="text-[#141414] font-bold text-lg sm:text-2x ml-2">
                  {user.tokenBalance}
                </h1>
              </div>
              <h1 className="text-[#141414] font-medium text-xs mt-1 ">
                Token Balance
              </h1>
            </div>
          </div>
        </div>
      )}
      {/* {modalIsOpen && (
        <SignOutModal modal={setModalIsOpen} handleSignOut={handleSignOut} />
      )} */}
    </div>
  );
};

export default Navbar;
