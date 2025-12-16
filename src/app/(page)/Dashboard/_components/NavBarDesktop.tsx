"use client"

import useSWR from "swr"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { MdOutlineNotificationsNone } from "react-icons/md"
import SignOutGoogle from "@/app/_components/Login/SignOutGoogle"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Logo from "@/components/utils/Logo"

interface Notification {
  id: string
  type?: string
  message: string
  createdAt: string
  isRead: boolean
  orderId: string
}
const navItems = [
  { label: "الرئيسية", path: "/Dashboard" },
  { label: "المنتجات", path: "/Dashboard/ProductManagment" },
  { label: "اضافة منتج", path: "/Dashboard/ProductManagment/add-product" },
  { label: "الطلبات", path: "/Dashboard/OrderTrackingPage" },
  { label: "الموردين", path: "/Dashboard/supplier" },
  { label: "المخزن", path: "/Dashboard/products-dropwave" },
  { label: "الاعدادات", path: "/Dashboard/setting/store" },
]
const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function NavBarForDesktop() {
  const { data: session } = useSession()
  const router = useRouter()
  const [openUserMenu, setOpenUserMenu] = useState(false)
  const [openNotifications, setOpenNotifications] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navItems = [
    { label: "الرئيسية", path: "/Dashboard" },
    { label: "المنتجات", path: "/Dashboard/ProductManagment" },
    { label: "اضافة منتج", path: "/Dashboard/ProductManagment/add-product" },
    {
      label: "الطلبات",
      path: `${session?.user.role === "SUPPLIER" ? "/Dashboard/OrderTrackingPage/SupplierOrderTrackingPage" : "/Dashboard/OrderTrackingPage"}`,
    },
    { label: "الموردين", path: "/Dashboard/supplier" },
    { label: "المخزن", path: "/Dashboard/products-dropwave" },
    { label: "الاعدادات", path: "/Dashboard/setting/store" },
  ]
  const { data: notifications, mutate } = useSWR<Notification[]>(
    session?.user?.id ? `/api/notifications?userId=${session.user.id}` : null,
    fetcher,
  )

  const { data: unreadNotifications } = useSWR<Notification[]>(
    session?.user?.id ? `/api/notifications/unread/${session.user.id}` : null,
    fetcher,
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenUserMenu(false)
        setOpenNotifications(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "PATCH" })
      mutate((current) => current?.map((n) => (n.id === id ? { ...n, isRead: true } : n)) || [], false)
    } catch (err) {
      console.error("Error marking notification as read:", err)
    }
  }

  if (!session?.user) return null

  return (
    <div
      dir="rtl"
      ref={dropdownRef}
      className="z-50 mb-2 hidden w-full items-center justify-between border-b-2  border-gray-200/60 bg-white/80 px-8 py-4 backdrop-blur-md md:flex"
    >
      <div className="flex items-center gap-12">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <Logo />
        </Link>

        <nav className="hidden gap-8 text-sm font-medium text-gray-700 lg:flex">
          {navItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.path}
              className="relative transition-colors duration-300 hover:text-gray-900 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-gray-900 after:transition-all after:duration-300 hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => {
              setOpenNotifications(!openNotifications)
              setOpenUserMenu(false)
            }}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200/60 bg-gray-50/50 transition-all duration-300 hover:border-gray-300 hover:bg-gray-100/80 hover:shadow-sm"
          >
            <MdOutlineNotificationsNone className="text-xl text-gray-700" />
            {unreadNotifications && unreadNotifications.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 text-xs font-semibold text-white shadow-md">
                {unreadNotifications.length}
              </span>
            )}
          </button>

          {openNotifications && (
            <div className="absolute left-0 z-50 mt-3 w-80 animate-in fade-in slide-in-from-top-2 duration-200 rounded-xl border border-gray-200/60 bg-white/95 shadow-xl backdrop-blur-md">
              <div className="border-b border-gray-100 px-5 py-3 text-sm font-semibold text-gray-900">الإشعارات</div>
              {!notifications || notifications.length === 0 ? (
                <div className="p-6 text-center text-sm text-gray-500">لا توجد إشعارات</div>
              ) : (
                <ul className="max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <Link
                      key={n.id}
                      href={`/Dashboard/orderDetails/${n.orderId}`}
                      onClick={() => markAsRead(n.id)}
                      className="block transition-colors duration-200 hover:bg-gray-50/80"
                    >
                      <li className="flex items-center gap-3 px-5 py-3">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-semibold shadow-sm transition-all ${
                            !n.isRead
                              ? "bg-gradient-to-br from-emerald-400 to-emerald-500 text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {n.type ?? "إ"}
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium text-gray-900">{n.message}</span>
                          <time className="text-xs text-gray-500">
                            {new Date(n.createdAt).toLocaleDateString("ar-EG", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </time>
                        </div>
                      </li>
                    </Link>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setOpenUserMenu(!openUserMenu)
              setOpenNotifications(false)
            }}
            className="flex items-center gap-3 rounded-xl p-1.5 transition-all duration-300 hover:bg-gray-50/80"
          >
            <div className="flex flex-col gap-0.5 text-end">
              <span className="hidden text-xs font-semibold text-gray-900 sm:block">
                {session.user.name?.split(" ")[0]}
              </span>
              <span className="hidden text-xs text-gray-500 sm:block">{session.user.email?.split(" ")[0]}</span>
            </div>
            <div className="relative">
              <Image
                src={(session.user.image as string) || "/placeholder.svg"}
                alt={session.user.name as string}
                width={40}
                height={40}
                className="rounded-xl object-cover ring-2 ring-gray-100 transition-all duration-300 hover:ring-gray-200"
              />
            </div>
          </button>

          {openUserMenu && (
            <div className="absolute left-0 z-50 mt-3 w-52 animate-in fade-in slide-in-from-top-2 duration-200 rounded-xl border border-gray-200/60 bg-white/95 shadow-xl backdrop-blur-md">
              <ul className="flex flex-col gap-1 p-2 text-sm text-gray-700">
                <li>
                  <button className="w-full rounded-lg px-4 py-2.5 text-right font-medium transition-colors duration-200 hover:bg-gray-100/80">
                    الملف الشخصي
                  </button>
                </li>
                <hr className="my-1 border-gray-200/60" />
                <li>
                  <SignOutGoogle />
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
