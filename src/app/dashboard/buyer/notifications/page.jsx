"use client";

import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/context/AuthProvider";
import { CheckCircle, XCircle, Info } from "lucide-react";
import Link from "next/link";

export default function BuyerNotificationsPage() {
  const { user } = useContext(AuthContext);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/notifications?email=${user?.email}&role=buyer`,
      );

      const data = await res.json();

      // ✅ FIXED
      setNotifications(
        Array.isArray(data?.notifications) ? data.notifications : [],
      );
    } catch (error) {
      console.log(error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) fetchNotifications();
  }, [user]);

  if (loading) {
    return (
      <div className="p-6 text-center font-bold">
        Loading buyer notifications...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-black mb-4">Buyer Notifications</h1>

      <div className="space-y-4">
        {notifications.length === 0 && (
          <p className="text-gray-500">No notifications found</p>
        )}

        {notifications.map((n) => (
          <div
            key={n._id}
            className="p-5 rounded-xl bg-white dark:bg-slate-900 border"
          >
            <div className="flex gap-3">
              {n.type === "success" && (
                <CheckCircle className="text-green-500" />
              )}
              {n.type === "error" && <XCircle className="text-red-500" />}
              {n.type === "info" && <Info className="text-emerald-500" />}

              <div>
                <h3 className="font-bold">{n.message}</h3>
                <p className="text-sm text-gray-500">
                  {n.time ? new Date(n.time).toLocaleString() : "No date"}
                </p>
              </div>
            </div>

            {n.actionRoute && (
              <Link
                href={n.actionRoute}
                className="inline-block mt-2 text-sm px-3 py-1 bg-emerald-500 text-white rounded"
              >
                View
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
