"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminLink() {
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hostname === "localhost") {
      setShowAdmin(true);
    }
  }, []);

  if (!showAdmin) return null;

  return (
    <Link href="/admin" className="text-yellow-400 hover:text-yellow-300 transition font-bold">
      Admin
    </Link>
  );
}