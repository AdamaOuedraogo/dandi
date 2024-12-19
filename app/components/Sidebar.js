import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  LightBulbIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  DocumentDuplicateIcon,
  BookOpenIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Overview",
      href: "/dashboards",
      icon: HomeIcon,
    },
    {
      name: "Research Assistant",
      href: "/research-assistant",
      icon: LightBulbIcon,
    },
    {
      name: "Research Reports",
      href: "/research-reports",
      icon: DocumentTextIcon,
    },
    {
      name: "API Playground",
      href: "/api-playground",
      icon: CodeBracketIcon,
    },
    {
      name: "Invoices",
      href: "/invoices",
      icon: DocumentDuplicateIcon,
    },
    {
      name: "Documentation",
      href: "/documentation",
      icon: BookOpenIcon,
    },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r flex flex-col">
      {/* Logo and close button */}
      <div className="p-6 flex justify-between items-center">
        <h1 className="text-xl font-bold">Dandi AI</h1>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-gray-100 lg:hidden"
        >
          <XMarkIcon className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 ${
                isActive
                  ? "bg-purple-50 text-purple-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
