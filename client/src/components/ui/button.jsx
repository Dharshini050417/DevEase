export function Button({ children, onClick = () => {}, className = "", type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-6 py-3 bg-[var(--ds-gray-1000)] text-white text-lg font-medium
                  transition-all duration-300 ease-in-out
                  hover:bg-white hover:text-[var(--ds-gray-1000)] focus:outline-none ${className}`}
    >
      {children}
    </button>
  );
}
