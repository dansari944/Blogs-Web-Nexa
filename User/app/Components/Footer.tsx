import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <Logo light />
            <p className="text-gray-400 text-sm mt-3 max-w-sm">
              Digital marketing insights, strategies, and tech trends to grow your business.
            </p>
          </div>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 text-gray-400 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <p>© 2024 ChatterBuzz Media. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
