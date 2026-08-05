"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminButton() {
  const [isAdminLocal, setIsAdminLocal] = useState(false);

  useEffect(() => {
    if (window.location.hostname === "localhost") {
      setIsAdminLocal(true);
    }
  }, []);

  if (!isAdminLocal) return null;

  return (
    <Link href="/admin" className="text-yellow-400 hover:text-yellow-300 transition font-bold">
      Admin
    </Link>
  );
}