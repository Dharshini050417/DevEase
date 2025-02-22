export function Navbar({ children }) {
    return (
      <nav className="bg-black text-white border border-white backdrop-blur-md shadow-md px-6 py-3 flex justify-between items-center">
        {children}
      </nav>
    );
  }
  
  export function NavbarBrand({ children }) {
    return <div className="text-2xl font-bold text-white">{children}</div>;
  }
  
  export function NavbarContent({ children }) {
    return <div className="flex space-x-6">{children}</div>;
  }
  
  export function NavbarItem({ children }) {
    return <div className="text-white hover:text-gray-300 cursor-pointer">{children}</div>;
  }
  