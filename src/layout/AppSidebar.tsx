"use client";
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  ChevronDownIcon,
  GridIcon,
  UserCircleIcon,
  UserIcon,
  HorizontaLDots,
} from "../icons/index";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
  section?: string;
};

const navItems: NavItem[] = [
  // --- MAIN MENU ---
  {
    name: "Dashboard",
    icon: <GridIcon />,
    path: "/",
  },
  {
    name: "Setup Master",
    icon: <UserIcon />,
    subItems: [
      { name: "Users", path: "/setup/users" },
      { name: "Departments", path: "/setup/departments" },
      { name: "Drivers", path: "/setup/drivers" },
      { name: "Shifts", path: "/setup/shifts" },
      { name: "Vehicles", path: "/setup/vehicles" },
    ],
  },

  // --- MANAGEMENT PAGES ---
  {
    section: "Managements Pages",
    name: "Driver Requests",
    icon: <UserIcon />,
    path: "/drivers",
  },
  {
    name: "Visitor Management",
    icon: <UserCircleIcon />,
    path: "/visitors",
  },

  // --- REPORTS ---
  {
    section: "Reports",
    name: "Trip Reports",
    icon: <UserIcon />,
    path: "/reports/trips",
  },
  {
    name: "Visit Reports",
    icon: <UserIcon />,
    path: "/reports/visits",
  },

  // --- OTHERS ---
  {
    section: "Others",
    name: "Settings",
    icon: <UserIcon />,
    path: "/settings",
  },
  {
    name: "Log Out",
    icon: <UserIcon />,
    path: "/logout",
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.replace("/signin");
      } else {
        console.error("Logout gagal:", await res.text());
      }
    } catch (err) {
      console.error("Error logout:", err);
    }
  };

  // handle submenu toggle
  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu((prev) => (prev === index ? null : index));
  };

  // update submenu height
  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `main-${openSubmenu}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const renderMenuItems = useMemo(
    () => (
      <ul className="flex flex-col gap-4">
        {navItems.map((nav, index) => (
          <React.Fragment key={nav.name}>
            {/* === Section Header === */}
            {nav.section && (
              <h3
                className={`border-t pt-6 mb-2 text-xs uppercase tracking-wide text-gray-400 transition-all duration-200
                  ${
                    !isExpanded && !isHovered && !isMobileOpen
                      ? "opacity-0 h-0 overflow-hidden"
                      : "opacity-100 h-auto"
                  }
                `}
              >
                {nav.section}
              </h3>
            )}

            {/* === Main Menu or Dropdown === */}
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(index)}
                className={`menu-item group cursor-pointer transition-all duration-200
                  ${openSubmenu === index ? "menu-item-active" : "menu-item-inactive"}
                  ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}
                `}
              >
                <span
                  className={`${
                    openSubmenu === index
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <>
                    <span className="menu-item-text">{nav.name}</span>
                    <ChevronDownIcon
                      className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                        openSubmenu === index ? "rotate-180 text-brand-500" : ""
                      }`}
                    />
                  </>
                )}
              </button>
            ) : nav.path === "/logout" ? (
              // === Log Out button ===
              <button
                onClick={handleLogout}
                className={`menu-item group transition-all duration-200
                  ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}
                `}
              >
                <svg
                  className="fill-gray-500 group-hover:fill-gray-700 dark:group-hover:fill-gray-300"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.1007 19.247C14.6865 19.247 14.3507 18.9112 14.3507 18.497L14.3507 14.245H12.8507V18.497C12.8507 19.7396 13.8581 20.747 15.1007 20.747H18.5007C19.7434 20.747 20.7507 19.7396 20.7507 18.497L20.7507 5.49609C20.7507 4.25345 19.7433 3.24609 18.5007 3.24609H15.1007C13.8581 3.24609 12.8507 4.25345 12.8507 5.49609V9.74501L14.3507 9.74501V5.49609C14.3507 5.08188 14.6865 4.74609 15.1007 4.74609L18.5007 4.74609C18.9149 4.74609 19.2507 5.08188 19.2507 5.49609L19.2507 18.497C19.2507 18.9112 18.9149 19.247 18.5007 19.247H15.1007ZM3.25073 11.9984C3.25073 12.2144 3.34204 12.4091 3.48817 12.546L8.09483 17.1556C8.38763 17.4485 8.86251 17.4487 9.15549 17.1559C9.44848 16.8631 9.44863 16.3882 9.15583 16.0952L5.81116 12.7484L16.0007 12.7484C16.4149 12.7484 16.7507 12.4127 16.7507 11.9984C16.7507 11.5842 16.4149 11.2484 16.0007 11.2484L5.81528 11.2484L9.15585 7.90554C9.44864 7.61255 9.44847 7.13767 9.15547 6.84488C8.86248 6.55209 8.3876 6.55226 8.09481 6.84525L3.52309 11.4202C3.35673 11.5577 3.25073 11.7657 3.25073 11.9984Z"
                    fill=""
                  />
                </svg>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">Sign out</span>
                )}
              </button>
            ) : (
              // === Regular Link ===
              nav.path && (
                <Link
                  href={nav.path}
                  className={`menu-item group transition-all duration-200
                    ${
                      isActive(nav.path)
                        ? "menu-item-active"
                        : "menu-item-inactive"
                    }
                  `}
                >
                  <span
                    className={`${
                      isActive(nav.path)
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    }`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text">{nav.name}</span>
                  )}
                </Link>
              )
            )}

            {/* === Submenu Dropdown === */}
            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={(el) => {
                  subMenuRefs.current[`main-${index}`] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height:
                    openSubmenu === index
                      ? `${subMenuHeight[`main-${index}`]}px`
                      : "0px",
                }}
              >
                <ul className="mt-2 space-y-1 ml-9">
                  {nav.subItems.map((subItem) => (
                    <li key={subItem.name}>
                      <Link
                        href={subItem.path}
                        className={`menu-dropdown-item transition-all duration-200 ${
                          isActive(subItem.path)
                            ? "menu-dropdown-item-active"
                            : "menu-dropdown-item-inactive"
                        }`}
                      >
                        {subItem.name}
                        {(subItem.new || subItem.pro) && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            {subItem.new ? "new" : "pro"}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </React.Fragment>
        ))}
      </ul>
    ),
    [
      isExpanded,
      isHovered,
      isMobileOpen,
      openSubmenu,
      subMenuHeight,
      isActive,
    ]
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
      ${
        isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
          ? "w-[290px]"
          : "w-[90px]"
      }
      ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className="dark:hidden border-b pb-6"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={250}
                height={80}
                priority
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
                priority
              />
            </>
          ) : (
            <Image
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
              priority
            />
          )}
        </Link>
      </div>

      {/* Menu */}
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <h2
            className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
              !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
            }`}
          >
            {isExpanded || isHovered || isMobileOpen ? "Menu" : <HorizontaLDots />}
          </h2>
          {renderMenuItems}
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
