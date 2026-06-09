"use client";

import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/context/AuthProvider";
import { CheckCircle, XCircle, DollarSign } from "lucide-react";
import Link from "next/link";

export default function NotificationsPage() {
  const { user } = useContext(AuthContext);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    let isMounted = true;

    const loadNotifications = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `/api/notifications?email=${user.email}&role=${user.role}`,
        );

        const data = await res.json();

        if (isMounted) {
          setNotifications(
            Array.isArray(data?.notifications) ? data.notifications : [],
          );
        }
      } catch (error) {
        console.log(error);
        if (isMounted) {
          setNotifications([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadNotifications();

    return () => {
      isMounted = false;
    };
  }, [user?.email, user?.role]);

  if (loading) {
    return (
      <div className="p-6 text-center font-bold">Loading notifications...</div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-black mb-4">Notifications</h1>

      <div className="space-y-4">
        {notifications.length === 0 && (
          <p className="text-gray-500">No notifications yet</p>
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
              {n.type === "info" && <DollarSign className="text-emerald-500" />}

              <div>
                <h3 className="font-bold">{n.message}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(n.createdAt).toLocaleString()}
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
