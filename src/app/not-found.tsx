import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { COMPANY } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md mx-auto">
        <div className="w-20 h-20 mx-auto flex items-center justify-center rounded-2xl bg-accent/10 text-accent mb-8">
          <AlertTriangle size={40} />
        </div>
        <h1 className="text-6xl font-bold text-text-primary mb-4">404</h1>
        <h2 className="text-2xl font-bold uppercase tracking-wider text-text-primary mb-4">
          Page Not Found
        </h2>
        <p className="text-text-secondary leading-relaxed mb-8">
          The structural pathway you are looking for has been deprecated or never existed in our system architecture.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold text-bg-primary bg-accent rounded-lg hover:bg-accent-hover transition-all duration-200"
        >
          <ArrowLeft size={16} />
          Return to Hub
        </Link>
      </div>
    </div>
  );
}
